interface FieldType {
    position: number;
    row: number;
    column: number;
    isSpecial: boolean;
}

interface Player {
    id: number;
    position: number;
    nickname: string;
    color: string;
}

interface Question {
    question: string;
    a: string;
    b: string;
    c?: string;
    d?: string;
    correctAnswer: string;
}

export type {Player, FieldType, Question}