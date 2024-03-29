import React from "react";
import { create } from "zustand";
import { FieldType, Player } from "../utils/GameTypes";


interface BoardDims {
    boardSize: number;
    rows: number;
    columns: number;
}


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


const useGameStore = create<GameState> ((set) => ({
    players: [],
    fields: [],
    gameDuration: 0,
    gameFinished: false,
    boardSize: 0,
    rows: 0,
    columns: 14,
    setPlayers: (list: Player[]) => set((state) => ({
        players: list
    })),
    setFields: (list: FieldType[]) => set((state) => ({
        fields: list
    })),
    setGameDuration: (minutes: number) => set((state) => ({
        gameDuration: minutes
    })),
    setFinish: (finish: boolean) => set((state) => ({
        gameFinished: finish
    })),
    setRows: (rowsNo: number) => set((state) => ({
        rows: rowsNo
    })),
    setColumns: (columnsNo: number) => set((state) => ({
        columns: columnsNo
    })),
    setBoardSize: (size: number) => set((state) => ({
        boardSize: size
    }))
}));


export { useGameStore }