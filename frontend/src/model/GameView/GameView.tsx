import React from "react";
import { useState, useEffect } from "react";
import { FieldType, Player, Question } from "./GameTypes";
import { calculateFields } from "./GameViewUtils";
import Board from "./Board/Board";
import FinishWindow from "./FinishWindow/FinishWindow";
import "./GameView.css";
import { useGameStore } from "./GameState/GameState";


const mockPlayers: Player[] = [
    {nickname: "P1", color: "red", position: 0, id: 0},
    {nickname: "P2", color: "blue", position: 0, id: 1},
    {nickname: "P3", color: "green", position: 0, id: 2},
    {nickname: "P4", color: "olive", position: 0, id: 3},
    {nickname: "P5", color: "grey", position: 0, id: 4},
    {nickname: "P6", color: "yellow", position: 0, id: 5},
    {nickname: "P7", color: "pink", position: 0, id: 6},
    {nickname: "P1", color: "red", position: 0, id: 0},
    {nickname: "P2", color: "blue", position: 0, id: 1},
    {nickname: "P3", color: "green", position: 0, id: 2},
    {nickname: "P4", color: "olive", position: 0, id: 3},
    {nickname: "P5", color: "grey", position: 0, id: 4},
    {nickname: "P6", color: "yellow", position: 0, id: 5},
    {nickname: "P7", color: "pink", position: 0, id: 6},
    {nickname: "P1", color: "red", position: 0, id: 0},
    {nickname: "P2", color: "blue", position: 0, id: 1},
    {nickname: "P3", color: "green", position: 0, id: 2},
    {nickname: "P4", color: "olive", position: 0, id: 3},
    {nickname: "P5", color: "grey", position: 0, id: 4},
    {nickname: "P6", color: "yellow", position: 0, id: 5},
    {nickname: "P7", color: "pink", position: 0, id: 6},
    {nickname: "P1", color: "red", position: 0, id: 0},
    {nickname: "P2", color: "blue", position: 0, id: 1},
    {nickname: "P3", color: "green", position: 0, id: 2},
    {nickname: "P4", color: "olive", position: 0, id: 3},
    {nickname: "P5", color: "grey", position: 0, id: 4},
    {nickname: "P6", color: "yellow", position: 0, id: 5},
    {nickname: "P7", color: "pink", position: 0, id: 6},
    {nickname: "P3", color: "green", position: 0, id: 2},
    {nickname: "P4", color: "olive", position: 0, id: 3},
    {nickname: "P5", color: "grey", position: 0, id: 4},
    {nickname: "P6", color: "yellow", position: 0, id: 5},
    {nickname: "P7", color: "pink", position: 0, id: 6},
    {nickname: "P1", color: "red", position: 0, id: 0},
    {nickname: "P1", color: "red", position: 0, id: 0},

];

const mockFields: boolean[] = [
    false, false, false, false, false,
    true, false, false, false, true,
    true, false, false, false, true,
    false, false, false, false, false,
    false, false, false, false, false,
    true, false, false, false, true,
    true, false, false, false, true,
    false, false, false, false, false
];


const mockTime: number = 1;

const GameView = () => {
    const { fields, players, rows, columns, gameDuration, gameFinished,
    setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows } = useGameStore((state) => state);

    useEffect(() => {
        setFinish(false);
        setGameDuration(mockTime);
        setPlayers(mockPlayers);
        const [f, r, c] = calculateFields(40, mockFields);
        setFields(f);
        setRows(r);
        setColumns(c);
        setBoardSize(40);
    }, [setFinish, setGameDuration, setFields, setRows, setColumns, setBoardSize, setPlayers]);

    return (
        <div className="game-view">
            <Board
                fields={fields}
                players={players}
                rows={rows}
                columns={columns}
            />
            {gameFinished && <FinishWindow/>}
        </div>
    );
}


export default GameView;