import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { CellProps } from 'react-table';
import { SerializedUserDto } from '../../../dto/SerializedUserDto';

// Create an editable cell renderer
export const CheckboxCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: CellProps<SerializedUserDto>): JSX.Element => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    setValue(e.target.checked);
    updateMyData(index, id, e.target.checked);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <Checkbox checked={value} onChange={onChange} />;
};
