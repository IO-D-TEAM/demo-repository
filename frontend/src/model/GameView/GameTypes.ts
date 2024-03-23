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

export type {Player, FieldType}