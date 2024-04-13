import React, { FC, useState, useEffect } from 'react';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import './QuestionBoard.css'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import QuestionValidationService from '../../../../services/QuestionsCreating/QuestionValidator';
import { QuestionAnswer } from '@mui/icons-material';

interface QuestionBoardProps {
  service: QuestionService;
}

{/* Component that will show all questions */ }
export const QuestionBoard: FC<QuestionBoardProps> = ({service}) => {
  const [questions, setQuestions] = useState<QuestionInterface[]>([]);
  const [rerenderKey, setRerenderKey] = useState<string>('a'); // State variable to trigger rerender

  {/* Subscribeses for changes in QuestionService, 
    and gets question list. Main functionality is 
    to subscribe service to know when edited question is changed.   */}
  useEffect(() => {
    const handleQuestionChanges = () => {
      setQuestions(service.getQuestions());
      setRerenderKey(prevKey => prevKey === 'a' ? 'b' : 'a');
    };

    service.subscribe(handleQuestionChanges);
    setQuestions(service.getQuestions());

    return () => {
      service.unsubscribe(handleQuestionChanges);
    };
  }, [service]);

   {/* Change Actual Edited Question on click   */}
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    service.setActualQuestion(questions[index], index);
  };

 
  // Add new empty question onClick 
  const handleNewQuestion = (() => {
    service.addQuestion();
  })

  const handleDeleteQuestion = ((
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    question: QuestionInterface,) => {
      service.removeQuestion(question);
  })

  return (
    <div>
     <Button
      variant="contained"
      color="primary"
      onClick={handleNewQuestion} // Add a function to handle adding a new question
      sx={{ marginTop: '10px', width: '100%' }}
    >
      Dodaj nowe pytanie
    </Button>

    <List
      key={rerenderKey} // Use the service as key to force re-render when it changes
      sx={{ 
        position: 'relative',
        overflow: 'auto',
        maxHeight: 950, }}
      aria-label="contacts"
    >
      {questions.map((question, index) => (
        <ListItem key={index} disablePadding secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={(event) => handleDeleteQuestion(event, question)}>
            <DeleteIcon />
          </IconButton>
        }>
          <ListItemButton onClick={(event) => handleListItemClick(event, index)}>
            <ListItemText primary={question.question} style={{ textAlign: 'center'}} />
          </ListItemButton>
          
        </ListItem>
      ))}
    </List>
    </div>);
}
export default QuestionBoard;
