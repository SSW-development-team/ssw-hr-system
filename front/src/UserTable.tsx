/* eslint-disable react/jsx-key */
import React, { useMemo } from 'react';
import './App.css';
import { Form, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable,
} from 'react-table';
import { SerializedUserDto } from './dto/SerializedUserDto';
import { DepartmentDto } from './dto/DepartmentDto';

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
        Filter: SelectColumnFilter,
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

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }: any) {
    return (
      <Form.Control
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    );
  }

  // This is a custom filter UI for selecting
  // a unique option from a list
  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }: any) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      console.log('calc opt', departments);
      const options = new Set<string>();
      departments.forEach((department) => {
        options.add(department.name);
      });
      return Array.from(options.values());
    }, [id, preFilteredRows, departments]);

    // Render a multi-select box
    return (
      <Form.Select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {departments.map((d) => (
          <option key={d.id} value={d.name}>
            {d.name}
          </option>
        ))}
      </Form.Select>
    );
  }

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
  } = useTable<SerializedUserDto>(
    tableProps,
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy
  );

  return (
    <Table striped bordered hover {...getTableProps()} size={'sm'}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
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
