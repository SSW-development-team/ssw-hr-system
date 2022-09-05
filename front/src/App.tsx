/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import { DepartmentDto } from './dto/DepartmentDto';
import UserTable from './table/UserTable';
import client from './client';

function App(): JSX.Element {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    client.get('/users').then((res) => setUsers(res.data));
    client.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  return (
    <Container className="pt-5" fluid>
      <h1>SSW 人事管理システム</h1>
      <h2>名簿</h2>
      <UserTable
        users={users}
        setUsers={setUsers}
        departments={departments}
      ></UserTable>
    </Container>
  );
}

export default App;
