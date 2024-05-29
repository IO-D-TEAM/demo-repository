import Button from "@mui/material/Button";
import { FC } from "react";
import { useQuestionService } from "../../services/question.create.service";
import QuestionValidationService from "../../services/question.validate.service";

interface QuestionExporterProps {}

export const QuestionExporter: FC<QuestionExporterProps> = () => {
  const questionService = useQuestionService(); // Access the QuestionService instance

  const saveFile = async () => {
    try {
      QuestionValidationService.validateSet(questionService.getQuestions());
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      return;
    }

    const blob = new Blob([JSON.stringify(questionService.getQuestions())], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.download = "my-file.json";
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      onClick={saveFile}
      sx={{ marginTop: "10px",         height: "50px" }}
    >
      Export Questions
    </Button>
  );
};

export default QuestionExporter;
