import { Tree, TreeNode } from 'react-organizational-chart';

export default function OrgChart() {
  return (
    <Tree label={<div>Root</div>}>
      <TreeNode label={<div>Child 1</div>}>
        <TreeNode label={<div>Grand Child</div>} />
      </TreeNode>
    </Tree>
  );
}
