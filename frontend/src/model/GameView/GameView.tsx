import React from "react";
import Board from "./Board/Board";
import Timer from "./Timer/Timer";
import { Player } from "./GameTypes";
import { calculateFields } from "./GameViewUtils";
import "./GameView.css";
import { useState } from "react";


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
    {nickname: "P7", color: "pink", position: 0, id: 6}
];

const GameView = () => {
    const boardSize: number = 50;
    const [fields, rows, columns] = calculateFields(boardSize);
    const [players, setPlayers] = useState(mockPlayers);
    const [gameFinished, setGameFinished] = useState(false);

    return (
        <div className="game-view">
            <Board fields={fields} players={players} rows={rows} columns={columns}/>
        </div>
    );
}


export default GameView;