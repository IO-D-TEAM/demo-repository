import React, { FC } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

interface BoardViewProps {}

const BoardView: FC<BoardViewProps> = () => (
  <div className='btns'>
    BoardView Component
    <Stack direction="column" spacing={2}>
      <Button variant="contained" color="secondary" component={Link} to="/userView">
        Go to User View
      </Button>
      <Button variant="contained" color="primary" component={Link} to="/teacherView">
        Go to Teacher View
      </Button>
    </Stack>
  </div>
);

export default BoardView;
