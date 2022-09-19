/* eslint-disable react/jsx-key */
import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <Container className="pt-5" fluid>
      <h1>SSW 人事管理システム3</h1>
      <Outlet />
    </Container>
  );
}

export default App;
