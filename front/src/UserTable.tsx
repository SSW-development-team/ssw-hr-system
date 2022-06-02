/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Container, Form, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import { Column, useTable } from 'react-table';
import { SerializedUserDto } from './dto/SerializedUserDto';

function UserTable(props: {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
}) {
  const { users, setUsers } = props;
  const data: SerializedUserDto[] = useMemo(
    () =>
      users.map((user) => ({
        id: user.id ?? '',
        username: user.username ?? '',
        displayName: user.displayName ?? '',
        joined_at: user.joined_at ?? '',
        left_at: user.left_at ?? '',
        comment: user.comment ?? '',
        departments: user.departments
          ? user.departments?.map((d) => d.name).join(',')
          : '',
      })),
    [users]
  );

  const columns: Column<SerializedUserDto>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'ユーザ名',
        accessor: 'username',
      },
      {
        Header: '表示名',
        accessor: 'displayName',
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

    return id == 'comment' ? (
      <Form.Control
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="form-control-plaintext"
      />
    ) : (
      <>{value}</>
    );
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  const updateMyData = (rowIndex: number, columnId: string, value: any) => {
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
    const user = newUsers[rowIndex];
    axios.patch(
      (process.env.REACT_APP_SERVER_URL ?? 'SERVER_URL') + '/users/' + user.id,
      { [columnId]: value }
    );
  };

  const tableProps: any = {
    columns,
    data,
    defaultColumn,
    updateMyData,
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<SerializedUserDto>(tableProps);

  return (
    <Table striped bordered hover {...getTableProps()} size={'sm'}>
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
                <td {...cell.getCellProps()} className="align-middle">
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default UserTable;
