export const textWithoutBotFillter = (
  rows: any,
  id: any,
  filterValue: string
) => {
  return rows.filter((row: any) => {
    let rowValue: string = row.values[id];
    if (rowValue === undefined) return true;
    rowValue = String(rowValue).toLowerCase();
    const ignore_departments = IGNORE_DEPARTMENTS.map((d) => d.toLowerCase());
    if (filterValue == '*') return !ignore_departments.includes(rowValue);
    if (IGNORE_DEPARTMENTS.includes(filterValue))
      return rowValue.includes(String(filterValue).toLowerCase());
    return (
      !ignore_departments.includes(rowValue) &&
      rowValue.includes(String(filterValue).toLowerCase())
    );
  });
};

const IGNORE_DEPARTMENTS = ['BOT', '亡命政府'];
