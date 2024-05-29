import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Question } from "../../models//Question";
import { BoardMessage } from "../../models/BoardMessage";
import { GameConfig } from "../../models/GameConfig";
import { GameState } from "../../models/GameState";
import { PlayerType } from "../../models/PlayerType";
import { getGameConfig } from "../../services/game.service";
import { calculateFields } from "../../services/game.utils.service";
import Board from "../board/Board";
import FinishWindow from "../finish-window/FinishWindow";
import { useGameStore } from "../game-store/GameStore";
import QuestionPopUp from "../question/QuestionPopUp";

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
    setPlayers: setPlayersWithType,
    setRows,
  } = useGameStore((state: GameState) => state);

  const WS_URL = "http://localhost:8080/ws";
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [connected, setConnected] = useState(false);
  let [rerenderKey, setRerenderKey] = useState<number>(0); // Force re-render key
  const [boardMessage, setBoardMessage] = useState<BoardMessage>();

  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    answers: [],
    correctAnswer: "",
  });

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(`/move`, (notification) => {
        setConnected(true);
        const message: BoardMessage = JSON.parse(notification.body);
        setBoardMessage(message);
        setRerenderKey((prevKey) => prevKey + 1);
      });
    });

    setStompClient(client);
    if (connected) {
      return () => {
        client.disconnect(() => {
          console.log("Board websocket connection closed...");
          return null;
        });
      };
    }
  }, []);

  useEffect(() => {
    if (boardMessage) updateBoard(boardMessage);
    setRerenderKey((prevKey) => prevKey + 1);
  }, [boardMessage]);

  // Reading configuration
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config: GameConfig = await getGameConfig();
        console.log(config);
        const [fieldsRepr, r, c] = calculateFields(
          config.boardSize,
          config.fieldSpeciality
        );

        let players: PlayerType[] = config.players;
        setGameDuration(config.gameDuration);
        setPlayersWithType(players); // Manually setting PlayerType
        setFields(fieldsRepr);
        setRows(r);
        setColumns(c);
        setBoardSize(config.boardSize);
        setRerenderKey((prevKey) => prevKey + 1);
        console.log("fetchData " + players)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [
    setBoardSize,
    setColumns,
    setFields,
    setFinish,
    setGameDuration,
    setPlayersWithType, // Add setPlayersWithType to dependencies
    setRows,
  ]);

  const updateBoard = (update: BoardMessage) => {
    
    players.map(player => {
      console.log(player.position);
    });
    
    setRerenderKey((prevKey) => prevKey + 1);
    // jeśli było wyświetlone pytanie w poprzednim ruchu to pokazujemy na chwilę poprawną odpowiedź zanim wykonaym ruch który właśnie przyszedł
    if (update.question === null) {
      setShowAnswer(false);
    }

    if (showQuestion) {
      setShowAnswer(true);
      setTimeout(() => {}, 3000);
    }

    // czyścimy plansze z ewentualnego pytania
    setShowQuestion(false);
    setShowAnswer(false);

    setFinish(false);

    // if (update.endingMove) {
    //   setFinish(true);
    //   return;
    // }

    // zwykły ruch wykonujemy tak czy siak
    const positionChanged: boolean = changePlayerPosition(
      update.clientID,
      update.positionChange
    );

    // ruch kończący grę
    if (positionChanged && update.endingMove) {
      setFinish(true);
      return;
    }

    // ruch ale trafiamy na pytani - w teorii będzie się wyświetlać po 2 sekundach odkąd przyszedł ruch z pytaniem, żeby zobaczyć przejście gracza
    if (positionChanged && update.question) {
      setCurrentQuestion(update.question);
      setShowQuestion(true);
      return;
    }
  };

  // useEffect(() => {
  //     updateBoard();
  // }, [connected, players, setPlayersWithType, setFinish, showQuestion])

  const changePlayerPosition = (playerId: string, steps: number): boolean => {
    const playersUpdate: PlayerType[] = [...players];
    const playerToUpdateIdx: number = playersUpdate.findIndex(
      (player) => player.id === playerId
    );

    if (playerToUpdateIdx > -1) {
      playersUpdate[playerToUpdateIdx].position += steps;
      setPlayersWithType(playersUpdate); // Manually setting PlayerType
      return true;
    } else {
      console.error(`Player with this id: ${playerId} doesn't exist!`);
      return false;
    }
  };

  return (
    <div key={rerenderKey} className="game-view">
      <Board fields={fields} players={players} rows={rows} columns={columns} />
      {false && <FinishWindow />}
      {showQuestion && (
        <QuestionPopUp
          question={currentQuestion}
          showCorrectAnswer={showAnswer}
        />
      )}
    </div>
  );
};

export default GameView;
