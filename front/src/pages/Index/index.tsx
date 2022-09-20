/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import { UserDto } from '../../dto/UserDto';
import { DepartmentDto } from '../../dto/DepartmentDto';
import UserTable from './table/UserTable';
import client from '../../util/client';
import { Typography } from '@mui/material';

function Index(): JSX.Element {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    client.get<UserDto[]>('/users').then((res) => setUsers(res.data));
    client
      .get<DepartmentDto[]>('/departments')
      .then((res) => setDepartments(res.data.filter((d) => !d.hide)));
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
