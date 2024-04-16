import React from "react";
import { create } from "zustand";
import { PlayerType } from "../../../interfaces/GameViewInterfaces/PlayerType";
import { FieldType } from "../../../interfaces/GameViewInterfaces/FieldType";
import { GameState } from "../../../interfaces/GameViewInterfaces/GameState";

const useGameStore = create<GameState>((set) => ({
  players: [],
  fields: [],
  gameDuration: 0,
  gameFinished: false,
  boardSize: 0,
  rows: 0,
  columns: 14,
  setPlayers: (list: PlayerType[]) =>
    set((state) => ({
      players: list,
    })),
  setFields: (list: FieldType[]) =>
    set((state) => ({
      fields: list,
    })),
  setGameDuration: (minutes: number) =>
    set((state) => ({
      gameDuration: minutes,
    })),
  setFinish: (finish: boolean) =>
    set((state) => ({
      gameFinished: finish,
    })),
  setRows: (rowsNo: number) =>
    set((state) => ({
      rows: rowsNo,
    })),
  setColumns: (columnsNo: number) =>
    set((state) => ({
      columns: columnsNo,
    })),
  setBoardSize: (size: number) =>
    set((state) => ({
      boardSize: size,
    })),
}));

export { useGameStore };
