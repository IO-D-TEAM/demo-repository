import { error } from "console";
import { Player } from "../../interfaces/Player";
import { Settings } from "../../interfaces/Settings";
import { json } from "stream/consumers";

export const getGameUrl = async (): Promise<string> => {
  return await fetch("http://localhost:8080/settings/get_url")
    .then((response) => response.json())
    .then((data: any) => {
      console.log(data);
      return data.message;
    })
    .catch((error) => {
      throw new Error(
        `HTTP GET error while getting a game link! Status: ${error}`
      );
    });
};

export const sendSettingsForm = async (form: Settings) => {
  console.log(form);
  const response = await fetch(`/settings/update`, {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP POST error while sending a form! Status: ${response.status}`
    );
  }
};

export const startGame = async () => {
  const response = await fetch(`/game/startGame`, {
    method: "POST",
    body: JSON.stringify(null),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP POST error while sending a form! Status: ${response.status}`
    );
  }
};

export const getPlayers = async (): Promise<Player[]> => {
  return await fetch("http://localhost:3000/lobby/players")
    .then((response) => response.json())
    .then((players: Player[]) => {
      return players;
    })
    .catch((error) => {
      throw new Error(`HTTP GET error while getting players! Status: ${error}`);
    });
};

export const deletePlayer = async (player: Player): Promise<boolean> => {
  return await fetch(`/lobby/deletePlayer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  })
    .then((res: any) => {
      console.log(res.status);
      if (res.ok) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      throw new Error(
        `HTTP POST error while deleting player! Status: ${error}`
      );
    });
};
