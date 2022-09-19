import {
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { DepartmentDto } from '../dto/DepartmentDto';
import { OrganisationDto } from '../dto/OrganisationDto';
import client from '../util/client';

type Org = {
  name?: string;
  super_org_id?: string;
  boss_role_id?: string;
  member_role_id?: string;
};
export default function OrgCreate(): JSX.Element {
  const [formData, setFormData] = useState<Org>({});
  const [roles, setRoles] = useState<DepartmentDto[]>([]);
  const [orgs, setOrgs] = useState<OrganisationDto[]>([]);

  useEffect(() => {
    client
      .get<DepartmentDto[]>('/departments')
      .then((res) => setRoles(res.data));
    client
      .get<OrganisationDto[]>('/organizations?type=list')
      .then((res) => setOrgs(res.data));
  }, []);

  const renderItems = useCallback(
    (roles: DepartmentDto[] | OrganisationDto[]) =>
      roles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.name}
        </MenuItem>
      )),
    []
  );

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Stack spacing={2}>
        <Typography variant="h3">組織の追加</Typography>
        <TextField label="名前" />
        <TextField label="上位組織" select>
          {renderItems(orgs)}
        </TextField>
        <TextField label="上司ロール" select>
          {renderItems(roles)}
        </TextField>
        <TextField label="メンバーロール" select>
          {renderItems(roles)}
        </TextField>
      </Stack>
    </Container>
  );
}
