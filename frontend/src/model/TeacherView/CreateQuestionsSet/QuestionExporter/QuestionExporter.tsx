import React, { FC } from "react";
import Button from '@mui/material/Button';
import QuestionService from './../../../../services/QuestionsCreating/QuestionsCreatingService';

interface QuestionExporterProps {
    service: QuestionService; 
}

export const QuestionExporter: FC<QuestionExporterProps> = ({service}) => {
  
    const saveFile = async () => {
        const blob = new Blob([JSON.stringify(service.getQuestions())], {type : 'application/json'});
        const a = document.createElement('a');
        a.download = 'my-file.txt';
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', (e) => {
          setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
      };
    

    return (
        <Button // TODO EXPORT QUESTIONS
          fullWidth
          variant="contained"
          color="secondary"
          onClick={saveFile}
          sx={{ marginTop: '10px' }}
      >
        Export Questions
      </Button>
    )
};

export default QuestionExporter;