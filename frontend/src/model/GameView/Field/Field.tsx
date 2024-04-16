import React from "react";
import { PlayerType } from "../../../interfaces/GameViewInterfaces/PlayerType";
import { FieldType } from "../../../interfaces/GameViewInterfaces/FieldType";
import { useGameStore } from "../GameStore/GameStore";
import "./Field.css";

interface Props {
  players: PlayerType[];
  field: FieldType;
}

const Field = (props: Props) => {
  const { boardSize } = useGameStore((state) => state);

  const getColor = () => {
    if (props.field.position === boardSize - 1) return "#DACC3E";

    if (props.field.speciality === "SPECIAL") return "#DF3030";

    return props.field.speciality === "QUESTION" ? "#6db922" : "#c6c5c5";
  };

  const FieldStyle: React.CSSProperties = {
    background: getColor(),
    gridRow: props.field.row,
    gridColumn: props.field.column,
    flexDirection: props.field.row % 2 === 1 ? "column" : "row",
  };

  return (
    <div className="field" style={FieldStyle}>
      {props.players.map((player, i) => {
        const PlayerStyle: React.CSSProperties = {
          background: player.color,
          visibility:
            player.position === props.field.position ? "visible" : "hidden",
        };
        return <div key={i} className="player" style={PlayerStyle}></div>;
      })}
    </div>
  );
};

export default Field;
