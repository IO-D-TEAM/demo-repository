import React from "react";
import { GameConfig } from "../../interfaces/GameViewInterfaces/GameConfig";


export const GetGameConfig = async (): Promise<GameConfig> => {
    // Getting mock data for now
    // To get real data just swap mock with settings
    return await fetch('/game/mock')
        .then((response) => response.json())
        .then((data: GameConfig) => {
            return data
        })
        .catch((error) => {
            throw new Error(`HTTP GET error while getting game configuration! Status: ${error}`)
        })
}