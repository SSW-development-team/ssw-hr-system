import { FilterType } from 'react-table';
import { SerializedUserDto } from '../../../../dto/SerializedUserDto';

export const textWithoutBotFillter: FilterType<SerializedUserDto> = (
  rows,
  columnIds,
  filterValue
) => {
  return rows.filter((row) => {
    const rowValue = row.values[columnIds[0]];
    if (rowValue === undefined) return true;
    if (filterValue == '*') return !inIngnoreDepartment(rowValue);
    if (IGNORE_DEPARTMENTS.includes(filterValue))
      return rowValue.includes(filterValue);
    return !inIngnoreDepartment(rowValue) && rowValue.includes(filterValue);
  });
};

const IGNORE_DEPARTMENTS = ['BOT', '亡命政府'];

const inIngnoreDepartment = (department: string) => {
  const ans = IGNORE_DEPARTMENTS.some((d) => {
    return department.includes(d);
  });
  return ans;
};
