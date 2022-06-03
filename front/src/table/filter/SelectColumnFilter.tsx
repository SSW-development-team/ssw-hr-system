// This is a custom filter UI for selecting

import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';

// a unique option from a list
export default function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row: any) => {
      String(row.values[id])
        .split(',')
        .forEach((o: string) => options.add(o));
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
