import React, { FC } from 'react';
import "./UserView.css"
import JoinGame from './JoinGame/JoinGame';
import AnswerQuestion from './AnswerQuestion/AnswerQuestion';
import Move from './Move/Move';


interface UserViewProps {}

const UserView: FC<UserViewProps> = () => (
  <div className='main'>
    UserView Component
    <br />
    Opcje: 
    <ul className='options'>
      <li>
        Wpisuje kodzik
        <JoinGame></JoinGame>
      </li>
      <li>
        Odpowiadam na pytania
        <AnswerQuestion></AnswerQuestion>
      </li>
      <li>
        Rzuca kością
        <Move></Move>
      </li>
    </ul>
  </div>
);

export default UserView;
