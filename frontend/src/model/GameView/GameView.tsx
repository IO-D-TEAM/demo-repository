import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { calculateFields } from "./utils/GameViewUtils";
import { getGameConfig } from "../../services/Game/GameService";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";
import { useGameStore } from "./GameStore/GameStore";
import { GameState } from "../../interfaces/GameViewInterfaces/GameState";
import { BoardMessage } from "../../interfaces/GameViewInterfaces/BoardMessage";
import { PlayerType } from "../../interfaces/GameViewInterfaces/PlayerType";
import { Question } from "../../interfaces/GameViewInterfaces/Question";
import Board from "./Board/Board";
import FinishWindow from "./FinishWindow/FinishWindow";
import QuestionPopUp from "./Question/QuestionPopUp";


const GameView = () => {
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
    const [showAnswer, setShowAnswer] = useState(false);
    // const [currentQuestion, setCurrentQuestion] = useState<Question>(
    //     {
    //         question: "Jaki jest najwyższy szczyt na świecie?",
    //         answers: ["Mount Everest", "K2", "Annapurna", "Mont Blanc"],
    //         correctAnswer: "Mount Everest"
    //     }
    // );

    const [currentQuestion, setCurrentQuestion] = useState<Question>(
        {
            question: "",
            answers: [],
            correctAnswer: ""
        }
    );

    // Reading configuration
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config: GameConfig = await getGameConfig();
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

    // Board realtime update a niech chociaż to zadziała za pierwszym razem XDDD
    useEffect(() => {
        const socket = new SockJS(WS_URL);
        const client = Stomp.over(socket);

        const updateBoard = (update: BoardMessage) => {
            // jeśli było wyświetlone pytanie w poprzednim ruchu to pokazujemy na chwilę poprawną odpowiedź zanim wykonaym ruch który właśnie przyszedł
            if (showQuestion) {
                setShowAnswer(true);
                setTimeout(() => {}, 3000);
            }
            
            // czyścimy plansze z ewentualnego pytania
            setShowQuestion(false);
            setShowAnswer(false);

            // zwykły ruch wykonujemy tak czy siak
            const positionChanged: boolean = changePlayerPosition(update.clientID, update.positionChange);

            // ruch kończący grę 
            if (positionChanged && update.endingMove) {
                setFinish(true);
                return
            }

            // ruch ale trafiamy na pytani - w teorii będzie się wyświetlać po 2 sekundach odkąd przyszedł ruch z pytaniem, żeby zobaczyć przejście gracza
            if (positionChanged && update.question) {
                setCurrentQuestion(update.question);
                setTimeout(() => {
                    setShowQuestion(true);
                }, 2000);

                return
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
    }, [connected, players, setPlayers, setFinish, showQuestion]);

    return (
        <div className="game-view">
            <Board fields={fields} players={players} rows={rows} columns={columns}/>
            {gameFinished && <FinishWindow/>}
            {showQuestion && <QuestionPopUp question={currentQuestion} showCorrectAnswer={showAnswer}/>}
        </div>
    );
}


export default GameView;