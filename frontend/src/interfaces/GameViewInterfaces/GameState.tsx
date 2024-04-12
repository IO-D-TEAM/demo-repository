import { GamePlayer } from "./GamePlayer";
import { FieldType } from "./FieldType";

interface GameState {
  players: GamePlayer[];
  fields: FieldType[];
  gameDuration: number;
  gameFinished: boolean;
  boardSize: number;
  rows: number;
  columns: number;
  setPlayers: (value: GamePlayer[]) => void;
  setFields: (value: FieldType[]) => void;
  setGameDuration: (value: number) => void;
  setFinish: (value: boolean) => void;
  setRows: (value: number) => void;
  setColumns: (value: number) => void;
  setBoardSize: (value: number) => void;
}

export type { GameState };
