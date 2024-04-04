import React, { FC, useEffect, useState } from "react";
import "./Lobby.css";
import { GetGameCode } from "../../services/LobbyData/LobbyDataService";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../interfaces/Player";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import SettingForm from "../SettingForm/SettingForm";

interface LobbyProps {}

export const Lobby: FC<LobbyProps> = () => {
  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [connected, setConnected] = useState(false);

  const WS_URL = "http://localhost:8080/ws";

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/lobby/players", (notification) => {
        setPlayers(JSON.parse(notification.body));
        setConnected(true);
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
    // wywołanie funkcji getGameCode
    setGameCode("123456");
  }, []);

  return (
    <div className="lobby-img">
      <div className="join">
        <p>
          Dołącz do gry za pomocą linku:{" "}
          <a href="/">http://localhost:3000/{gameCode}</a>
        </p>
        <p>albo kody do gry: </p>
        <p className="code">{gameCode}</p>
      </div>
      <div className="middle-coint">
        <div className="start">
          <p>players: {players.length}</p>
          <p>Lista graczy</p>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/board"
          >
            Start
          </Button>
        </div>
        <div className="show-players">
          {players.map((player, index) => (
            <span key={index}>{player.nickName}</span>
          ))}
        </div>
        <div className="settings-cmp">
          <SettingForm></SettingForm>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
