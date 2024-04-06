import React from "react";
import { useEffect } from "react";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";
import { calculateFields } from "./utils/GameViewUtils";
import { useGameStore } from "./GameStore/GameStore";
import { GetGameConfig } from "../../services/GameConfig/GameConfigService";
import Board from "./Board/Board";
import FinishWindow from "./FinishWindow/FinishWindow";
import "./GameView.css";


const GameView = () => {
    const { fields, players, rows, columns, gameFinished,
    setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows } = useGameStore((state) => state);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config: GameConfig = await GetGameConfig();
                const [f, r, c] = calculateFields(config.boardSize, config.fieldSpeciality);
    
                setFinish(false);
                setGameDuration(config.gameDuration);
                setPlayers(config.players);
                setFields(f);
                setRows(r);
                setColumns(c);
                setBoardSize(config.boardSize);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows]);

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