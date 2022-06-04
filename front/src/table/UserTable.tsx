/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { UserDto } from '../dto/UserDto';
import axios from 'axios';
import {
  Column,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useSortBy,
  useTable,
} from 'react-table';
import { SerializedUserDto } from '../dto/SerializedUserDto';
import { DepartmentDto } from '../dto/DepartmentDto';
import SelectColumnFilter from './filter/SelectColumnFilter';
import GlobalFilter from './filter/GlobalFilter';
import DefaultColumnFilter from './filter/DefaultColumnFilter';
import { textWithoutBotFillter } from './filter/textWithoutBotFillter';
import { textFilter } from './filter/textFilter';
import { booleanFilter } from './filter/booleanFilter';
import BooleanSelect from './filter/BooleanSelect';
import { EditableCell } from './EditableCell';
import { CheckboxCell } from './CheckboxCell';

export default function UserTable(props: {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
  departments: DepartmentDto[];
}) {
  const { users, setUsers, departments } = props;
  const [isSetInitialFilter, setIssetInitialFilter] = useState(false);
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
        check1: user.check1,
      })),
    [users]
  );

  const columns: Column<SerializedUserDto>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 105,
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
        maxWidth: 60,
      },
      {
        Header: '脱退日',
        accessor: 'left_at',
        maxWidth: 60,
      },
      {
        Header: '部門',
        accessor: 'departments',
        Filter: SelectColumnFilter,
        filter: 'textWithoutBot',
      },
      {
        Header: 'コメント',
        accessor: 'comment',
        Cell: EditableCell,
      },
      {
        Header: 'CK1',
        accessor: 'check1',
        Filter: BooleanSelect,
        filter: 'booleanFilter',
        Cell: CheckboxCell,
        maxWidth: 30,
      },
    ],
    []
  );

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Filter: DefaultColumnFilter,
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

  const filterTypes = React.useMemo(
    () => ({
      text: textFilter,
      textWithoutBot: textWithoutBotFillter,
      boolean: booleanFilter,
    }),
    []
  );

  const tableProps: any = {
    columns,
    data,
    defaultColumn,
    updateMyData,
    filterTypes,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
  } = useTable<SerializedUserDto>(
    tableProps,
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    useFlexLayout
  );

  useEffect(() => {
    if (!isSetInitialFilter && departments.length > 0 && users.length > 0) {
      setFilter('departments', '*');
      setIssetInitialFilter(true);
      console.log('why');
    }
  }, [departments, users]);

  return (
    <div className="table-responsive-sm">
      <Table striped bordered hover {...getTableProps()} size={'sm'}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th colSpan={columns.length}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="align-middle p-0">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
