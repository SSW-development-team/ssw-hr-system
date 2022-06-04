import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { CellProps, Renderer } from 'react-table';
import { SerializedUserDto } from '../dto/SerializedUserDto';

// Create an editable cell renderer
export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: any) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Form.Control
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="form-control-plaintext"
    />
  );
};
