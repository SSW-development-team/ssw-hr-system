export type UserDto = {
  id?: string;
  username?: string;
  displayName?: string;
  joined_at?: string;
  left_at?: string | null;
  comment?: string;
  departments?: string[];
  check1?: boolean;
};
