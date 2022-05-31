/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Form, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import { Cell, CellProps, Column, useTable } from 'react-table';
import { UserDto2 } from './dto/UserDto2';

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

  const data: UserDto2[] = React.useMemo(
    () =>
      users.map((user) => ({
        id: user.id ?? '',
        name: user.name ?? '',
        joined_at: user.joined_at ?? '',
        left_at: user.left_at ?? '',
        comment: user.comment ?? '',
        departments: user.departments
          ? user.departments?.map((d) => d.name).join(',')
          : '',
      })),
    [users]
  );

  const columns: Column<UserDto2>[] = React.useMemo(
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

  // Create an editable cell renderer
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }: any) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e: any) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Form.Control
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="form-control-plaintext"
      />
    );
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  const updateMyData = (rowIndex: number, columnId: number, value: any) => {
    // We also turn on the flag to not reset the page
    const newUsers = users.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...users[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    });
    setUsers(newUsers);
    console.log(users);
  };

  const tableProps: any = {
    columns,
    data,
    defaultColumn,
    updateMyData,
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<UserDto2>(tableProps);

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
