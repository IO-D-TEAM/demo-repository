import React, { FC } from "react";
import Navbar from "../../Navbar/Navbar";
import QuestionBoard from "./QuestionBoard/QuestionBoard";
import QuestionEdit from "./QuestionEdit/QuestionEdit";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import "./CreateQuestionsSet.css"

import QuestionService from './../../../services/QuestionsCreating/QuestionsCreatingService';
import QuestionExporter from "./QuestionExporter/QuestionExporter";

interface CreateQuestionsSetProps {}

export const CreateQuestionsSet: FC<CreateQuestionsSetProps> = () => {
  const questionService = new QuestionService();

  // Send QuestionSet to server
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionService.getQuestions()),
      });

      if (!response.ok) {
          throw new Error("Failed to connect to server");
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return ( 
    <div className="mainControler" >
      <Box
      sx={{
        width: '35%',
        height: 400,
        bgcolor: 'background.paper',
        marginBottom: '20px' // Adding margin between components
      }}
    >
      <QuestionBoard service={questionService} />
    </Box>

    <Box
      sx={{
        width: '35%',
        height: 400,
        bgcolor: 'background.paper',
        marginBottom: '20px' // Adding margin between components
      }}
    >
      <QuestionEdit service={questionService} />
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
     

      <Button // TODO IMPORT QUESTIONS
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ marginTop: '10px' }}
      >
        Import Questions
      </Button>

      <QuestionExporter service={questionService}></QuestionExporter>

     
    </Box>
    </div>
  )
};

export default CreateQuestionsSet;
