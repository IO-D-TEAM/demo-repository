import React, { FC, useState, useEffect } from 'react';
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';

interface QuestionBoardProps {
  service: QuestionService;
}

export const QuestionBoard: FC<QuestionBoardProps> = ({service}) => {
  const [questions, setQuestions] = useState<QuestionInterface[]>([]);
  const [rerenderKey, setRerenderKey] = useState<string>('a'); // State variable to trigger rerender

  useEffect(() => {
    const handleQuestionChanges = async () => {
      setQuestions(service.getQuestions());

      const fetchQuestions = await service.getQuestions();
      setQuestions(fetchQuestions);
      setRerenderKey(prevKey => prevKey === 'a' ? 'b' : 'a');

    };

    service.subscribe(handleQuestionChanges);
    setQuestions(service.getQuestions());

    return () => {
      service.unsubscribe(handleQuestionChanges);
    };
  }, [service]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    service.setActualQuestion(questions[index], index);
  };

  return (
    <List
      key={rerenderKey} // Use the service as key to force re-render when it changes
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      aria-label="contacts"
    >
      {questions.map((question, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={(event) => handleListItemClick(event, index)}>
            <ListItemText primary={question.question} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
export default QuestionBoard;
