import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GameState } from "../../models/GameState";
import { PlayerType } from "../../models/PlayerType";
import { useGameStore } from "../game-store/GameStore";
import "./Results.css";

const Results = () => {
  const { players } = useGameStore((state: GameState) => state);
  const [finalStandings, setFinalStandings] = useState<PlayerType[][]>([]);

  useEffect(() => {
    const orderPlayersStandings = () => {
      let standings: PlayerType[][] = Array.from(players, () => []);
      let standing: number = 0;

      players.sort((a, b) => b.position - a.position);

      standings[standing].push(players[0]);
      for (let i = 1; i < players.length; i++) {
        if (!(players[i - 1].position === players[i].position)) {
          standing++;
        }
        standings[standing].push(players[i]);
      }

      standings = standings.filter((place) => place.length !== 0);
      return standings;
    };
    setFinalStandings(orderPlayersStandings());
  }, [setFinalStandings, players]);

  return (
    <div className="results-wrapper">
      <h1>Wyniki</h1>
      <ul className="standings">
        {finalStandings.map((standing, i) => (
          <li className="standing-wrap" key={i}>
            <div className="place">
              <h3>{i + 1}.</h3>
            </div>
            <div className="players-group">
              {standing.map((player, i) => (
                <div key={i}>
                  <h3>{player.nickname}</h3>
                  <div
                    className="pawn"
                    style={{
                      borderRadius: "50%",
                      backgroundColor: player.color,
                      width: "1rem",
                      height: "1rem",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <Box textAlign="center">
        <Button
          className="return-btn"
          variant="contained"
          color="success"
          component={Link}
          to="/teacherView"
        >
          Powrót
        </Button>
      </Box>
    </div>
  );
};

export default Results;
