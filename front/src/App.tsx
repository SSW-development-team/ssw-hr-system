/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import { useTable } from 'react-table';
function App() {
  const [users, setUsers] = useState(new Array<UserDto>());

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        (process.env.REACT_APP_SERVER_URL ?? 'SERVER_URL') + '/users'
      );
      setUsers(res.data);
    })();
  }, []);

  const data = React.useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        joined_at: user.joined_at,
        left_at: user.left_at,
        comment: user.comment,
        departments: user.departments?.map((d) => d.name).join(','),
      })),
    [users]
  );

  const columns: any = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: '名前',
        accessor: 'name',
      },
      {
        Header: '参加日',
        accessor: 'joined_at',
      },
      {
        Header: '脱退日',
        accessor: 'left_at',
      },
      {
        Header: '部門',
        accessor: 'departments',
      },
      {
        Header: 'コメント',
        accessor: 'comment',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Container className="pt-5">
      <h1>SSW 人事管理システム</h1>
      <h2>名簿</h2>
      <Table striped bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
