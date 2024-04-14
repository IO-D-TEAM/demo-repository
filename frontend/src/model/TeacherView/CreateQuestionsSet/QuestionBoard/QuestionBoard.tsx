import React, { FC, useState, useEffect, useContext } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import './QuestionBoard.css'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import QuestionValidationService from '../../../../services/QuestionsCreating/QuestionValidator';
// import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import "./QuestionBoard.css";
import { useQuestionService }  from './../../../../services/QuestionsCreating/QuestionsCreatingService';

interface QuestionBoardProps {
}

{/* Component that will show all questions */ }
export const QuestionBoard: FC<QuestionBoardProps> = () => {
  const [questions, setQuestions] = useState<QuestionInterface[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  let [rerenderKey, setRerenderKey] = useState<number>(0); // State variable to trigger rerender
  const questionService = useQuestionService(); // Access the QuestionService instance

  {/* Subscribeses for changes in QuestionService, 
    and gets question list. Main functionality is 
    to subscribe service to know when edited question is changed.   */}
  useEffect(() => {
    const handleQuestionChanges = (questions: QuestionInterface[]) => {
      setQuestions(questions);
      setSelectedIndex(questionService.getActualIndex());
      setRerenderKey(prevKey => prevKey === rerenderKey ? rerenderKey++ : rerenderKey++);
      rerenderKey %= 100;
    };

    questionService.subscribe(handleQuestionChanges, "questions");
    setQuestions(questionService.getQuestions());

    return () => {
      questionService.unsubscribe(handleQuestionChanges);
    };
  }, [questionService]);

   {/* Change Actual Edited Question on click   */}
  const handleListItemClick = (
    index: number,
  ) => {
    // setSelectedIndex(index);
    questionService.setActualQuestion(questions[index], index);
  };

  const handleNewQuestion = (() => {
    questionService.addQuestion();  // Add new empty question onClick 
  })

  const handleDeleteQuestion = ((
    question: QuestionInterface ) => {
      questionService.removeQuestion(question);  // Delete question
  })

  // Mark invalid questions on board
  const simpleValidate = ((
    question: QuestionInterface, questions: QuestionInterface[]) => {
      try{
        QuestionValidationService.validateQuestion(question, questions);
        return true;
      } catch(error){
        if(error instanceof Error){
          return false;
        }
      }
    });

  return (
    <div style={{overflow: "auto"}}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewQuestion} // Add a function to handle adding a new question
        sx={{ 
          marginTop: '10px', 
          width: '100%' }}
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
          <ListItem key={index} disablePadding 
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={() => handleDeleteQuestion(question)}
              >
                <DeleteIcon />
              </IconButton>
            }>
            <ListItemButton 
              onClick={() => handleListItemClick(index)}
              selected={index == questionService.getActualIndex()}
            >
              <ListItemText 
                className="questionBoardItem"
                primary={question.question} 
                style={{color: simpleValidate(question, questions)? "green": "red"}} 
              />
            </ListItemButton>
            
          </ListItem>
        ))}
      </List>
    </div>);
}
export default QuestionBoard;
