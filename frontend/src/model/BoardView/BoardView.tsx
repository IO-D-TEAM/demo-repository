import React, { FC, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { GetMsgFromSpring } from '../Test/Test';

interface BoardViewProps {}

export const BoardView = () => {
  const [testMsg, setTestMsg] = useState("")

  useEffect(() => {
    GetMsgFromSpring()
      .then((data: any) => {
        console.log(data)
        setTestMsg(data)
      })
      .catch((err) => {
        console.log("Error while testing spring boot response: " + err)
      })
  }, [])

  return (
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
    Message from srping boot: {testMsg}
  </div>
  )
  };

export default BoardView;
