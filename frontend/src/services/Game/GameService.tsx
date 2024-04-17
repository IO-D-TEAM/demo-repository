import React from "react";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";

export const getGameConfig = async (): Promise<GameConfig> => {
  return await fetch("/game/mock")
    .then((response) => response.json())
    .then((data: GameConfig) => {
      return data;
    })
    .catch((error) => {
      throw new Error(
        `HTTP GET error while getting game configuration! Status: ${error}`
      );
    });
};


export const endGame = async() => {
  const response = await fetch(`/game/endGame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `HTTP POST error while ending the game! Status: ${response.status}`
    );
  }
};
