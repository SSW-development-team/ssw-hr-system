import Form from 'react-bootstrap/esm/Form';
import React from 'react';

export default function DefaultColumnFilter({
  column: { filterValue, setFilter },
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
