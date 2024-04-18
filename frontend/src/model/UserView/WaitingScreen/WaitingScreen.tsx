import React, { FC, useState, useEffect } from "react";
import "./WaitingScreen.css";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../../interfaces/Player";
import { useParams } from "react-router-dom";
import loading from "../../../assets/loading.gif";
import {
  confirmRoll,
  getPlayerById,
} from "../../../services/ClientInfo/ClientInfo/ClientInfo";
import Button from "@mui/material/Button";
import rolling from "../../../assets/dice.gif";
import AnswerQuestion from "../AnswerQuestion/AnswerQuestion";
import { Question } from "../../../interfaces/Question";

interface WaitingScreenProps {}

function replaceAlpha(rgba: string, alpha: number): React.CSSProperties {
  const rgbaValues = rgba.split(",");
  rgbaValues[3] = String(alpha);

  const FieldStyle: React.CSSProperties = {
    background: rgbaValues.join(","),
  };

  return FieldStyle;
}

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
  const [deleted, setDeleted] = useState(false);

  //const WS_URL = "http://localhost:8080/ws";
  useEffect(() => {
    let currentUrl = window.location.href;
    console.log(currentUrl);
    const startIndex = currentUrl.indexOf("http://") + "http://".length;
    const endIndex = currentUrl.indexOf(":3000");
    const ip = currentUrl.slice(startIndex, endIndex);
    console.log(ip); // Wyświetli "10.42.0.1"
    let WS_URL = "http://" + ip + ":8080/ws";
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log(id);
      client.subscribe(`/client/${id}`, (notification: any) => {
        console.log(notification);

        if ((notification.body as string) === "") return;

        let data = JSON.parse(notification.body as string);
        setConnected(true);
        console.log(data);
        if (data.task === "THROWING_DICE") {
          console.log("rzucam koscią " + data.diceRoll);
          setRollingDice(true);

          setDice(data.diceRoll);
        } else if (data.task === "ANSWERING_QUESTION") {
          setQuestion(data.question);
          setShowQuestion(true);
          setShowDiceResult(true);
        } else if (data.task === "DELETED") {
          console.log('wyrzucony')
          setRollingDice(false);
          setShowQuestion(false);
          setShowDiceResult(false);
          setShowRollDice(false);
          setDeleted(true);
        } else {
          setRollingDice(false);
          setShowQuestion(false);
          setShowDiceResult(false);
          setShowRollDice(false);
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

  useEffect(() => {
    console.log(id);
    getPlayerById(gameCode, id)
      .then((response: Player) => {
        setPlayer(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  const handleRollDiceClick = () => {
    setShowRollDice(true);
    setTimeout(() => {
      setShowQuestion(false);
      setShowDiceResult(true);
      sendConfirmation();
    }, 1000);
  };

  const sendConfirmation = async () => {
    if (gameCode !== undefined && plyaer !== undefined) {
      await confirmRoll(true, gameCode, plyaer);
    }
  };

  const colorRGBA = plyaer?.color ?? "rgb(212, 17, 17, 1.0)";

  const handleAnswerFeedback = (answerResponse: boolean) => {
    if (answerResponse) {
      const timer = setTimeout(() => {
        console.log("mam turbo esse");
        setRollingDice(false);
        setShowQuestion(false);
        setShowDiceResult(false);
        setShowRollDice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="main" style={replaceAlpha(colorRGBA, 0.4)}>
      {/* tutaj będzie dodawany kolor do stylizacji jak nie będzie on nullem w playerze */}
      <div className="inner">
        {rollingDice ? (
          <div className="rollingDice">
            {!showRollDice ? (
              <>
                <div className="msg" style={replaceAlpha(colorRGBA, 0.6)}>
                  Twoja tura, rzuć kostką!
                </div>
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
                      <div
                        className="form"
                        style={replaceAlpha(colorRGBA, 0.6)}
                      >
                        <AnswerQuestion
                          question={question}
                          gameCode={gameCode}
                          id={id}
                          parentCallback={handleAnswerFeedback}
                        ></AnswerQuestion>
                      </div>
                    ) : (
                      <div
                        className="dice"
                        style={replaceAlpha(colorRGBA, 0.4)}
                      >
                        {dice}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {!deleted ? (
              <div className="waiting">
                <div className="msg">Poczekaj sekundkę . . . </div>
                <div className="waiting-gif">
                  <img src={loading} alt="loading gif"></img>
                </div>
              </div>
            ) : (
              <div className="msg">Zostałeś wyrzucony . . .</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingScreen;