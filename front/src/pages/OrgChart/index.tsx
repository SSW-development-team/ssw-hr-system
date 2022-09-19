import { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import client from '../../util/client';
import { DepartmentDto } from '../../dto/DepartmentDto';
import { UserDto } from '../../dto/UserDto';

export default function OrgChart() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    client.get('/users').then((res) => setUsers(res.data));
    client.get('/departments').then((res) => setDepartments(res.data));
  }, []);
  return (
    <Tree label={<div>Root</div>} lineWidth="2px" lineBorderRadius={'10px'}>
      <TreeNode label={<div>Child 1</div>}>
        <TreeNode label={<div>Grand Child</div>} />
        <TreeNode label={<div>Grand Child</div>} />
        <TreeNode label={<div>Grand Child</div>} />
      </TreeNode>
    </Tree>
  );
}
