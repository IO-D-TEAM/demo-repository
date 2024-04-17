import React from "react";
import { Link } from "react-router-dom";
import { endGame } from "../../../services/Game/GameService";
import "./FinishWindow.css";
import { Box, Button } from "@mui/material";


const FinishWindow = () => {
    const postGameFinish = () => {
        endGame();
    }

    return (
        <div className="game-over">
            <h1>KONIEC GRY</h1>
            <Box textAlign="center">
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/teacherView/results"
                    onClick={postGameFinish}
                >
                    Pokaż wyniki
                </Button>
            </Box>
        </div>
    );
}


export default FinishWindow;