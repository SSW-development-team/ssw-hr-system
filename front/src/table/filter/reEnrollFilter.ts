import dayjs from 'dayjs';
import { GlobalFilterType } from 'react-table';
import { SerializedUserDto } from '../../dto/SerializedUserDto';

export const reEnrollFilter: GlobalFilterType<SerializedUserDto> = (
  rows,
  columnIds,
  filterValue
) => {
  const isActive: true | undefined = filterValue;
  if (!isActive) return rows; // フィルタが無効になっていれば全ての行がOK
  return rows.filter((row) => {
    const joined_at = dayjs(row.original.joined_at);
    const left_at = dayjs(row.original.left_at);
    if (!left_at.isValid()) return false; // 退出日がない場合、再加入者ではないためfalse
    return joined_at.isAfter(left_at);
  });
};
