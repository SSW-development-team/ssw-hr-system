/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import { UserDto } from './dto/UserDto';
import { DepartmentDto } from './dto/DepartmentDto';
import UserTable from './table/UserTable';
import client from '../../util/client';
import { Typography } from '@mui/material';

function Index(): JSX.Element {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    client.get('/users').then((res) => setUsers(res.data));
    client.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  return (
    <>
      <Typography variant="h3" m={2}>
        名簿
      </Typography>
      <UserTable
        users={users}
        setUsers={setUsers}
        departments={departments}
      ></UserTable>
    </>
  );
}

export default Index;
