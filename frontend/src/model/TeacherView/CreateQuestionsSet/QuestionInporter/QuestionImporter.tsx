import React, { FC, useRef } from "react";
import Button from '@mui/material/Button';
import QuestionValidationService from "../../../../services/QuestionsCreating/QuestionValidator";
import { QuestionInterface } from "./../../../../interfaces/QuestionInterfaces/Question";
import { useQuestionService } from './../../../../services/QuestionsCreating/QuestionsCreatingService';

interface QuestionImporterProps {}

export const QuestionImporter: FC<QuestionImporterProps> = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const questionService = useQuestionService(); // Access the QuestionService instance

    const fileUploadInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    if (!e.target?.result) {
                        throw new Error('No content found');
                    }
                    const content = e.target.result as string;
                    const questions = parseJSON(content);
                    QuestionValidationService.validateSet(questions);
                    questionService.setQuestions(questions);
                } catch (error) {
                    if (error instanceof Error) {
                        alert(error.message);
                    }
                }
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
            throw new Error('Invalid JSON format');
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
                sx={{ marginTop: "10px" }}
                color="secondary"
                variant="contained"
                onClick={fileUploadAction}>
                Import Questions
            </Button>
        </div>
    );
};

export default QuestionImporter;
