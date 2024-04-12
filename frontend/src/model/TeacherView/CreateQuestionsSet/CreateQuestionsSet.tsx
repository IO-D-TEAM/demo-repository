import React, { FC } from "react";
import Navbar from "../../Navbar/Navbar";
import QuestionBoard from "./QuestionBoard/QuestionBoard";
import QuestionEdit from "./QuestionEdit/QuestionEdit";
import Box from '@mui/material/Box';

import QuestionService from './../../../services/QuestionsCreating/QuestionsCreatingService';

interface CreateQuestionsSetProps {}

export const CreateQuestionsSet: FC<CreateQuestionsSetProps> = () => {
  const questionService = new QuestionService();

  return ( 
    <div style={{ display: 'flex' }}>
      <Box
      sx={{
        width: '30%',
        height: 400,
        maxWidth: 360,
        bgcolor: 'background.paper',
        marginBottom: '20px' // Adding margin between components
      }}
    >
      <QuestionBoard service={questionService} />
    </Box>

    <Box
      sx={{
        width: '30%',
        height: 400,
        maxWidth: 360,
        bgcolor: 'background.paper',
        marginBottom: '20px' // Adding margin between components
      }}
    >
      <QuestionEdit service={questionService} />
    </Box>
    </div>
  )
};

export default CreateQuestionsSet;
