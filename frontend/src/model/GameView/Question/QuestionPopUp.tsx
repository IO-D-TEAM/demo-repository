import React from "react";
import "./QuestionPopUp.css";
import { Question } from "../../../interfaces/GameViewInterfaces/Question";


interface Props {
    question: Question;
}

interface GridPos {
    row: number;
    column: number;
    answer: string;
}

const QuestionPopUp = (props: Props) => {
    const gridPositions: GridPos[] = [
        {row: 1, column: 1, answer: "A"}, {row: 1, column: 2, answer: "B"},
        {row: 2, column: 1, answer: "C"}, {row: 2, column: 2, answer: "D"}
    ];

    // Just like all css on this board it's crap but hopefull it works
    const gridShape: React.CSSProperties = {
        display: "grid",
        gridTemplateRows: `repeat(${props.question.answers.length > 2 ? 2 : 1}, 1fr)`,
        gridTemplateColumns: `repeat(2, 1fr)`
    };
    
    return (
        <div className="question-wrap">
            <div className="question-div">
                <h1>{props.question.question}</h1>
            </div>
            <div className="answers" style={gridShape}>
                {
                    props.question.answers.map((answer, i) => (
                        <div className="answer-div" style={{
                            gridRow: gridPositions[i].row,
                            gridColumn: gridPositions[i].column
                        }}>
                            <h3>{`${gridPositions[i].answer}: ${answer}`}</h3>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}


export default QuestionPopUp;