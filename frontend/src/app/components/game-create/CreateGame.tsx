import { FC } from "react";
import Navbar from "../navbar/Navbar";

interface CreateGameProps {}

const CreateGame: FC<CreateGameProps> = () => (
  <div>
    <Navbar></Navbar>
    CreateGame Component
  </div>
);

export default CreateGame;
