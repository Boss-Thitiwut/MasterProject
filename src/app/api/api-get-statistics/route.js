import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";
import { Matrix, EVD, inverse } from "ml-matrix";

// KMO calculation
function calculateKMO(matrix) {
  const X = new Matrix(matrix);
  const correlation = X.transpose().mmul(X);

  let partial;
  try {
    partial = inverse(correlation);
  } catch (e) {
    console.warn("⚠️ KMO calculation failed: matrix is singular.");
    return null;
  }

  let r2Sum = 0;
  let pr2Sum = 0;

  const k = correlation.columns;
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        const r2 = correlation.get(i, j) ** 2;
        const pr2 = partial.get(i, j) ** 2;
        r2Sum += r2;
        pr2Sum += pr2;
      }
    }
  }

  const kmo = r2Sum / (r2Sum + pr2Sum);
  return Number(kmo.toFixed(3));
}

// Explained Variance & Factor Loading via PCA (EVD)
function calculatePCA(matrix) {
  const X = new Matrix(matrix);
  const meanCentered = X.clone().subRowVector(X.mean("column"));
  const covarianceMatrix = meanCentered.transpose().mmul(meanCentered).div(X.rows - 1);
  const evd = new EVD(covarianceMatrix);

  const eigenvalues = evd.realEigenvalues;
  const total = eigenvalues.reduce((a, b) => a + b, 0);
  const explainedVariance = eigenvalues.map(e => Number(((e / total) * 100).toFixed(2)));

  const factorLoading = evd.eigenvectorMatrix.to2DArray().map(row =>
    row.map(val => Number(val.toFixed(3)))
  );

  return { explainedVariance, factorLoading };
}

// API MAIN HANDLER
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const setId = searchParams.get("setId");

    if (!role || !setId) {
      return new Response(JSON.stringify({ success: false, error: "Missing role or setId." }), { status: 400 });
    }

    const responses = await SurveyResponse.find({ role, questionSetId: setId });
    if (!responses || responses.length < 2) {
      return new Response(JSON.stringify({ success: false, error: "Not enough responses." }), { status: 400 });
    }

    const matrix = responses.map(res =>
      res.answers.sort((a, b) => a.questionIndex - b.questionIndex).map(a => a.score)
    );

    const allSameLength = matrix.every(row => row.length === matrix[0].length);
    if (!allSameLength) {
      return new Response(JSON.stringify({ success: false, error: "Mismatch in number of answers." }), { status: 400 });
    }

    // ✅ Add Debug Logs here (before calculation)
    console.log("✅ matrix length:", matrix.length);
    console.log("✅ matrix row length:", matrix[0]?.length);
    console.log("✅ matrix preview:", matrix);

    const { explainedVariance, factorLoading } = calculatePCA(matrix);
    const kmo = calculateKMO(matrix);

    return new Response(
      JSON.stringify({
        success: true,
        role,
        questionSetId: setId,
        respondentCount: matrix.length,
        questionCount: matrix[0].length,
        explainedVariance,
        factorLoading,
        kmo
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/api-get-statistics:", err);
    return new Response(JSON.stringify({ success: false, error: "Server error." }), { status: 500 });
  }
}
