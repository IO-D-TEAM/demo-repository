import React from "react";
import { GamePlayer } from "../../../interfaces/GameViewInterfaces/GamePlayer";
import { FieldType } from "../../../interfaces/GameViewInterfaces/FieldType";
import { useGameStore } from "../GameStore/GameStore";
import "./Field.css";

interface Props {
  players: GamePlayer[];
  field: FieldType;
}

const Field = (props: Props) => {
  const { boardSize } = useGameStore((state) => state);

  const getColor = () => {
    if (props.field.position === boardSize - 1) {
      return "#DACC3E";
    }

    if (props.field.isSpecial) return "#DF3030";

    return props.field.position % 2 === 1 ? "#6db922" : "#c6c5c5";
  };

  const getBorder = () => {
    if (props.field.position % 2 === 1 && props.field.isSpecial) {
      return "5px solid #6db922";
    }
    return "none";
  };

  const FieldStyle: React.CSSProperties = {
    border: getBorder(),
    background: getColor(),
    gridRow: props.field.row,
    gridColumn: props.field.column,
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
