/* eslint-disable react/jsx-key */
import { useMemo, useEffect, useState } from 'react';
import { UserDto } from '../dto/UserDto';
import {
  Column,
  FilterTypes,
  TableOptions,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useSortBy,
  useTable,
} from 'react-table';
import { SerializedUserDto } from '../dto/SerializedUserDto';
import { DepartmentDto } from '../dto/DepartmentDto';
import SelectColumnFilter from './filter/SelectColumnFilter';
import GlobalFilter, { GlobalFilterValue } from './filter/GlobalFilter';
import DefaultColumnFilter from './filter/DefaultColumnFilter';
import { textWithoutBotFillter } from './filter/textWithoutBotFillter';
import { textFilter } from './filter/textFilter';
import { booleanFilter } from './filter/booleanFilter';
import BooleanSelect from './filter/BooleanSelect';
import { EditableCell } from './EditableCell';
import { CheckboxCell } from './CheckboxCell';
import client from '../../../util/client';
import { reEnrollFilter } from './filter/reEnrollFilter';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function UserTable(props: {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
  departments: DepartmentDto[];
}): JSX.Element {
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

  const columns = useMemo<Column<SerializedUserDto>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        minWidth: 160,
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
    initialState: {
      globalFilter: { reEnroll: false, isExist: true } as GlobalFilterValue,
    },
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
    <TableContainer component={Paper}>
      <Table {...getTableProps()} size="small" padding="none">
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  component="th"
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
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" colSpan={columns.length} padding="normal">
              <GlobalFilter
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell
                    {...cell.getCellProps({
                      style: {
                        minWidth: cell.column.minWidth,
                        maxWidth: cell.column.maxWidth,
                      },
                    })}
                    className="d-flex align-items-center p-0"
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
