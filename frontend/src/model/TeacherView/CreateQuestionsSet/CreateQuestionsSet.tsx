import React, { FC } from "react";
import Navbar from "../../Navbar/Navbar";
import QuestionBoard from "./QuestionBoard/QuestionBoard";
import QuestionEdit from "./QuestionEdit/QuestionEdit";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import "./CreateQuestionsSet.css"
import { QuestionServiceProvider } from './../../../services/QuestionsCreating/QuestionsCreatingService';
import QuestionExporter from "./QuestionExporter/QuestionExporter";
import QuestionImporter from "./QuestionInporter/QuestionImporter";

interface CreateQuestionsSetProps {}

export const CreateQuestionsSet: FC<CreateQuestionsSetProps> = () => {

  return ( 
    <QuestionServiceProvider>
      <div className="mainControler" >
        <Box
        sx={{
          width: '35%',
          height: 400,
          bgcolor: 'background.paper',
          marginBottom: '20px' // Adding margin between components
        }}
      >
        <QuestionBoard />
      </Box>

      <Box
        sx={{
          width: '35%',
          height: 400,
          bgcolor: 'background.paper',
          marginBottom: '20px' // Adding margin between components
        }}
      >
        <QuestionEdit />
      </Box>

      <Box
        sx={{
          width: '30%',
          height: 400,
          bgcolor: 'background.paper',
          marginBottom: '20px', // Adding margin between components
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
      
        <QuestionExporter ></QuestionExporter>
        <QuestionImporter ></QuestionImporter>

      </Box>
      </div>
    </QuestionServiceProvider>
  )
};

export default CreateQuestionsSet;
