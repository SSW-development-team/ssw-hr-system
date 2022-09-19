import dayjs from 'dayjs';
import { GlobalFilterType } from 'react-table';
import { SerializedUserDto } from '../../dto/SerializedUserDto';
import { GlobalFilterValue } from './GlobalFilter';

export const reEnrollFilter: GlobalFilterType<SerializedUserDto> = (
  rows,
  columnIds,
  filterValue: GlobalFilterValue
) => {
  if (!(filterValue.isExist || filterValue.reEnroll)) return rows; // フィルタが無効になっていれば全ての行がOK
  return rows
    .filter((row) => {
      if (!filterValue.reEnroll) return true; // フィルタが無効になっていれば全ての行がOK
      const joined_at = dayjs(row.original.joined_at);
      const left_at = dayjs(row.original.left_at);
      if (!left_at.isValid()) return false; // 退出日がない場合、再加入者ではないためfalse
      return joined_at.isAfter(left_at);
    })
    .filter((row) => {
      if (!filterValue.isExist) return true; // フィルタが無効になっていれば全ての行がOK
      const joined_at = dayjs(row.original.joined_at);
      const left_at = dayjs(row.original.left_at);
      if (!left_at.isValid()) return true; // 退出日がない場合、在籍者であるためtrue
      return joined_at.isAfter(left_at);
    });
};
