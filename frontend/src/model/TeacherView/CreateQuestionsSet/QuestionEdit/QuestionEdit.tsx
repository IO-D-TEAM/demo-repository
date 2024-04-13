import React, { FC, useState, useEffect } from 'react';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';
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
import { set } from 'react-hook-form';
import QuestionValidationService from '../../../../services/QuestionsCreating/QuestionValidator';

interface QuestionEditProps {
  service: QuestionService;
}

export const QuestionEdit: FC<QuestionEditProps> = ({service})  => {

  const [question, setQuestion] = useState<QuestionInterface | null | undefined>({
      question: "What is the capital of France?",
      correctAnswer: "Paris",
      answers: ["Paris", "Berlin", "London", "Madrid"]
  });
  
  const [checked, setChecked] =  useState<number | null>(null);
  const [buttonClicked, setButtonClicked] = useState(true);
  const [buttonIndex, setButtonIndex] = useState<number|null>(null);
  const [newAnswerValue, setNewAnswerValue] = useState<string>("Wpisz swoją odpowiedź");
  const [rerenderKey, setRerenderKey] = useState<string>('a'); // State variable to trigger rerender
  const [error, setError] = useState<string>("");

  {/* Subscribeses for changes in QuestionService, 
      and gets actual edited question. Main functionality is 
      to subscribe service to know when edited question is changed.   */}
  useEffect(() => {
    const handleActualQuestionChange = () => {
      setNewAnswerValue("Wpisz swoją odpowiedź");
      setRerenderKey(prevKey => prevKey === 'a' ? 'b' : 'a');
      setQuestion(service.getActualQuestion());
      setChecked(service.getActualQuestion().answers.indexOf(service.getActualQuestion().correctAnswer));
      setError("");

      try{
        QuestionValidationService.validateQuestion(service.getActualQuestion())
      } catch(error){
        if(error instanceof Error)
          setError(error.message);
      }

    };

    service.subscribe(handleActualQuestionChange);

    return () => {
      service.unsubscribe(handleActualQuestionChange);
    };
  }, [service]);

  {/* Update question, change current question answers to new ones */}
  const handleAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {

    const newAnswers = [...(question?.answers || [])]; // Get CURRENT question answers
    newAnswers[index] = event.target.value; // Change it with value of new one
    service.updateQuestionAnswers(newAnswers); // Update question answers with new ones

    if(checked == index)
      service.updateCorrectAnswer(event.target.value);

    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers })) // Re-render answers on page
  });

  {/* Update question, change current questions to new*/}
  const handleQeustionChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newQuestion = event.target.value; // New question value
    service.updateQuestionValue(newQuestion); // Update current edited question with new valu
    setQuestion(prevQuestion => ({ ...prevQuestion!, question: newQuestion })); // Re-render question on page
  });

  {/* Update correct answer */}
  const changeChecked = ((index: number, answer: string) => {
    service.updateCorrectAnswer(answer);
    setChecked(index);
  });

  const handleNewAnswer = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(service.getActualQuestion().answers.length >= 4)
      return;

    if(service.getActualQuestion().answers.indexOf(newAnswerValue) != -1)
      return;

    const newAnswers = [...(question?.answers || []), newAnswerValue]; // Get CURRENT question answers
    setNewAnswerValue("Please, enter new answer")
    service.updateQuestionAnswers(newAnswers); // Update question answers with new ones
    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers })) // Re-render answers on page
  });

  const handleButtonClick = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    if(index == buttonIndex && buttonIndex!= null) 
      setButtonClicked(!buttonClicked);

    if(buttonIndex == null)
      setButtonClicked(false)

    setButtonIndex(index);
  });

  const saveChanges = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(error == "")
      service.saveChanges();
  });

  const handleDeleteAnswer = ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    const newAnswers = [...(question?.answers || [])]; 
    newAnswers.splice(index, 1);
    service.updateQuestionAnswers(newAnswers); // Update question answers with new ones    
    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers })) // Re-render answers on page

    if(index == checked)
      changeChecked(0, question?.answers[0] ? question.answers[0] as string : "");  
    });

  const handleNewAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    checked={answer === question.correctAnswer &&( index == checked || checked == null)}
                    onChange={() => changeChecked(index, answer)}
                  />
                }
                label={""}
              />

              <OutlinedInput 
              disabled={!(!buttonClicked && index == buttonIndex )}
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
            error={newAnswerValue?.trim() === ''}
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
            color={service.getActualIndex() == -1? "secondary": "primary"}
            onClick={(event) => saveChanges(event)}
            sx={{ marginTop: '20px' }} // Add margin top to the button
          >
            {service.getActualIndex() == -1? "Dodaj pytanie": "Zapisz zmiany"}
          </Button>

        </Box>
      </ListItem>
    )}
  </List>
</div>
  );
    
};

export default QuestionEdit;
