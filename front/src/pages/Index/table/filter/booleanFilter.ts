import { FilterType } from 'react-table';
import { SerializedUserDto } from '../../../../dto/SerializedUserDto';

export const booleanFilter: FilterType<SerializedUserDto> = (
  rows,
  id,
  filterValue
) => {
  return rows.filter((row) => {
    const rowValue: boolean = row.values[id[0]];
    if (rowValue === undefined) return true;
    return rowValue.toString().includes(filterValue);
  });
};
