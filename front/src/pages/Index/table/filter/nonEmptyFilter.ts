import { FilterType } from 'react-table';
import { SerializedUserDto } from '../../../../dto/SerializedUserDto';

export const emptyFilter: FilterType<SerializedUserDto> = (
  rows,
  columnIds,
  filterValue
) => {
  return rows.filter((row) => {
    const rowValue = row.values[columnIds[0]];
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      : true;
  });
};
