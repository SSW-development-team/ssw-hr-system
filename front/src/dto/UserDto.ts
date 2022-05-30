import { DepartmentDto } from './DepartmentDto';

export type UserDto = {
  id?: string;
  name?: string;
  joined_at?: string;
  left_at?: string;
  comment?: string;
  departments?: DepartmentDto[];
};
