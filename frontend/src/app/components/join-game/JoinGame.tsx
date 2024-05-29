import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Player } from "../../models/Player";
import { connectToTheGame } from "../../services/client.info.service";
import JoinForm from "../join-form/JoinForm";
import "./JoinGame.css";

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
