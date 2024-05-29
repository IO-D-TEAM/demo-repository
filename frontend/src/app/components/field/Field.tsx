import React from "react";
import { FieldType } from "../../models/FieldType";
import { PlayerType } from "../../models/PlayerType";
import { useGameStore } from "../game-store/GameStore";
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

        // // Function to convert RGBA to hex
        // const rgbaToHex = (color: string) => {
        //   const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        //   if (!rgbaMatch) return "red";
        //   const [, r, g, b] = rgbaMatch;
        //   return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
        // };

        const PlayerStyle: React.CSSProperties = {
          background: "red", // Convert RGBA to hex
          visibility:
            player.position === props.field.position ? "visible" : "hidden",
        };
        return <div key={i} className="player" style={PlayerStyle}></div>;
      })}
    </div>
  );
};

export default Field;