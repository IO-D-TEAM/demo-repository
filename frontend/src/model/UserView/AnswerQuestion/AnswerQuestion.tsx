import React, { FC, useEffect, useState } from "react";
import "./AnswerQuestion.css";
import { Question } from "../../../interfaces/Question";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { sendAnswer } from "../../../services/ClientInfo/ClientInfo/ClientInfo";

interface AnswerQuestionProps {
  question: Question | null;
  gameCode: string | undefined;
  id: string | undefined;
}

const AnswerQuestion: FC<AnswerQuestionProps> = ({
  question,
  gameCode,
  id,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    // tutaj wysyłam na backend odpowiedź
    console.log(selectedValue);
    sendAnswer(selectedValue, gameCode, id);
  };

  const handleChange = (event: any) => {
    const value = (event.target as HTMLInputElement).value;
    setSelectedValue(value);
    console.log(selectedValue);
  };

  return (
    <div className="coint">
      <form onSubmit={handleSubmit}>
        <div className="question">
          <FormLabel style={{ fontSize: "2rem", padding: "1rem" }}>
            {question?.question}
          </FormLabel>
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
                submitted && answer === question.correctAnswer
                  ? "correct"
                  : submitted
                  ? "incorrect"
                  : ""
              }`}
              value={answer}
              control={<Radio />}
              label={answer}
              onChange={(event) => handleChange(event)}
              disabled={submitted}
            />
          ))}
        </RadioGroup>

        <Button
          type="submit"
          variant="contained"
          disabled={submitted || selectedValue === ""}
        >
          Odpowiedz
        </Button>
      </form>
    </div>
  );
};
export default AnswerQuestion;
