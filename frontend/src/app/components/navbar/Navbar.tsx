import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <div className="btns">
    <Stack direction="column" spacing={2}>
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
