import { GamePlayer } from "./GamePlayer";

interface GameConfig {
  gameDuration: number;
  boardSize: number;
  fieldSpeciality: boolean[];
  players: GamePlayer[];
}

export type { GameConfig };
