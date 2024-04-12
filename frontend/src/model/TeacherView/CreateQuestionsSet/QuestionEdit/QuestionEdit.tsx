import React, { FC, useState, useEffect } from 'react';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Label, QuestionAnswer } from '@mui/icons-material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

interface QuestionEditProps {
  service: QuestionService;
}

export const QuestionEdit: FC<QuestionEditProps> = ({service})  => {
  const [question, setQuestion] = useState<QuestionInterface | null | undefined>();
  const [checked, setChecked] =  useState<number | null>(null);

  useEffect(() => {
    const handleActualQuestionChange = () => {
      setQuestion(service.getActualQuestion());
      setChecked(0);
    };

    service.subscribe(handleActualQuestionChange);

    return () => {
      service.unsubscribe(handleActualQuestionChange);
    };
  }, [service]);

  const handleAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newAnswers = [...(question?.answers || [])];
    newAnswers[index] = event.target.value; 
    setQuestion(prevQuestion => ({ ...prevQuestion!, answers: newAnswers }));

    if(question)
      service.updateQuestionValue({...question, answers: newAnswers })

    service.setActualQuestion({ ...question!, answers: newAnswers }, index); 
  });

  const handleQeustionChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newQuestion = event.target.value;
    setQuestion(prevQuestion => ({ ...prevQuestion!, question: newQuestion }));
    
    if(question)
      service.updateQuestionValue({...question, question: newQuestion });
  });

  const changeChecked = ((index: number, answer: string) => {
    service.updateCorrectAnswer(answer);
    service.setActualQuestion({ ...question!, correctAnswer: answer }, index); // Update the actual question in the service with the new answers
    setChecked(index);
  });

  const handleDeleteQuestion = (() => {
    if (checked !== null) {
      service.removeQuestion();
      setChecked(null);
      setQuestion(null);
    }
  })

  return (
    <div>
  <List>
    {question && (
      <ListItem alignItems="center">
        <Box sx={{ flexGrow: 1 }}>

          <TextField
            value={question?.question}
            onChange={(event) => handleQeustionChange(event)} // handleAnswerChange function to handle answer changes
          />

          {question?.answers.map((answer, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={answer === question.correctAnswer}
                    onChange={(event) => changeChecked(index, answer)}
                  />
                }
                label={""}
              />
              <TextField
                fullWidth
                label={`Answer ${index + 1}`} // Displaying answer number as label
                value={answer}
                onChange={(event) => handleAnswerChange(event, index)} // handleAnswerChange function to handle answer changes
              />
            </div>
          ))}
          
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteQuestion} // Add a function to handle the deletion of the question
            sx={{ marginTop: '20px' }} // Add margin top to the button
          >
            Delete Question
          </Button>
        </Box>
      </ListItem>
    )}
  </List>
</div>
  );
    
};

export default QuestionEdit;
