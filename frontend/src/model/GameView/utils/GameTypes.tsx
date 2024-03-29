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

interface GameConfig {
    gameDuration: number;
    boardSize: number;
    fields: boolean[];
    players: Player[];
}

export type {Player, FieldType, GameConfig}