export const textFilter = (rows: any, id: any, filterValue: any) => {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      : true;
  });
};
