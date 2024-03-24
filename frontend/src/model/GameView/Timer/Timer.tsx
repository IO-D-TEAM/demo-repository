import React from "react";
import { useState, useEffect } from "react";
import "./Timer.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";


interface Props {
    minutes: number;
}


const Timer = (props: Props) => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(props.minutes);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (minutes === 0 && seconds === 0) {
                return () => clearInterval(timerId);
            }
            
            setSeconds(seconds - 1);
            if (seconds === 0) {
                setMinutes(minutes - 1);
                setSeconds(59)
            }

        }, 1000);

        return () => clearInterval(timerId);
    }, [minutes, seconds]);

    return (
        <div className="timer">
            <p className="time-left">{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
            <Button className="finish-btn" variant="contained" component={Link} to="/teacherView/results">
                Zakończ
            </Button>
        </div>
    );
}


export default Timer;