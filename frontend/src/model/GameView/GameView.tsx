import React from "react";
import { useState, useEffect } from "react";
import { FieldType, Player, Question } from "./GameTypes";
import { calculateFields } from "./GameViewUtils";
import Board from "./Board/Board";
import "./GameView.css";


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

const GameView = () => {
    const [boardSize, setBoardSize] = useState<number>(0);
    const [players, setPlayers] = useState<Player[]>(mockPlayers);
    const [fields, setFields] = useState<boolean[]>([]);

    const [question, setQuestion] = useState<Question>({question: "", a: "", b: "", correctAnswer: ""});
    const [gameFinished, setGameFinished] = useState<boolean>(false);
    
    const [rows, setRows] = useState(0);
    const [columns, setColumns] = useState(0);
    const [fieldsRepresentation, setFieldsRepresentation] = useState<FieldType[]>([]);

    
    useEffect(() => {
        // fetching board config and players
        // now it's mocked because backend is not done yet
        setFields(mockFields);
        setBoardSize(mockFields.length)
        setPlayers(players);

        if (boardSize > 0) {
            const [f, r, c] = calculateFields(boardSize, fields);
            setRows(r);
            setColumns(c);
            setFieldsRepresentation(f);
        }
    }, [players, boardSize, fields]);

    useEffect(() => {
        // websockets setup
    });

    return (
        <div className="game-view">
            <Board fields={fieldsRepresentation} players={players} rows={rows} columns={columns}/>
        </div>
    );
}


export default GameView;