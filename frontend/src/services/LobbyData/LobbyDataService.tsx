import React, { FC, useEffect } from "react";
import { Settings } from "../../interfaces/Settings";

export const GetGameCode = async (): Promise<string> => {
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

export const SendSettingsForm = async (form: Settings) => {
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
