import React, { FC } from "react";
import "./UserView.css";
import JoinGame from "./JoinGame/JoinGame";
import AnswerQuestion from "./AnswerQuestion/AnswerQuestion";

interface UserViewProps {}

const UserView: FC<UserViewProps> = () => (
  <div className="main">
    UserView Component
    <br />
    Opcje:
    <ul className="options">
      <li>Wpisuje kodzik</li>
      <li>Odpowiadam na pytania</li>
      <li>Rzuca kością</li>
    </ul>
  </div>
);

export default UserView;
