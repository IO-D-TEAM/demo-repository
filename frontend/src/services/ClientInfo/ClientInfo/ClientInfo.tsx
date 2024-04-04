import React, { FC } from "react";

export const connectToTheGame = async (
  gamecode: string,
  nickname: string
): Promise<any> => {
  try {
    const response = await fetch(`/${gamecode}/join_game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nickname }),
    });

    if (!response.ok) {
      throw new Error("Failed to connect to server");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
