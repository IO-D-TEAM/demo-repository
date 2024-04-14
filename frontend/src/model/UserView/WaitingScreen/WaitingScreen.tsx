import React, { FC, useState, useEffect } from "react";
import "./WaitingScreen.css";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../../interfaces/Player";
import { useParams } from "react-router-dom";
import loading from "../../../assets/loading.gif";
import { useNavigate } from "react-router-dom";
import { getPlayerById } from "../../../services/ClientInfo/ClientInfo/ClientInfo";

interface WaitingScreenProps {}

const WaitingScreen: FC<WaitingScreenProps> = () => {
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [plyaer, setPlayer] = useState<Player>();
  const [connected, setConnected] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();

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
          navigate(`/userView/move/${gameCode}/${id}`);
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
  return (
    <div className="main">
      {/* tutaj będzie dodawany kolor do stylizacji jak nie będzie on nullem w playerze */}
      <div className="inner">
        <div className="msg">Poczekaj sekundkę . . . </div>
        <div className="waiting-gif">
          <img src={loading} alt="loading gif"></img>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
