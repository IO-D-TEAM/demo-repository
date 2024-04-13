import React, { FC, useRef } from "react";
import Button from '@mui/material/Button';
import QuestionService from '../../../../services/QuestionsCreating/QuestionsCreatingService';
import QuestionValidationService from "../../../../services/QuestionsCreating/QuestionValidator";
import {QuestionInterface} from "./../../../../interfaces/QuestionInterfaces/Question"

interface QuestionImporterProp {
  service: QuestionService; 
}

export const QuestionImporter: FC<QuestionImporterProp> = ({service}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fileUploadInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const questions: QuestionInterface[] = parseJSON(content);
                
                try{
                  QuestionValidationService.validateSet(questions);
                } catch(error){
                  if(error instanceof Error)
                    alert(error.message)
                  return;
                }

                service.setQuestions(questions);

            };
            reader.readAsText(file);
        }
    };

    const parseJSON = (text: string): QuestionInterface[] => {
        try {
            const jsonData = JSON.parse(text);
            if (!Array.isArray(jsonData)) {
                throw new Error('Invalid JSON format');
            }
            return jsonData as QuestionInterface[];
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return [];
        }
    };

    const fileUploadAction = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <input type="file" hidden ref={fileInputRef} onChange={fileUploadInputChange} />
            <Button 
              fullWidth
              sx={{marginTop:"10px"}}
              color="secondary"
              variant="contained" onClick={fileUploadAction}>
                Import Questions
            </Button>
        </div>
    );
};

export default QuestionImporter;