import { Question } from "./Question";

interface BoardMessage {
    clientID: string;
    positionChange: number;
    question: Question;
}


export type { BoardMessage };