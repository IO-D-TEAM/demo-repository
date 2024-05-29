import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateQuestionsSet from "./components/create-questions/CreateQuestionsSet";
import GameView from "./components/game-view/GameView";
import JoinGame from "./components/join-game/JoinGame";
import Lobby from "./components/lobby/Lobby";
import BoardView from "./components/menu-view/BoardView";
import Results from "./components/results/Results";
import TeacherView from "./components/teachers-view/TeacherView";
import UserView from "./components/user-view/UserView";
import WaitingScreen from "./components/waiting-screen/WaitingScreen";

function App() {
  return (
    <div className="background-img">
      <Router>
        <Routes>
          <Route path="/" element={<TeacherView />} />
          <Route path="/teacherView" element={<TeacherView />} />
          <Route
            path="/teacherView/createQuestions"
            element={<CreateQuestionsSet />}
          />
          <Route path="/teacherView/results" element={<Results />} />
          <Route path="/userView" element={<UserView />} />
          <Route path="/userView/joinGame/:gameCode" element={<JoinGame />} />
          <Route
            path="/userView/waitingRoom/:gameCode/:id"
            element={<WaitingScreen />}
          />
          <Route path="/board" element={<BoardView />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/gameView" element={<GameView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
