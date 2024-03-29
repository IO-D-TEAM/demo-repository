import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Timer.css";
import { useGameStore } from "../GameState/GameState";


const Timer = () => {
    const { gameDuration, setGameDuration, setFinish } = useGameStore((state) => state);
    const [seconds, setSeconds] = useState(0);
    // const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (gameDuration === 0 && seconds === 0) {
                setFinish(true);
                return () => clearInterval(timerId);
            }
            
            setSeconds(seconds - 1);
            if (seconds === 0) {
                setGameDuration(gameDuration - 1);
                setSeconds(59)
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
            <button className="finish-btn timer-comps" onClick={onClick}>
                ZAKOŃCZ
            </button>
        </div>
    );
}


export default Timer;