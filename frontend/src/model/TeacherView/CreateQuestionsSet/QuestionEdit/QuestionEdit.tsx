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

interface QuestionEditProps {
  service: QuestionService;
}

export const QuestionEdit: FC<QuestionEditProps> = ({service})  => {
  const [question, setQuestion] = useState<QuestionInterface | null | undefined>();
  const [checked, setChecked] =  useState<number | null>(null);

  {/* Subscribeses for changes in QuestionService, 
      and gets actual edited question. Main functionality is 
      to subscribe service to know when edited question is changed.   */}
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

  {/* Update question, change current question answers to new ones */}
  const handleAnswerChange = ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newAnswers = [...(question?.answers || [])]; // Get CURRENT question answers
    newAnswers[index] = event.target.value; // Change it with value of new one
    service.updateQuestionAnswers(newAnswers); // Update question answers with new ones
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

  {/* Delete current edited question, this could be moved to QuestionBoard 
      with new method in service, like removeQuestion(ID) to make better UX, 
      but I do not care. 
  */}
  const handleDeleteQuestion = (() => {
    service.removeQuestion();
    setChecked(null);
    setQuestion(null);
  })

  return (
    <div>
  <List>
    {question && (
      <ListItem alignItems="center">
        <Box className="mainBox" sx={{marginTop: '10px'}}>

          <TextField // Question 
            fullWidth
            value={question.question}
            onChange={(event) => handleQeustionChange(event)} // handleAnswerChange function to handle answer changes
          />

          {question.answers.map((answer, index) => ( // Answers
            <div key={index} className="answerField">

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
          
          <Button // Delete question button
            fullWidth
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
