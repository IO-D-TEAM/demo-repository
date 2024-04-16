import { Player } from "../../../interfaces/Player";

export const connectToTheGame = async (
  gamecode: string | undefined,
  player: Player
): Promise<Player> => {
  return await fetch(`/game/${gamecode}/join_game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Poprawiono typ danych na application/json
    },
    body: JSON.stringify({ gamecode: gamecode, nickname: player.nickname }),
  })
    .then((response: any) => {
      return response.json();
    })
    .catch((error: any) => {
      console.log(`Couldn't proccess player. Status: ${error}`);
    });
};

export const getPlayerById = async (
  gmaeCode: string | undefined,
  id: string | undefined
): Promise<Player> => {
  return await fetch(`/game/${gmaeCode}/client/${id}`)
    .then((response) => response.json())
    .then((response: Player) => {
      console.log(response);
      return response;
    })
    .catch((error: any) => {
      console.log(error.message);
      throw new Error(error.message);
    });
};

export const sendAnswer = async (
  answer: string,
  gameCode: string | undefined,
  id: string | undefined
) => {
  return await fetch(`/game/${gameCode}/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Poprawiono typ danych na application/json
    },
    body: JSON.stringify({ gameCode: gameCode, clientID: id, answer: answer }),
  })
    .then((response: any) => {
      return response.json();
    })
    .catch((error: any) => {
      console.log(`Couldn't proccess player's answer. Status: ${error}`);
    });
};
