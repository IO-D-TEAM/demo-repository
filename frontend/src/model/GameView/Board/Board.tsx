import React from "react";
import { Player, FieldType } from "../GameTypes";
import Field from "../Field/Field";
import Timer from "../Timer/Timer";
import "./Board.css";


interface Props {
    fields: FieldType[];
    players: Player[];
    rows: number;
    columns: number;
}


const Board = (props: Props) => {
    const GridStyle: React.CSSProperties = {
        gridTemplateRows: `repeat(${props.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`
    }

    return (
        <div className="board-wrap">
            <Timer/>
            <div className="board" style={GridStyle}>
                {
                    props.fields.map((field, i) => (
                        <Field key={i} players={props.players} field={field}/>
                    ))
                }
            </div>
        </div>
    );
}


export default Board;