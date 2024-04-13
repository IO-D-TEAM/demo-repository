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
