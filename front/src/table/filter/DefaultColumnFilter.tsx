import Form from 'react-bootstrap/esm/Form';
import React from 'react';
import { SerializedUserDto } from '../../dto/SerializedUserDto';
import { FilterProps } from 'react-table';

export default function DefaultColumnFilter({
  column: { filterValue, setFilter },
}: FilterProps<SerializedUserDto>): JSX.Element {
  return (
    <Form.Control
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}
