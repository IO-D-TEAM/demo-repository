import React from "react";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";


export const GetGameConfig = async (): Promise<GameConfig> => {
    return await fetch('/gameConfig')
        .then((response) => response.json())
        .then((data: GameConfig) => {
            return data
        })
        .catch((error) => {
            throw new Error(`HTTP GET error while getting game configuration! Status: ${error}`)
        })
}