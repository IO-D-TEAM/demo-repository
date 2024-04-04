import React, { FC, useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { connectToTheGame } from "../../../services/ClientInfo/ClientInfo/ClientInfo";
import JoinForm from "./JoinForm";

interface JoinGameProps {}

const JoinGame: FC<JoinGameProps> = () => {
  const [gamecode, setGamecode] = useState("");
  const [nickname, setNickname] = useState("");
  const [clientId, setClientId] = useState("");
  const [stompClient, setStompClient] = useState<Stomp.Client>();

  const WS_URL = "http://localhost:8080/ws";
  useEffect(() => {
    if (clientId === "" || stompClient !== null) return;
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(`/client/${clientId}`, (notification) => {
        //TODO handle incomming questions
      });
    });

    setStompClient(client);
  }, [clientId]);

  const handleSubmit = (gamecode: string, nickname: string) => {
    let data;
    connectToTheGame(gamecode, nickname).then((response) => {
      data = response;
      // server error - can't register the client
      if (data.status !== "OK") {
        throw new Error(data.message);
      }

      setClientId(data.clientId);
    });
  };

  return <JoinForm onSubmitParent={handleSubmit} />;
};

export default JoinGame;
