import React from "react";
import { useState } from "react";
import Field from "../Field/Field";
import { Player, FieldType } from "../GameTypes";
import "./Board.css";
import Timer from "../Timer/Timer";


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
            <Timer minutes={5}/>
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