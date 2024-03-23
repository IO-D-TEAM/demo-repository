import React from "react";
import Board from "./Board/Board";
import { Player, FieldType } from "./GameTypes";
import { calculateFields } from "./GameViewUtils";


const players: Player[] = [
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
    const boardSize: number = 45;
    const [fields, rows, columns] = calculateFields(boardSize);
    console.log(fields);

    return (
        <div>
            <Board fields={fields} players={players} rows={rows} columns={columns}/>
        </div>
    );
}


export default GameView;