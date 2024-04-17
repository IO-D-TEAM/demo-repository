import React from "react";
import { Link } from "react-router-dom";
import { EndGame } from "../../../services/Game/GameService";
import "./FinishWindow.css";
import { Box, Button } from "@mui/material";


const FinishWindow = () => {
    const sendResults = () => {
        EndGame();
    }

    return (
        <div className="game-over">
            <h1>KONIEC GRY</h1>
            {/* <Link className="show-res" to={"/teacherView/results"} onClick={sendResults}>
                Pokaż wyniki
            </Link> */}
            <Box textAlign="center">
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/teacherView/results"
                    onClick={sendResults}
                >
                    Pokaż wyniki
                </Button>
            </Box>
        </div>
    );
}


export default FinishWindow;