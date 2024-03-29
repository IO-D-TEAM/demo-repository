import React from "react";
import { useEffect } from "react";
import { GameConfig } from "./utils/GameTypes";
import { calculateFields } from "./utils/GameViewUtils";
import { useGameStore } from "./GameState/GameState";
import Board from "./Board/Board";
import FinishWindow from "./FinishWindow/FinishWindow";
import "./GameView.css";


const GameView = () => {
    const { fields, players, rows, columns, gameFinished,
    setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows } = useGameStore((state) => state);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config: GameConfig = await fetchConfig();
                setFinish(false);
                setGameDuration(config.gameDuration);
                setPlayers(config.players);
                const [f, r, c] = calculateFields(config.boardSize, config.fields);
                setFields(f);
                setRows(r);
                setColumns(c);
                setBoardSize(config.boardSize);
            } catch (error) {
                console.error("Error ocurred with fetching game configuration: ", error);
            }
        };

        fetchData();
    }, [setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows]);

    const fetchConfig = async () => {
        const response = await fetch("/gameConfig");
        const data = await response.json();
        return data;
    }

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