import {
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    (async () => {
      const [res1, res2] = await Promise.all([
        client.get<DepartmentDto[]>('/departments'),
        client.get<OrganisationDto[]>('/organizations?type=list'),
      ]);
      setRoles(res1.data);
      setOrgs(res2.data);
      setIsWaiting(false);
    })();
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = () => {
    setIsWaiting(true);
    client.post('/organizations', formData).then(() => setIsWaiting(false));
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Stack spacing={2}>
        <Typography variant="h3">組織の追加</Typography>
        <TextField
          label="名前"
          value={formData.name}
          name="name"
          onChange={handleChange}
        />
        <TextField
          label="上位組織"
          select
          value={formData.super_org_id}
          name="super_org_id"
          onChange={handleChange}
        >
          {renderItems(orgs)}
        </TextField>
        <TextField
          label="上司ロール"
          select
          value={formData.boss_role_id}
          name="boss_role_id"
          onChange={handleChange}
        >
          {renderItems(roles)}
        </TextField>
        <TextField
          label="メンバーロール"
          select
          value={formData.member_role_id}
          name="member_role_id"
          onChange={handleChange}
        >
          {renderItems(roles)}
        </TextField>
        <Button variant="contained" onClick={submit}>
          {isWaiting ? <CircularProgress color="secondary" /> : '送信'}
        </Button>
      </Stack>
    </Container>
  );
}
