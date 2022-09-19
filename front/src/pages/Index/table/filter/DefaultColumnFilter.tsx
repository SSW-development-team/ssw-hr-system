import { SerializedUserDto } from '../../dto/SerializedUserDto';
import { FilterProps } from 'react-table';
import { TextField } from '@mui/material';

export default function DefaultColumnFilter({
  column: { filterValue, setFilter },
}: FilterProps<SerializedUserDto>): JSX.Element {
  return (
    <TextField
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      size="small"
      fullWidth
    />
  );
}
