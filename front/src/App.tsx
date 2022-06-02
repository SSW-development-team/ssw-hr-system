/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import UserTable from './UserTable';

function App() {
  const [users, setUsers] = useState(new Array<UserDto>());

  useEffect(() => {
    axios
      .get((process.env.REACT_APP_SERVER_URL ?? 'SERVER_URL') + '/users')
      .then((res) => {
        setUsers(res.data);
        console.log('hi');
      });
  }, []);

  return (
    <Container className="pt-5" fluid>
      <h1>SSW 人事管理システム</h1>
      <h2>名簿</h2>
      <UserTable users={users} setUsers={setUsers}></UserTable>
    </Container>
  );
}

export default App;
