import React, { useEffect, useState } from 'react';
import {
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from 'react-table';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';

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
    <Grid container spacing={2}>
      <Grid xs={6}>
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
      </Grid>
      <Grid xs={6}>
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
      </Grid>
    </Grid>
  );
}

export type GlobalFilterValue = {
  reEnroll: boolean;
  isExist: boolean;
};
