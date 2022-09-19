/* eslint-disable react/jsx-key */
import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App(): JSX.Element {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SSW 人事管理システム
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <h1>SSW 人事管理システム3</h1>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
