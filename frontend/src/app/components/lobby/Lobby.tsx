import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import { FC, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Player } from "../../models/Player";
import {
  deletePlayer,
  getGameUrl,
  getPlayers,
  startGame,
} from "../../services/lobby.data.service";
import SettingForm from "../settings-form/SettingForm";
import "./Lobby.css";
interface LobbyProps {}

export const Lobby: FC<LobbyProps> = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [connected, setConnected] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  let [rerenderKey, setRerenderKey] = useState<number>(0); // State variable to trigger rerender
  const [redirectUrl, setRedirectUrl] = useState("");

  const WS_URL = "http://localhost:8080/ws";

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(`/lobby/players`, (notification) => {
        console.log("New message from ws: ", notification.body);
        setPlayers(JSON.parse(notification.body));
        setConnected(true);
        setRerenderKey((prevKey) => prevKey + 1);
      });
    });

    if (connected) {
      return () => {
        client.disconnect(() => {
          console.log("Connection closed...");
          return null;
        });
      };
    }
  }, [connected]);

  useEffect(() => {
    getGameUrl()
      .then((url: string) => {
        setGameUrl(url);
        return getPlayers();
      })
      .then((data: Player[]) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error(`Error fetching game URL: ${error}`);
      });
  }, []);

  const deleteUser = (player: Player) => {
    deletePlayer(player)
      .then(() => {
        setRerenderKey((prevKey) => prevKey + 1);
        return getPlayers();
      })
      .then((data: Player[]) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.log(`Error deleting player or fetching players: ${error}`);
      });
  };

  const handleStartGame = async () => {
    try {
      const response = await startGame();
      console.log(response)

      if (response.ok) {
        // Redirect to a different route if the game started successfully
        setRedirectUrl("/gameView");
      }
    } catch (error) {
      console.error(`Error starting the game: ${error}`);
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div className="lobby-img">
      <div className="join">
        <div className="joinMethods">
          <div className="buttons">
            <Button
                 variant="contained"
                 color="success"
                 component={Link}
                 onClick={startGame}
                 to="/gameView"
            >
              Start
            </Button>
            <div className="settings-cmp">
              <SettingForm></SettingForm>
            </div>
          </div>

          <div>
            <p id="joinMsg">Dołącz do gry za pomocą linku albo kodu QR!</p>
            <Link id="link" to={gameUrl}>
              {gameUrl}
            </Link>
          </div>

          <div className="qrCode">
            <QRCode value={gameUrl} />
          </div>
        </div>
      </div>

      <div className="middle-coint">
        {players.length > 0 && ( // Check if players array has size greater than 0
          <div className="show-players" key={rerenderKey}>
            {players.map((player) => (
              <span className="player" key={player.id}>
                <span
                  className="player-circle"
                  style={{ backgroundColor: player.color || "transparent" }}
                ></span>{" "}
                {} {""}
                {/* Assuming player.id exists */}
                {player.nickname}{" "}
                <span onClick={() => deleteUser(player)}>
                  <ClearIcon id="icon" />
                </span>
              </span>
            ))}
          </div>
        )}
        {/* <div className="settings-cmp">
        </div> */}
      </div>
    </div>
  );
};

export default Lobby;
