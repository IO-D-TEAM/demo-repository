import React from "react";
import { useState } from "react";
import Field from "../Field/Field";
import { Player, FieldType } from "../GameTypes";


interface Props {
    fields: FieldType[];
    players: Player[];
    rows: number;
    columns: number;
}


const Board = (props: Props) => {
    const GridStyle: React.CSSProperties = {
        margin: "0 auto",
        width: "1400px",
        display: "grid",
        gridTemplateRows: `repeat(${props.rows}, 100px)`,
        gridTemplateColumns: `repeat(${props.columns}, 100px)`
    }

    return (
        <div style={GridStyle}>
            {
                props.fields.map((field, i) => (
                    <Field key={i} players={props.players} field={field}/>
                ))
            }
        </div>
    );
}


export default Board;