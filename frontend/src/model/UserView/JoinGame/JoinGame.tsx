import React, { FC, useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { connectToTheGame } from "../../../services/ClientInfo/ClientInfo/ClientInfo";
import JoinForm from "../JoinForm/JoinForm";
import "./JoinGame.css";
import { Player } from "../../../interfaces/Player";
import { useParams } from "react-router-dom";

interface JoinGameProps {}

const JoinGame: FC<JoinGameProps> = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [player, setPlayer] = useState<Player>();
  // const [stompClient, setStompClient] = useState<Stomp.Client>();

  // const WS_URL = "http://localhost:8080/ws";
  // useEffect(() => {
  //   if (player?.id === "" || stompClient !== null) return;
  //   const socket = new SockJS(WS_URL);
  //   const client = Stomp.over(socket);

  //   client.connect({}, () => {
  //     client.subscribe(`/client/${player?.id}`, (notification) => {
  //       //TODO handle incomming questions
  //     });
  //   });

  //   setStompClient(client);
  // }, [player?.id]);

  const handleSubmit = (player: Player) => {
    if (typeof gameCode === "undefined") {
      console.log("There is no game code!!!");
      return;
    }
    connectToTheGame(gameCode, player)
      .then((player: Player) => {
        // server error - can't register the client
        console.log(player);
        setPlayer(player);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div>
      <JoinForm onSubmitParent={handleSubmit} />;
    </div>
  );
};

export default JoinGame;
