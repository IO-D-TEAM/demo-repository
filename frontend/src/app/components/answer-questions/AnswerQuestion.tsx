import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { FC, useState } from "react";
import { Question } from "../../models/Question";
import { sendAnswer } from "../../services/client.info.service";
import "./AnswerQuestion.css";

interface AnswerQuestionProps {
  question: Question | null;
  gameCode: string | undefined;
  id: string | undefined;
  parentCallback: (msg: boolean) => void;
}

const AnswerQuestion: FC<AnswerQuestionProps> = ({
  question,
  gameCode,
  id,
  parentCallback,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Answer Question: selected answer: {}", selectedAnswer);

    sendAnswer(selectedAnswer, gameCode, id);
    setQuestionAnswered(true);
    parentCallback(true);
  };

  const handleChange = (event: any) => {
    console.log("Answer Question: handleChange answer: {}", event.target.value);
    setSelectedAnswer(event.target.value);
  };

  return (
    <div className="coint">
      <form onSubmit={handleSubmit}>
        <div className="question">
          <FormLabel className="form_label">{question?.question}</FormLabel>
        </div>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          className="answers"
        >
          {question?.answers.map((answer, index) => (
            <FormControlLabel
              key={index}
              className={`answer ${
                questionAnswered && answer === question.correctAnswer
                  ? "correct"
                  : questionAnswered
                  ? "incorrect"
                  : ""
              }`}
              value={answer}
              control={<Radio />}
              label={answer}
              onChange={(event) => handleChange(event)}
              disabled={questionAnswered}
            />
          ))}
        </RadioGroup>

        <Button
          type="submit"
          variant="contained"
          disabled={questionAnswered || selectedAnswer === ""}
        >
          Odpowiedz
        </Button>
      </form>
    </div>
  );
};
export default AnswerQuestion;
