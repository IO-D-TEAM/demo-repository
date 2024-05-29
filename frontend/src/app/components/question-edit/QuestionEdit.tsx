import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FormHelperText, OutlinedInput } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import React, { FC, useEffect, useState } from "react";
import { useQuestionService } from "../../services/question.create.service";
import QuestionValidationService from "../../services/question.validate.service";
import { Question } from "./../../models/Question";
import "./QuestionEdit.css";

interface QuestionEditProps {}

export const QuestionEdit: FC<QuestionEditProps> = () => {
  // Mock Question
  const [question, setQuestion] = useState<Question>({
    question: "Przykładowe Pytanie",
    correctAnswer: "Odpowiedź 1",
    answers: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4"],
  });

  const [checked, setChecked] = useState<number | null>(null); // Edited Answer
  const [buttonClicked, setButtonClicked] = useState(true); // Editon Answer Guard
  const [buttonIndex, setButtonIndex] = useState<number | null>(null); // Index of Answer Guard
  const [newAnswerValue, setNewAnswerValue] = useState<string>(
    "Wpisz swoją odpowiedź"
  );
  let [rerenderKey, setRerenderKey] = useState<number>(0); // Force re-render key
  const [error, setError] = useState<string>("");
  const questionService = useQuestionService(); // Access the QuestionService instance

  /* Subscribeses for changes in QuestionService, 
    and gets actual edited question. Main functionality is 
    to subscribe service to know when edited question is changed.   */
  useEffect(() => {
    const handleActualQuestionChange = (
      newQuestion: Question,
      index?: number
    ) => {
      if (question.question !== newQuestion.question) setButtonClicked(false);

      setQuestion(newQuestion);
      setChecked(newQuestion.answers.indexOf(newQuestion.correctAnswer));

      try {
        QuestionValidationService.validateQuestion(
          newQuestion,
          questionService.getQuestions()
        );
        setError("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      // This is to force re-render react components on change
      setRerenderKey((prevKey) =>
        prevKey === rerenderKey ? rerenderKey++ : rerenderKey++
      );
      rerenderKey %= 100;
    };

    questionService.subscribe(handleActualQuestionChange, "question");

    return () => {
      questionService.unsubscribe(handleActualQuestionChange);
    };
  }, [questionService]);

  /* Update question, change current question answers to new */
  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ): void => {
    if (question.answers.indexOf(event.target.value) !== -1) {
      setError("Odpowiedzi nie mogą się powtarzać!");
      return;
    }

    if (checked === index)
      questionService.updateCorrectAnswer(event.target.value);

    question.answers[index] = event.target.value;
    questionService.updateQuestionAnswers(question.answers); // Update question answers with new ones

    setQuestion((prevQuestion) => ({
      ...prevQuestion!,
      answers: question.answers,
    })); // Re-render answers on page
  };

  /* Update question, change current questions to new*/
  const handleQeustionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    questionService.updateQuestionValue(event.target.value); // Update current edited question with new value
    setQuestion((prevQuestion) => ({
      ...prevQuestion!,
      question: event.target.value,
    })); // Re-render question on page
  };

  /* Update correct answer */
  const changeChecked = (index: number, answer: string): void => {
    questionService.updateCorrectAnswer(answer);
    setChecked(index);
  };

  const handleNewAnswer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (question.answers.length >= 4) {
      setError("Maksymalna liczba odpowiedzi wynosi 4!");
      setNewAnswerValue("Wpisz swoją odpowiedź!");
      return;
    }

    if (questionService.getActualQuestion().answers.length >= 4) {
      setError("Maksymalna liczba odpowiedzi wynosi 4!");
      setNewAnswerValue("Wpisz swoją odpowiedź!");
      return;
    }

    if (
      questionService.getActualQuestion().answers.indexOf(newAnswerValue) !== -1
    ) {
      setError("Ta odpowiedź już istnieje!");
      return;
    }

    const newAnswers = [...(question?.answers || []), newAnswerValue]; // Get CURRENT question answers
    questionService.updateQuestionAnswers(newAnswers); // Update question answers with new ones
    setQuestion((prevQuestion) => ({ ...prevQuestion!, answers: newAnswers })); // Re-render answers on page
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ): void => {
    // xpp działa bo działa, dlaczego? idk (inaczej nie chce się zmieniać)
    if (buttonClicked && buttonIndex === index) setButtonClicked(false);
    else if (buttonClicked) setButtonClicked(buttonClicked);
    else setButtonClicked(!buttonClicked);

    setButtonIndex(index);
  };

  const saveChanges = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    try {
      QuestionValidationService.validateQuestion(
        question,
        questionService.getQuestions()
      );
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
    }

    if (
      questionService
        .getQuestions()
        .findIndex((item) => item.question == question.question) != -1
    ) {
      setError("Pytania nie mogą się powtarzać!");
      setRerenderKey((prevKey) =>
        prevKey === rerenderKey ? rerenderKey++ : rerenderKey++
      );
      rerenderKey %= 100;
      return;
    }

    questionService.saveChanges();
  };

  const handleDeleteAnswer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ): void => {
    const newAnswers = [...(question?.answers || [])];
    newAnswers.splice(index, 1);
    questionService.updateQuestionAnswers(newAnswers); // Update question answers with new ones

    if (index === checked)
      changeChecked(
        0,
        question.answers[0] ? (question.answers[0] as string) : ""
      ); // Set first answer as correct

    setButtonClicked(false);
    setQuestion((prevQuestion) => ({ ...prevQuestion!, answers: newAnswers })); // Re-render answers on page
  };

  const handleNewAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setNewAnswerValue(event.target.value);
  };

  return (
    <div>
      <List>
        {question && (
          <ListItem alignItems="center">
            <Box className="mainBox" sx={{ marginTop: "10px" }}>
              <TextField // Question
                fullWidth
                placeholder="Wpisz swoje pytanie!"
                value={question.question}
                onChange={(event) => handleQeustionChange(event)} // handleAnswerChange function to handle answer changes
                error={question.question.trim() === ""}
                helperText={
                  question.question.trim() === ""
                    ? "Pytanie nie może być puste"
                    : ""
                }
              />

              {question.answers.map(
                (
                  answer,
                  index // Answers
                ) => (
                  <div key={index} className="answerField">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            answer === question.correctAnswer &&
                            (index === checked || checked === null)
                          }
                          onChange={() => changeChecked(index, answer)}
                        />
                      }
                      label={""}
                    />

                    <OutlinedInput
                      disabled={!(buttonClicked && index === buttonIndex)}
                      fullWidth
                      value={answer}
                      onChange={(event) => handleAnswerChange(event, index)} // handleAnswerChange function to handle answer changes
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={(event) => handleButtonClick(event, index)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(event) =>
                              handleDeleteAnswer(event, index)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </div>
                )
              )}

              <hr style={{ marginTop: "30px" }} />
              <OutlinedInput
                sx={{ marginTop: "10px" }}
                key={rerenderKey}
                fullWidth
                placeholder={newAnswerValue}
                id="outlined-adornment-weight"
                onChange={handleNewAnswerChange}
                inputProps={{
                  "aria-label": "weight",
                }}
              />
              {error && (
                <FormHelperText sx={{ color: "#CD5C5C", fontWeight: "bold" }}>
                  {error}
                </FormHelperText>
              )}
              <Button // Delete question button
                fullWidth
                variant="contained"
                color="success"
                onClick={(event) => handleNewAnswer(event)}
                sx={{ marginTop: "20px",         height: "50px" }} // Add margin top to the button
              >
                + Dodaj odpowiedź
              </Button>

              <Button // Delete question button
                fullWidth
                variant="contained"
                color={
                  questionService.getActualIndex() === -1
                    ? "secondary"
                    : "primary"
                }
                onClick={(event) => saveChanges(event)}
                sx={{ marginTop: "20px",         height: "50px"
              }} // Add margin top to the button
              >
                {questionService.getActualIndex() === -1
                  ? "Dodaj pytanie"
                  : "Zapisz zmiany"}
              </Button>
            </Box>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default QuestionEdit;
