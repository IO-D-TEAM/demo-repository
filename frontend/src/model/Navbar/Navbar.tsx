import React, { FC } from "react";
import "./Navbar.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <div className="btns">
    <Stack direction="column" spacing={2}>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/teacherView/createGame"
      >
        Create Game
      </Button>
      <Button variant="contained" color="primary" component={Link} to="/lobby">
        Start Lobby
      </Button>
      <Button
        variant="contained"
        color="success"
        component={Link}
        to="/teacherView/createQuestions"
      >
        Create Questions
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/teacherView/results"
      >
        Show Results
      </Button>
      <Button
        variant="contained"
        color="error"
        component={Link}
        to="/teacherView"
      >
        Back to Teacher View
      </Button>
    </Stack>
  </div>
);

export default Navbar;
