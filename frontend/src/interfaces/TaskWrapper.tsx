import { Question } from "./Question";

export interface TaskWrapper {
  question: Question;
  diceRoll: number;
  playerTask: string;
  message: string;
}
