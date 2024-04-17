import { Question } from "./GameViewInterfaces/Question";

export interface Settings {
  numberOfPlayers: number;
  normalFields: number;
  specialFields: number;
  timeForAnswer: number;
  timeForGame: number;
  questions: Question[];
}
