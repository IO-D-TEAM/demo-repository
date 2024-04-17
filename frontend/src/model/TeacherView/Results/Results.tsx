import React, { useEffect, useState } from "react";
import "./Results.css";
import { useGameStore } from "../../GameView/GameStore/GameStore";
import { GameState } from "../../../interfaces/GameViewInterfaces/GameState";
import { PlayerType } from "../../../interfaces/GameViewInterfaces/PlayerType";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

const Results = () => {
  const { players } = useGameStore((state:GameState) => state);
  const [finalStandings, setFinalStandings] = useState<PlayerType[][]>([]);
  
  useEffect(() => {
    const orderPlayersStandings = () => {
      let standings: PlayerType[][] = Array.from(players, () => []);
      let standing: number = 0;

      players.sort((a, b) => b.position - a.position);
      
      standings[standing].push(players[0]);
      for (let i = 1; i < players.length; i++) {
        if (!(players[i-1].position === players[i].position)) {
          standing++;
        }
        standings[standing].push(players[i]);
      }

      standings = standings.filter((place) => place.length !== 0);
      return standings;
    }
    setFinalStandings(orderPlayersStandings());
  }, [setFinalStandings, players]);


  return (
    <div className="results-wrapper">
      <h1>Wyniki</h1>
      <ul className="standings">
        {
          finalStandings.map((standing, i) => (
            <li className="standing-wrap" key={i}>
              <div>
                <h3>{i+1}.</h3>
              </div>
              <div className="players-group">
                {
                  standing.map((player, i) => (
                    <h3 key={i}>{player.nickname}</h3>
                  ))
                }
              </div>
            </li>
          ))
        }
      </ul>
      <Box textAlign="center">
        <Button
          className="return-btn"
          variant="contained"
          color="success"
          component={Link}
          to="/">
          Powrót
        </Button>
      </Box>
    </div>
  );
}

export default Results;
