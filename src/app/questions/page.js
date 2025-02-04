'use client';

import { useState } from 'react';

export default function SurveyPage() {
    const [step, setStep] = useState('survey-selection');
    const [selectedSurvey, setSelectedSurvey] = useState('');
    const [responses, setResponses] = useState([]);

    const surveys = {
        "Employees Perception of Support": [
            'ฉันมีความเป็นมิตรมาก ๆ กับเพื่อนร่วมงานหนึ่งคนหรือมากกว่านั้น',
            'ฉันทำกิจกรรมนอกเวลาทำงานกับเพื่อนร่วมงานหนึ่งคนหรือมากกว่านั้นเป็นประจำ',
            'ฉันแทบจะไม่เคยพูดคุยถึงปัญหาส่วนตัวที่สำคัญกับเพื่อนร่วมงานเลย',
        ],
        "Employees Perception of Commitment": [
            'ฉันจะได้รับรางวัลหากฉันพัฒนาประสิทธิภาพการทำงานของฉัน',
            'ฉันมีโอกาสสูงที่จะเลื่อนตำแหน่งและก้าวหน้าในบริษัทนี้',
        ],
        "Employees Perception of Complexity": [
            'ฉันรู้สึกเครียดและเหนื่อยล้าในงานของฉัน',
            'ตารางงานของฉันรบกวนชีวิตครอบครัวของฉัน',
        ],
    };

    const handleSurveySelection = (survey) => {
        setSelectedSurvey(survey);
        setResponses(Array(surveys[survey].length).fill(null));
        setStep('survey');
    };

    const handleResponseChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    const handleSubmit = () => {
        console.log('User Responses:', responses);
        alert('Thank you for completing the survey!');
        // Reset to the survey selection step
        setSelectedSurvey('');
        setResponses([]);
        setStep('survey-selection'); // Navigate back to survey selection
    };

    return (
        <div className="homepage-container">
            {step === 'survey-selection' && (
                <div className="card">
                    <h1 className="card-title">Select a Survey</h1>
                    <div className="button-group">
                        {Object.keys(surveys).map((surveyKey) => (
                            <button
                                key={surveyKey}
                                onClick={() => handleSurveySelection(surveyKey)}
                                className="tab-button"
                            >
                                {surveyKey}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'survey' && (
                <div className="question-container">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <h1 className="card-title">Survey: {selectedSurvey}</h1>
                        <div className="question-list">
                            {surveys[selectedSurvey].map((question, index) => (
                                <div key={index} className="question-item">
                                    <p>{index + 1}. {question}</p>
                                    <div className="options">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <label key={value}>
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={value}
                                                    onChange={() => handleResponseChange(index, value)}
                                                    required
                                                />
                                                {value}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
