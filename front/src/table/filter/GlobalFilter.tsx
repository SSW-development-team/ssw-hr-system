import { Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import {
  useAsyncDebounce,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from 'react-table';

export default function GlobalFilter<D extends Record<string, any>>({
  setGlobalFilter,
}: Pick<UseGlobalFiltersInstanceProps<D>, 'setGlobalFilter'> &
  UseGlobalFiltersState<D>) {
  const [value, setValue] = useState(false);
  const onChange = (value: boolean) => {
    setValue(value ?? false);
    setGlobalFilter(value);
  };

  return (
    <Form.Check
      id="reEnroll"
      checked={value}
      label="再加入者のみ表示"
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}
