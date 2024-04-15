import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BoardView from './model/BoardView/BoardView';
import TeacherView from './model/TeacherView/TeacherView';
import CreateGame from './model/TeacherView/CreateGame/CreateGame';
import UserView from './model/UserView/UserView';
import AnswerQuestion from './model/UserView/AnswerQuestion/AnswerQuestion';
import JoinGame from './model/UserView/JoinGame/JoinGame';
import Move from './model/UserView/Move/Move';
import Lobby from './model/Lobby/Lobby';
import CreateQuestionsSet from './model/TeacherView/CreateQuestionsSet/CreateQuestionsSet';
import Results from './model/TeacherView/Results/Results';
import GameView from './model/GameView/GameView';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<BoardView/>}/>
          <Route path="/teacherView" element={<TeacherView/>}/>
          <Route path="/teacherView/createGame" element={<CreateGame/>}/>
          <Route path="/teacherView/createQuestions" element={<CreateQuestionsSet/>}/>
          <Route path="/teacherView/results" element={<Results/>}/>
          <Route path="/userView" element={<UserView/>}/>
          <Route path="/userView/answerQuestion/:clientId/:gameId" element={<AnswerQuestion />} />
          <Route path="/userView/joinGame" element={<JoinGame/>}/>
          <Route path="/userView/move" element={<Move/>}/>
          <Route path="/board" element={<BoardView/>}/>
          <Route path="/lobby" element={<Lobby/>}/>
          <Route path="/gameView" element={<GameView/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
