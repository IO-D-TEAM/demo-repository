import React, { useState } from "react";
import { useEffect } from "react";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";
import { calculateFields } from "./utils/GameViewUtils";
import { useGameStore } from "./GameStore/GameStore";
import { GetGameConfig } from "../../services/GameConfig/GameConfigService";
import { GameState } from "../../interfaces/GameViewInterfaces/GameState";
import Board from "./Board/Board";
import FinishWindow from "./FinishWindow/FinishWindow";

import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { BoardMessage } from "../../interfaces/GameViewInterfaces/BoardMessage";
import { PlayerType } from "../../interfaces/GameViewInterfaces/PlayerType";
import { Question } from "../../interfaces/GameViewInterfaces/Question";
import QuestionPopUp from "./Question/QuestionPopUp";


const GameView = () => {
    // It is awful but unfortunately it has to be like that for now
    const {
        fields,
        players,
        rows,
        columns,
        gameFinished,
        setBoardSize,
        setColumns,
        setFields,
        setFinish,
        setGameDuration,
        setPlayers,
        setRows
    } = useGameStore((state:GameState ) => state);

    const WS_URL = "http://localhost:8080/ws";
    const [stompClient, setStompClient] = useState<Stomp.Client>();
    const [connected, setConnected] = useState(false);

    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question>(
        {question: "", answers: [], correctAnswer: ""}
    );

    // Reading configuration
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config: GameConfig = await GetGameConfig();
                const [fieldsRepr, r, c] = calculateFields(config.boardSize, config.fieldSpeciality);
                setGameDuration(config.gameDuration);
                setPlayers(config.players);
                setFields(fieldsRepr);
                setRows(r);
                setColumns(c);
                setBoardSize(config.boardSize);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [setBoardSize, setColumns, setFields, setFinish, setGameDuration, setPlayers, setRows]);

    // Board realtime update
    // Well, I'm not 100% sure if that works but the problem is I don't know if I can test it at the moment (just like the server side from what I)
    useEffect(() => {
        const socket = new SockJS(WS_URL);
        const client = Stomp.over(socket);

        const updateBoard = (update: BoardMessage) => {
            const changed: boolean = changePlayerPosition(update.clientID, update.positionChange);
    
            if (changed && update.question) {
                // I think we should wait a bit to let the student see his move on the board and after that show the question
                setTimeout(() => {}, 1000);
                setCurrentQuestion(update.question);
                setShowQuestion(true);
            } else {
                setShowQuestion(false);
            }
        }
    
        const changePlayerPosition = (playerId: string, steps: number): boolean => {
            const playersUpdate: PlayerType[] = [...players];
            const playerToUpdateIdx: number = playersUpdate.findIndex(player => player.id === playerId);
    
            if (playerToUpdateIdx > -1) {
                playersUpdate[playerToUpdateIdx].position += steps;
                setPlayers(playersUpdate);
                return true;
            } else {
                console.error(`Player with this id: ${playerId} doesn't exist!`);
                return false;
            }
        }

        client.connect({}, () => {
            client.subscribe(`/move`, (notification) => {
                setConnected(true);
                const message: BoardMessage = JSON.parse(notification.body);
                updateBoard(message);
            });
        });

        setStompClient(client);
        if (connected) {
            return () => {
                client.disconnect(() => {
                    console.log("Board websocket connection closed...");
                    return null;
                });
            }
        }
    }, [connected, players, setPlayers]);

    // Ofc it's temporary
    const mockQuestion: Question = {
        question: "Jaki jest najwyższy szczyt na świecie?",
        answers: ["Mount Everest", "K2", "Annapurna", "Mont Blanc"],
        correctAnswer: "Tak"
    };

    return (
        <div className="game-view">
            <Board fields={fields} players={players} rows={rows} columns={columns}/>
            {gameFinished && <FinishWindow/>}
            {true && <QuestionPopUp question={mockQuestion}/>}
        </div>
    );
}


export default GameView;