import React from "react";
import { Link } from "react-router-dom";
import "./FinishWindow.css";


const FinishWindow = () => {
    return (
        <div className="game-over">
            <h1>KONIEC GRY</h1>
            <Link className="show-res" to={"/teacherView/results"}>
                Pokaż wyniki
            </Link>
        </div>
    );
}


export default FinishWindow;