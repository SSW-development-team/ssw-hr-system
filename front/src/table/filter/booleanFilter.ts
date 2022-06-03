export const booleanFilter = (rows: any, id: any, filterValue: string) => {
  return rows.filter((row: any) => {
    const rowValue: boolean = row.values[id];
    if (rowValue === undefined) return true;
    return rowValue.toString() == filterValue;
  });
};
