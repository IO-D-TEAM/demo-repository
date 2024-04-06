import { Player } from "./Player";
import { FieldType } from "./FieldType";


interface GameState {
    players: Player[];
    fields: FieldType[];
    gameDuration: number;
    gameFinished: boolean;
    boardSize: number;
    rows: number,
    columns: number;
    setPlayers: (value: Player[]) => void;
    setFields: (value: FieldType[]) => void;
    setGameDuration: (value: number) => void;
    setFinish: (value: boolean) => void;
    setRows: (value: number) => void;
    setColumns: (value: number) => void;
    setBoardSize: (value: number) => void;
}


export type { GameState }