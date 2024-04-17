import { Question } from "./Question";

interface BoardMessage {
    clientID: string;
    positionChange: number;
    question: Question;
    endingMove: boolean;
}


export type { BoardMessage };