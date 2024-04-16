import React, { FC, useState, useEffect } from "react";
import "./WaitingScreen.css";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../../interfaces/Player";
import { useParams } from "react-router-dom";
import loading from "../../../assets/loading.gif";
import { getPlayerById } from "../../../services/ClientInfo/ClientInfo/ClientInfo";
import Button from "@mui/material/Button";
import rolling from "../../../assets/dice.gif";
import AnswerQuestion from "../AnswerQuestion/AnswerQuestion";
import { Question } from "../../../interfaces/Question";

interface WaitingScreenProps {}

const WaitingScreen: FC<WaitingScreenProps> = () => {
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [plyaer, setPlayer] = useState<Player>();
  const [connected, setConnected] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { gameCode } = useParams<{ gameCode: string }>();
  const [showRollDice, setShowRollDice] = useState(false);
  const [rollingDice, setRollingDice] = useState(false);
  const [dice, setDice] = useState(420);
  const [showQuestion, setShowQuestion] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const questionMock: Question = {
    question: "Czy masz chuja w dupie?",
    correctAnswer: "Tak",
    answers: ["Tak", "Nie", "Może ;3", "Śmieć"],
  };

  const WS_URL = "http://localhost:8080/ws";
  useEffect(() => {
    if (id === "" || stompClient !== null) return;
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    getPlayerById(gameCode, id)
      .then((response: Player) => {
        setPlayer(response);
      })
      .catch((error: any) => {
        console.log(error);
      });

    client.connect({}, () => {
      client.subscribe(`/client/${id}`, (notification: any) => {
        setConnected(true);
        if (notification.task === "THROWING_DICE") {
          setRollingDice(true);
          setDice(Number(notification.diceRoll));
        } else if (notification.task === "ANSWERING_QUESTION") {
          setQuestion(notification.question);
          setShowQuestion(true);
          setShowDiceResult(true);
        } else {
          setRollingDice(false);
        }
      });
    });

    setStompClient(client);
    if (connected) {
      return () => {
        client.disconnect(() => {
          console.log("Connection closed...");
          return null;
        });
      };
    }
  }, []);

  // japierdolectojest -> rellllll, nie ma co się interesować za dużo bo kociej mordy można dostać
  useEffect(() => {
    const timer = setTimeout(() => {
      setRollingDice(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // efekt będzie wywoływany tylko raz po pierwszym renderowaniu

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuestion(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []); // efekt będzie wywoływany tylko raz po pierwszym renderowaniu

  const handleRollDiceClick = () => {
    setShowRollDice(true);
    setTimeout(() => {
      // setShowQuestion(false);
      setShowDiceResult(true);
      sendConfirmation();
    }, 1000);
  };

  //szczerze to nie mam pojęcia czy to działa, ale jakby coś się jebało na backu to pewnie przez to ;3 pozdro
  const sendConfirmation = () => {
    if (stompClient !== null) {
      stompClient?.send(
        "client/confirmation",
        {},
        JSON.stringify({ confirm: true })
      );
    }
  };

  return (
    <div className="main">
      {/* tutaj będzie dodawany kolor do stylizacji jak nie będzie on nullem w playerze */}
      <div className="inner">
        {rollingDice ? (
          <div className="rollingDice">
            {!showRollDice ? (
              <>
                <div className="msg">Twoja tura, rzuć kostką!</div>
                <Button
                  variant="contained"
                  onClick={() => handleRollDiceClick()}
                >
                  Rzuć
                </Button>
              </>
            ) : (
              <div className="waiting-gif">
                {!showDiceResult ? (
                  <img src={rolling} alt="Rolling dice gif" />
                ) : (
                  <div>
                    {showQuestion ? (
                      <div className="form">
                        <AnswerQuestion
                          question={questionMock}
                          gameCode={gameCode}
                          id={id}
                        ></AnswerQuestion>
                      </div>
                    ) : (
                      <div className="dice">{dice}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="waiting">
            <div className="msg">Poczekaj sekundkę . . . </div>
            <div className="waiting-gif">
              <img src={loading} alt="loading gif"></img>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingScreen;
