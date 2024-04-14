import React, { FC, useState, useEffect } from "react";
import { connectToTheGame } from "../../../services/ClientInfo/ClientInfo/ClientInfo";
import JoinForm from "../JoinForm/JoinForm";
import "./JoinGame.css";
import { Player } from "../../../interfaces/Player";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface JoinGameProps {}

const JoinGame: FC<JoinGameProps> = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();

  const handleSubmit = (player: Player) => {
    if (typeof gameCode === "undefined") {
      console.log("There is no game code!!!");
      return;
    }
    connectToTheGame(gameCode, player)
      .then((player: Player) => {
        // server error - can't register the client
        if (typeof player.id !== undefined) {
          navigate(`/userView/waitingRoom/${gameCode}/${player.id}`);
        } else {
          throw new Error("Nickname already in use!!!");
        }
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
