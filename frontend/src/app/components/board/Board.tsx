import React from "react";
import { FieldType } from "../../models/FieldType";
import { PlayerType } from "../../models/PlayerType";
import Field from "../field/Field";
import Timer from "../timer/Timer";
import "./Board.css";

interface Props {
  fields: FieldType[];
  players: PlayerType[];
  rows: number;
  columns: number;
}

const Board = (props: Props) => {  
  const GridStyle: React.CSSProperties = {
    gridTemplateRows: `repeat(${props.rows}, 120px)`,
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  };

  return (
    <div className="board-wrap">
      <Timer />
      <div className="board" style={GridStyle}>
        {
        props.fields.map((field, i) => (
          <Field key={i} players={props.players} field={field} />
        ))}
      </div>
    </div>
  );
};

export default Board;
