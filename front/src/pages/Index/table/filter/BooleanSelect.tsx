// This is a custom filter UI for selecting

import { MenuItem, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { FilterProps } from 'react-table';
import { SerializedUserDto } from '../../dto/SerializedUserDto';

// a unique option from a list
export default function BooleanSelect({
  column: { filterValue, setFilter },
}: FilterProps<SerializedUserDto>): JSX.Element {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => ['true', 'false'], []);

  // Render a multi-select box
  return (
    <TextField
      select
      value={filterValue}
      onChange={(e) => setFilter(e.target.value || undefined)}
    >
      <MenuItem value="">全て</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
