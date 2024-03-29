import React from "react";
import "./Question.css";


interface Props {
    question: string;
    answers: string[];
    correctAnswer: string;
}


const Question = (props: Props) => {
    return (
        <div className="question-wrap">
            <div className="question">
                <h2>{props.question}</h2>
            </div>
            <div className="answers">
                {
                    props.answers.map((asnwer) => (
                        <div className="answer">
                            <p>{asnwer}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}


export default Question;