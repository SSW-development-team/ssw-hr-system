/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect } from 'react';
import './App.css';
import { Form, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useSortBy,
  useTable,
} from 'react-table';
import { SerializedUserDto } from './dto/SerializedUserDto';
import { DepartmentDto } from './dto/DepartmentDto';

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row: any) => {
      row.values[id].split(',').forEach((o: string) => options.add(o));
    });
    options.delete('');
    return Array.from(options.values());
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Form.Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">全て</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Form.Select>
  );
}

function UserTable(props: {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
  departments: DepartmentDto[];
}) {
  const { users, setUsers, departments } = props;
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
        // defaultCanFilter: true,
      },
      {
        Header: 'コメント',
        accessor: 'comment',
      },
      {
        Header: 'CK1',
        accessor: 'check1',
        Filter: SelectColumnFilter,
        filter: 'textWithoutBot',
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

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    ) : id == 'check1' ? (
      <Form.Check
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

  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }: any) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (
      <Form.Control
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{ width: '100%' }}
      />
    );
  }

  function DefaultColumnFilter({ column: { filterValue, setFilter } }: any) {
    return (
      <Form.Control
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    );
  }

  const IGNORE_DEPARTMENTS = ['BOT', '亡命政府'];

  const textWithoutBotFillter = (rows: any, id: any, filterValue: string) => {
    return rows.filter((row: any) => {
      let rowValue: string = row.values[id];
      if (rowValue === undefined) return true;
      rowValue = String(rowValue).toLowerCase();
      const ignore_departments = IGNORE_DEPARTMENTS.map((d) => d.toLowerCase());
      if (filterValue == '*') return !ignore_departments.includes(rowValue);
      if (IGNORE_DEPARTMENTS.includes(filterValue))
        return rowValue.includes(String(filterValue).toLowerCase());
      return (
        !ignore_departments.includes(rowValue) &&
        rowValue.includes(String(filterValue).toLowerCase())
      );
    });
  };

  const filterTypes = React.useMemo(
    () => ({
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
      textWithoutBot: textWithoutBotFillter,
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
    setFilter('departments', '*');
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

export default UserTable;
