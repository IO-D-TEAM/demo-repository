import React from "react";
import { useState } from "react";
import { Player, FieldType } from "../GameTypes";
import "./Field.css";


interface Props {
    players: Player[];
    field: FieldType;
}


const Field = (props: Props) => {
    const [players, setPlayers] = useState(props.players);

    const FieldStyle: React.CSSProperties = {
        background: props.field.isSpecial ? "orange" : "lightgrey",
        gridRow: props.field.row,
        gridColumn: props.field.column
    }

    return (
        <div className="field" style={FieldStyle}>
            {
                players.map((player, i) => {
                    const PlayerStyle: React.CSSProperties = {
                        background: player.color,
                        visibility: player.position === props.field.position ? "visible" : "hidden"
                    }
                    return (
                        <div key={i} className="player" style={PlayerStyle}></div>
                    );
                })
            }
        </div>
    );
}


export default Field;