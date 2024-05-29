import Box from "@mui/material/Box";
import { FC } from "react";
import { QuestionServiceProvider } from "../../services/question.create.service";
import QuestionBoard from "../question-board/QuestionBoard";
import QuestionEdit from "../question-edit/QuestionEdit";
import QuestionExporter from "../question-exporter/QuestionExporter";
import QuestionImporter from "../question-importer/QuestionImporter";
import "./CreateQuestionsSet.css";
interface CreateQuestionsSetProps {}

export const CreateQuestionsSet: FC<CreateQuestionsSetProps> = () => {
  return (
    <QuestionServiceProvider>
      <div className="body">
        <div className="mainControler">
          <Box
            className="reactComponent"
            sx={{
              width: "29%",
            }}
          >
            <QuestionBoard />
          </Box>

          <Box
            className="reactComponent"
            sx={{
              width: "29%",
            }}
          >
            <QuestionEdit />
          </Box>

          <Box
            className="reactComponent buttonsController"
            sx={{
              width: "29%",
              height: "670px",
            }}
          >
            <QuestionExporter></QuestionExporter>
            <QuestionImporter></QuestionImporter>
          </Box>
        </div>
      </div>
    </QuestionServiceProvider>
  );
};

export default CreateQuestionsSet;
