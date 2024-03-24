import React from "react";
import { useState, useEffect } from "react";


interface Props {
    minutes: number;
}


const Timer = (props: Props) => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(props.minutes);

    const TimerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-evenly",
        margin: "1rem"
    }

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
        <div style={TimerStyle}>
            <h2>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
            <button>Finish</button>
        </div>
    );
}


export default Timer;