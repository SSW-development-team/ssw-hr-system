/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { UserDto } from '../dto/UserDto';
import {
  Column,
  FilterTypes,
  TableOptions,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  UseGlobalFiltersInstanceProps,
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
import client from '../client';
import { reEnrollFilter } from './filter/reEnrollFilter';

export default function UserTable(props: {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
  departments: DepartmentDto[];
}) {
  const { users, setUsers, departments } = props;
  const [isSetInitialFilter, setIssetInitialFilter] = useState(false);
  // const filterdUsers: SerializedUserDto[] = useMemo(() => {});
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
        maxWidth: 160,
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
        maxWidth: 85,
      },
      {
        Header: '脱退日',
        accessor: 'left_at',
        maxWidth: 85,
      },
      {
        Header: '部門',
        accessor: 'departments',
        Filter: SelectColumnFilter,
        filter: 'textWithoutBot',
        width: 300,
      },
      {
        Header: 'コメント',
        accessor: 'comment',
        Cell: EditableCell,
        width: 600,
      },
      {
        Header: 'CK1',
        accessor: 'check1',
        Filter: BooleanSelect,
        filter: 'booleanFilter',
        Cell: CheckboxCell,
        maxWidth: 50,
      },
    ],
    []
  );

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Filter: DefaultColumnFilter,
  };

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
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
    client.patch('/users/' + user.id, { [columnId]: value });
  };

  const filterTypes: FilterTypes<SerializedUserDto> = useMemo(
    () => ({
      text: textFilter,
      textWithoutBot: textWithoutBotFillter,
      boolean: booleanFilter,
    }),
    []
  );

  const tableOptions: TableOptions<SerializedUserDto> = {
    columns,
    data,
    defaultColumn,
    updateMyData,
    filterTypes,
    globalFilter: reEnrollFilter,
    autoResetFilters: false,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    setFilter,
  } = useTable<SerializedUserDto>(
    tableOptions,
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    useFlexLayout
  );

  useEffect(() => {
    if (!isSetInitialFilter && departments.length > 0 && users.length > 0) {
      setFilter('departments', '*');
      setIssetInitialFilter(true);
    }
  }, [departments, users]);

  return (
    <div className="table-responsive-sm">
      <Table striped bordered hover {...getTableProps()} size={'sm'}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps({
                    style: {
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    },
                  })}
                >
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span className="mr-1">
                      {column.isSorted && (column.isSortedDesc ? '🔽' : '🔼')}
                    </span>
                  </div>
                  <div>{column.canFilter && column.render('Filter')}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th colSpan={columns.length}>
              <GlobalFilter
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
                  <td
                    {...cell.getCellProps({
                      style: {
                        minWidth: cell.column.minWidth,
                        maxWidth: cell.column.maxWidth,
                      },
                    })}
                    className="align-middle p-0"
                  >
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
