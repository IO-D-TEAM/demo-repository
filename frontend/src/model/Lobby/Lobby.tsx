import React, { FC, useEffect, useState } from "react";
import "./Lobby.css";
import { getGameCode } from "../../services/LobbyData/LobbyDataService";
import { getGameUrl } from "../../services/LobbyData/LobbyDataService";

import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../interfaces/Player";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import SettingForm from "../SettingForm/SettingForm";
import QRCode from "react-qr-code";

interface LobbyProps {}

export const Lobby: FC<LobbyProps> = () => {
  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [connected, setConnected] = useState(false);
  const [gameUrl, setGameUrl] = useState("");

  const WS_URL = "http://localhost:8080/ws"

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(`/lobby/players`, (notification) => {
        setPlayers(JSON.parse(notification.body)["clients"]);
        setConnected(true);
        console.log(players);
      });
    });

    setStompClient(client)
    if (connected) {
      return () => {
        client.disconnect(() => {
          console.log("Connection closed...")
          return null 
        })
      }
    } 
  }, []);

  useEffect(() => {
    const fetchGameUrl = async () => {
      try {
        const url = await getGameUrl();
        setGameUrl(url);
      } catch (error) {
        console.error('Error fetching game URL:', error);
      }
    };

    fetchGameUrl();
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
          <a href="/">{gameUrl}</a>
        </p>
        <div id="Container">
          <QRCode value={gameUrl} />
        </div>
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
        {players.map((player) => (
           <span key={player.id}>{player.nickname}</span>
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
