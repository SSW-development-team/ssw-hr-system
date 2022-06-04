export const textWithoutBotFillter = (
  rows: any,
  id: any,
  filterValue: string
) => {
  return rows.filter((row: any) => {
    const rowValue: string = row.values[id];
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
