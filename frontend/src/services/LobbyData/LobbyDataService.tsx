import React, { FC, useEffect } from 'react';


export const GetGameCode = async (): Promise<string> => {
    return await fetch('gameCode')
        .then((response) => response.json())
        .then((data: string) => {
            return data
        })
        .catch((error) => {
            throw new Error(`HTTP GET error while getting game code! Status: ${error}`)
        })
}