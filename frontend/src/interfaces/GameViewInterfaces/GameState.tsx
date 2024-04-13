import { PlayerType } from "./PlayerType";
import { FieldType } from "./FieldType";


interface GameState {
    players: PlayerType[];
    fields: FieldType[];
    gameDuration: number;
    gameFinished: boolean;
    boardSize: number;
    rows: number,
    columns: number;
    setPlayers: (value: PlayerType[]) => void;
    setFields: (value: FieldType[]) => void;
    setGameDuration: (value: number) => void;
    setFinish: (value: boolean) => void;
    setRows: (value: number) => void;
    setColumns: (value: number) => void;
    setBoardSize: (value: number) => void;
}


export type { GameState }