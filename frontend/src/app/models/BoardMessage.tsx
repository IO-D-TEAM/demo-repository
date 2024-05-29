import { Question } from "./Question";

interface BoardMessage {
    clientID: string;
    positionChange: number;
    question: Question | null;
    endingMove: boolean;
}


export type { BoardMessage };