import { DepartmentDto } from './DepartmentDto';
import { UserDtoBase } from './UserDtoBase';

export interface UserDto extends UserDtoBase {
  departments?: DepartmentDto[];
}
