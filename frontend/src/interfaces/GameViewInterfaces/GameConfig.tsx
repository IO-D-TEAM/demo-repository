import { Player } from "./Player";


interface GameConfig {
    gameDuration: number;
    boardSize: number;
    fieldSpeciality: boolean[];
    players: Player[];
}


export type { GameConfig }