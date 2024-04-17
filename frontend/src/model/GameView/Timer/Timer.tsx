import React from "react";
import { useState, useEffect } from "react";
import "./Timer.css";
import { useGameStore } from "../GameStore/GameStore";
import { Button } from "@mui/material";


const Timer = () => {
    const { gameDuration, setGameDuration, setFinish } = useGameStore((state) => state);
    const [seconds, setSeconds] = useState(0);
    const secondsRestart: number = 59;

    useEffect(() => {
        const timerId = setInterval(() => {
            if (gameDuration === 0 && seconds === 0) {
                setFinish(true);
                return () => clearInterval(timerId);
            }
            
            setSeconds(seconds - 1);
            if (seconds === 0) {
                setGameDuration(gameDuration - 1);
                setSeconds(secondsRestart)
            }

        }, 1000);
    
        return () => clearInterval(timerId);

    }, [gameDuration, setGameDuration, setFinish, seconds, ]);

    const onClick = () => {
        setFinish(true);
    }

    return (
        <div className="timer">
            <span className="time-left timer-comps">{gameDuration < 10 ? `0${gameDuration}` : gameDuration}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            {/* <button className="finish-btn timer-comps" onClick={onClick}>
                ZAKOŃCZ
            </button> */}
            <Button
                variant="contained"
                color="success"
                onClick={() => onClick()}
            >
                Zakończ
            </Button>
        </div>
    );
}


export default Timer;