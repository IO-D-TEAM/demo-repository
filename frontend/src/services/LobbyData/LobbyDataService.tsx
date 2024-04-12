import React, { FC, useEffect } from "react";
import { error } from "console"
import { Settings } from "../../interfaces/Settings";

export const getGameCode = async (): Promise<string> => {
  return await fetch("/gameCode")
    .then((response) => response.json())
    .then((data: string) => {
      return data;
    })
    .catch((error) => {
      throw new Error(
        `HTTP GET error while getting a game code! Status: ${error}`
      );
    });
};

export const getGameUrl = async (): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8080/game/get_url');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const url = data.message; // Extracting URL from the JSON response
    return url;
  } catch (error) {
    throw new Error(`Error while getting the game URL: ${error}`);
  }
};


export const sendSettingsForm = async (form: Settings) => {
  const response = await fetch(`/lobby/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP POST error while sending a form! Status: ${response.status}`
    );
  }
};