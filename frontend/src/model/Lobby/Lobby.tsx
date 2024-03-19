import React, { FC } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

interface LobbyProps {}

const Lobby: FC<LobbyProps> = () => (
  <div className='btns'>
    Lobby Component
    <Stack direction="column" spacing={2}>
      <Button variant="contained" color="secondary" component={Link} to="/board">
        Start Game
      </Button>
    </Stack>
  </div>
);

export default Lobby;
