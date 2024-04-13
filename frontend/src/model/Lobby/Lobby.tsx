import React, { FC, useEffect, useState } from "react";
import "./Lobby.css";
import {
  deletePlayer,
  getGameUrl,
  getPlayers,
} from "../../services/LobbyData/LobbyDataService";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { Player } from "../../interfaces/Player";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import SettingForm from "../SettingForm/SettingForm";
import QRCode from "react-qr-code";
import ClearIcon from "@mui/icons-material/Clear";
import { error } from "console";

interface LobbyProps {}

export const Lobby: FC<LobbyProps> = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stompClient, setStompClient] = useState<Stomp.Client>();
  const [connected, setConnected] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [userDeleted, setUserDeleted] = useState(false);

  const WS_URL = "http://localhost:8080/ws";

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
    getGameUrl()
      .then((url: string) => {
        setGameUrl(url);
      })
      .catch((error) => {
        console.error(`Error fetching game URL: ${error}`);
      });
  }, []);

  useEffect(() => {
    console.log(userDeleted);
    getPlayers()
      .then((data: Player[]) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.log(`Error fetching game URL: ${error}`);
      });
  }, [userDeleted]);

  const deleteUser = (player: Player) => {
    console.log(player);
    deletePlayer(player)
      .then((res: boolean) => {
        if (res === true) {
          setUserDeleted(!userDeleted);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="lobby-img">
      <div className="join">
        <p id="joinMsg">Dołącz do gry za pomocą linku albo kodu QR!</p>
        <div className="joinMethods">
          <Link id="link" to={gameUrl}>
            {gameUrl}
          </Link>
          <div id="qrCode">
            <QRCode value={gameUrl} />
          </div>
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
            to="/gameView"
          >
            Start
          </Button>
        </div>

        <div className="show-players">
          {players.map((player) => (
            <span key={player.id}>
              {player.nickname}{" "}
              <span onClick={() => deleteUser(player)}>
                <ClearIcon id="icon"></ClearIcon>
              </span>
            </span>
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
