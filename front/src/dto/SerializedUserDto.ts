import { UserDtoBase } from './UserDtoBase';

export interface SerializedUserDto extends UserDtoBase {
  departments?: string;
}
