import React, { FC, useState, useEffect } from 'react';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import "./QuestionEdit.css"
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { OutlinedInput, FormHelperText } from '@mui/material';
import QuestionValidationService from '../../../../services/QuestionsCreating/QuestionValidator';
import { useQuestionService }  from './../../../../services/QuestionsCreating/QuestionsCreatingService';

interface QuestionEditProps {
}

export const QuestionEdit: FC<QuestionEditProps> = ()  => {

  // Mock Question
  const [question, setQuestion] = useState<QuestionInterface>({
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    answers: ["Paris", "Berlin", "London", "Madrid"]
  });

  const [checked, setChecked] =  useState<number | null>(null);
  const [buttonClicked, setButtonClicked] = useState(true);
  const [buttonIndex, setButtonIndex] = useState<number|null>(null);
  const [newAnswerValue, setNewAnswerValue] = useState<string>("Wpisz swoją odpowiedź");
  const [rerenderKey, setRerenderKey] = useState<string>('a'); 
  const [error, setError] = useState<string>("");
  const questionService = useQuestionService(); // Access the QuestionService instance

  /* Subscribeses for changes in QuestionService, 
      and gets actual edited question. Main functionality is 
      to subscribe service to know when edited question is changed.   */
  useEffect(()  => {
    const handleActualQuestionChange = (question: QuestionInterface) => {
      setNewAnswerValue("Wpisz swoją odpowiedź");
      setQuestion(question);
      setChecked(question.answers.indexOf(question.correctAnswer));

      try{
        QuestionValidationService.validateQuestion(question, questionService.getQuestions());
        setError("");
      } catch(error){
        if(error instanceof Error)
          setError(error.message);
      }

      setRerenderKey(prevKey => prevKey === 'a' ? 'b' : 'a');
    };

    questionService.subscribe(handleActualQuestionChange, "question");

    return () => {
      questionService.unsubscribe(handleActualQuestionChange);
    };
  }, [questionService]);

  /* Update question, change current question answers to new */
  const handleAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) :void => {

    if(question.answers.indexOf(event.target.value) !== -1){
      setError("Odpowiedzi nie mogą się powtarzać!");
      return;
    }

    question.answers[index] = event.target.value;
    questionService.updateQuestionAnswers(question.answers); // Update question answers with new ones

    if(checked === index)
      questionService.updateCorrectAnswer(event.target.value);

    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: question.answers })) // Re-render answers on page
  });

  /* Update question, change current questions to new*/
  const handleQeustionChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) :void => {
    questionService.updateQuestionValue(event.target.value); // Update current edited question with new value
    setQuestion(prevQuestion => ({ ...prevQuestion!, question: event.target.value })); // Re-render question on page
  });

  /* Update correct answer */
  const changeChecked = ((index: number, answer: string) : void => {
    questionService.updateCorrectAnswer(answer);
    setChecked(index);
  });

  const handleNewAnswer = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) :void => {
    if(questionService.getActualQuestion().answers.length >= 4){
      setError("Maksymalna liczba odpowiedzi wynosi 4!");
      return;
    }

    if(questionService.getActualQuestion().answers.indexOf(newAnswerValue) !== -1){
      setError("Ta odpowiedź już istnieje!")
      return;
    }

    const newAnswers = [...(question?.answers || []), newAnswerValue]; // Get CURRENT question answers
    questionService.updateQuestionAnswers(newAnswers); // Update question answers with new ones
    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers })) // Re-render answers on page
  });

  const handleButtonClick = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) : void => {
    if (buttonIndex != null) 
      setButtonClicked(index === buttonIndex);
    else 
      setButtonClicked(false);
    
    setButtonIndex(index);
  });

  const saveChanges = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) : void => {
    if(error === "")
      questionService.saveChanges();      
  });

  const handleDeleteAnswer = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) : void => {
    const newAnswers = [...(question?.answers || [])]; 
    newAnswers.splice(index, 1);
    questionService.updateQuestionAnswers(newAnswers); // Update question answers with new ones    

    if(index === checked)
      changeChecked(0, question.answers[0] ? question.answers[0] as string : ""); // Set first answer as correct

    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers })) // Re-render answers on page
    });

  const handleNewAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) : void => {
    setNewAnswerValue(event.target.value);
  })

  return (
    <div>
  <List>
    {question && (
      <ListItem alignItems="center">
        <Box className="mainBox" sx={{marginTop: '10px'}}>

          <TextField // Question 
            fullWidth
            placeholder='Wpisz swoje pytanie!'
            value={question.question}
            onChange={(event) => handleQeustionChange(event)} // handleAnswerChange function to handle answer changes
            error={question.question.trim() === ''} 
            helperText={question.question.trim() === '' ? 'Pytanie nie może być puste' : ''}
          />

          {question.answers.map((answer, index) => ( // Answers
            <div key={index} className="answerField">

              <FormControlLabel
                control={
                  <Checkbox
                    checked={answer === question.correctAnswer &&( index === checked || checked === null)}
                    onChange={() => changeChecked(index, answer)}
                  />
                }
                label={""}
              />

              <OutlinedInput 
              disabled={!(!buttonClicked && index === buttonIndex )}
              fullWidth
              id="outlined-disabled"
              value={answer}
              onChange={(event) => handleAnswerChange(event, index)} // handleAnswerChange function to handle answer changes

              endAdornment={
                <InputAdornment position="end">
                  <IconButton  onClick={(event) => handleButtonClick(event, index)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton  edge="end" aria-label="delete"  onClick={(event) => handleDeleteAnswer(event, index)}>
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                'aria-label': 'weight',
              }}
            />

            </div>
          ))}

        <hr style={{ marginTop: '30px' }} />
          <OutlinedInput sx ={{marginTop: '10px'}}
            key={rerenderKey}
            itemID='newAnswerValue'
            fullWidth
            placeholder='Wpisz swoją odpowiedź'
            id="outlined-adornment-weight"
            onChange={handleNewAnswerChange}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />    
          { error &&(
            <FormHelperText error >
              {error}
            </FormHelperText>
          )}
          <Button // Delete question button
            fullWidth
            variant="contained"
            color="success"
            onClick={(event) => handleNewAnswer(event)}
            sx={{ marginTop: '20px' }} // Add margin top to the button
          >
            + Dodaj odpowiedź
          </Button>

          <Button // Delete question button
            fullWidth
            variant="contained"
            color={questionService.getActualIndex() === -1? "secondary": "primary"}
            onClick={(event) => saveChanges(event)}
            sx={{ marginTop: '20px' }} // Add margin top to the button
          >
            {questionService.getActualIndex() === -1? "Dodaj pytanie": "Zapisz zmiany"}
          </Button>

        </Box>
      </ListItem>
    )}
  </List>
</div>
  );
    
};

export default QuestionEdit;
