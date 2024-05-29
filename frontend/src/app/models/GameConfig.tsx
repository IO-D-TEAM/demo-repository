import { PlayerType } from "./PlayerType";

interface GameConfig {
  gameDuration: number;
  boardSize: number;
  fieldSpeciality: string[];
  players: PlayerType[];
}

export type { GameConfig };
