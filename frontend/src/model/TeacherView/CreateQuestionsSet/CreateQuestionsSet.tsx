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
      <div className="body" >
      <div className="mainControler" >
        <Box 
        className="reactComponent"
        sx={{
          width: '29%',
        }}
      >
        <QuestionBoard />
      </Box>

      <Box
        className="reactComponent"
        sx={{
          width: '29%',
        }}
      >
        <QuestionEdit />
      </Box>

      <Box
        className="reactComponent buttonsController"
        sx={{
          width: '29%',
          height: '670px'
        }}
      >
      
        <QuestionExporter ></QuestionExporter>
        <QuestionImporter ></QuestionImporter>

      </Box>
      </div>
      </div>
    </QuestionServiceProvider>
  )
};

export default CreateQuestionsSet;
