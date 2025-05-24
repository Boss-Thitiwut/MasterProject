import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";

// Utility to transpose matrix
const transpose = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]));

// Calculate Cronbach’s Alpha from 2D matrix
function calculateCronbachAlphaMatrix(matrix) {
  const k = matrix[0].length; // number of questions
  const n = matrix.length;    // number of respondents

  if (k <= 1 || n <= 1) return null;

  // Variance for each item (column)
  const itemMeans = Array(k).fill(0).map((_, j) =>
    matrix.reduce((sum, row) => sum + row[j], 0) / n
  );

  const itemVariances = itemMeans.map((mean, j) =>
    matrix.reduce((sum, row) => sum + Math.pow(row[j] - mean, 2), 0) / (n - 1)
  );

  // Total score per respondent
  const totalScores = matrix.map(row => row.reduce((a, b) => a + b, 0));
  const totalMean = totalScores.reduce((a, b) => a + b, 0) / n;

  const totalVariance = totalScores.reduce(
    (sum, val) => sum + Math.pow(val - totalMean, 2),
    0
  ) / (n - 1);

  if (totalVariance === 0) return null;

  const sumItemVariance = itemVariances.reduce((a, b) => a + b, 0);
  const alpha = (k / (k - 1)) * (1 - (sumItemVariance / totalVariance));

  return Number(alpha.toFixed(3));
}

// MAIN API HANDLER
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const setId = searchParams.get("setId");

    if (!role || !setId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing role or setId." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const responses = await SurveyResponse.find({
      role,
      questionSetId: setId
    });

    if (!responses || responses.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "Not enough responses for calculation." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build response matrix (each row = one person's scores)
    const matrix = responses.map(res =>
      res.answers
        .sort((a, b) => a.questionIndex - b.questionIndex)
        .map(a => a.score)
    );

    // Safety check: rows must be equal length
    const allSameLength = matrix.every(row => row.length === matrix[0].length);
    if (!allSameLength) {
      return new Response(
        JSON.stringify({ success: false, error: "Mismatch in number of answers." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cronbachAlpha = calculateCronbachAlphaMatrix(matrix);

    return new Response(
      JSON.stringify({
        success: true,
        role,
        questionSetId: setId,
        respondentCount: matrix.length,
        questionCount: matrix[0].length,
        cronbachAlpha,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in /api-get-cronbach-by-role:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
