import React from "react";
import { useState } from "react";
import { Player, FieldType } from "../GameTypes";


interface Props {
    players: Player[];
    field: FieldType;
}


const Field = (props: Props) => {
    const [players, setPlayers] = useState(props.players);

    const FieldStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-around",
        alignContent: "center",
        flexWrap: "wrap",
        width: "100px",
        height: "100px",
        background: props.field.isSpecial ? "orange" : "lightgrey",
        border: "1px black solid",
        gridRow: props.field.row,
        gridColumn: props.field.column
    }

    return (
        <div style={FieldStyle}>
            {
                players.map((player, i) => {
                    const PlayerStyle: React.CSSProperties = {
                        border: "1px black solid",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: player.color,
                        visibility: player.position === props.field.position ? "visible" : "hidden"
                    }
                    return (
                        <div key={i} style={PlayerStyle}></div>
                    );
                })
            }
        </div>
    );
}


export default Field;