import { Player } from "../../../interfaces/Player";

export const connectToTheGame = async (
  gamecode: string | undefined,
  player: Player
): Promise<Player> => {
  return await fetch(`/lobby/${gamecode}/join_game`, {
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
  clientId: string | undefined
): Promise<Player> => {
  return await fetch(`/players/${gmaeCode}/client/${clientId}`)
    .then((response) => response.json())
    .then((response: Player) => {
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
  return await fetch(`/game/${gameCode}/client/${id}`, {
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

export const confirmRoll = async (
  confirmation: boolean,
  gameCode: string,
  player: Player
) => {
  await fetch(`/game/${gameCode}/client/${player.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Poprawiono typ danych na application/json
    },
    body: JSON.stringify(confirmation),
  })
    .then((response: any) => {
      return response.json();
    })
    .catch((error: any) => {
      console.log(`Couldn't proccess player. Status: ${error}`);
    });
};