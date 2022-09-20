import { useState, useEffect, useCallback } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import client from '../../util/client';
import { UserDto } from '../../dto/UserDto';
import { OrganisationDto } from '../../dto/OrganisationDto';
import Card from './Card';
import { Box, CircularProgress } from '@mui/material';

type OrgRender = (org: OrganisationDto, level: number) => JSX.Element;

export default function OrgChart() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [org, setOrg] = useState<OrganisationDto>();

  useEffect(() => {
    client.get<UserDto[]>('/users').then((res) => setUsers(res.data));
    client
      .get<OrganisationDto>('/organizations')
      .then((res) => setOrg(res.data));
  }, []);

  const getUserById = useCallback(
    (id: string) => {
      const res = users.find((u) => u.id === id);
      console.log(id, res);
      return res;
    },
    [users]
  );

  const renderOrg = useCallback(
    (org: OrganisationDto, level: number, renderOrgChildren: OrgRender) => {
      const boss = getUserById(org.boss.user_id);
      const BossCard = (
        <Card
          rolename={org.boss.role_name}
          user={{
            name: boss?.username ?? '不明',
            img: boss?.icon_url,
          }}
          horizontal={true} // 上司の場合は部下が多いので横表示
        />
      );
      return level === 0 ? (
        <Tree label={BossCard} lineWidth="2px" lineBorderRadius={'10px'}>
          {renderOrgChildren(org, level + 1)}
        </Tree>
      ) : (
        <TreeNode label={BossCard}>
          {renderOrgChildren(org, level + 1)}
        </TreeNode>
      );
    },
    [getUserById]
  );

  const renderOrgChildren = useCallback(
    (org: OrganisationDto, level: number) => (
      <>
        {org.member.user_ids.map((id) => {
          const user = getUserById(id);
          return (
            <TreeNode
              key={id}
              label={
                <Card
                  rolename={org.member.role_name}
                  user={{ name: user?.username ?? '不明', img: user?.icon_url }}
                  horizontal={level < 1}
                />
              }
            />
          );
        })}
        {org.subsets.map((so) => renderOrg(so, level, renderOrgChildren))}
      </>
    ),
    [getUserById, renderOrg]
  );

  if (org === undefined || users == undefined) return <CircularProgress />;
  return (
    <Box mt="2rem" overflow="scroll" minHeight="90vh">
      {renderOrg(org, 0, renderOrgChildren)}
    </Box>
  );
}
