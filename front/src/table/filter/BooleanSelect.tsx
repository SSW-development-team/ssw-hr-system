// This is a custom filter UI for selecting

import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';

// a unique option from a list
export default function BooleanSelect({
  column: { filterValue, setFilter },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => ['true', 'false'], []);

  // Render a multi-select box
  return (
    <Form.Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className="px-0"
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
