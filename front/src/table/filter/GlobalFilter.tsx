import React, { useEffect, useState } from 'react';
import {
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from 'react-table';
import { Checkbox, FormControlLabel } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GlobalFilter<D extends Record<string, any>>({
  setGlobalFilter,
}: Pick<UseGlobalFiltersInstanceProps<D>, 'setGlobalFilter'> &
  UseGlobalFiltersState<D>): JSX.Element {
  const [reEnroll, setReEnroll] = useState(false);
  const [isExist, setIsExist] = useState(true);

  useEffect(
    () =>
      setGlobalFilter({
        reEnroll,
        isExist,
      }),
    [reEnroll, isExist]
  );

  return (
    <div>
      <div>
        <div>
          <FormControlLabel
            id="reEnroll"
            label="再加入者のみ表示"
            control={
              <Checkbox
                checked={reEnroll}
                onChange={(e) => setReEnroll(e.target.checked)}
              />
            }
          />
        </div>
        <div>
          <FormControlLabel
            id="isExist"
            label="在籍者のみ表示"
            control={
              <Checkbox
                checked={isExist}
                onChange={(e) => setIsExist(e.target.checked)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

export type GlobalFilterValue = {
  reEnroll: boolean;
  isExist: boolean;
};
