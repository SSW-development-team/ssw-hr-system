import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Department from './Department';
import User from './User';
@Entity()
@Tree('nested-set')
export default class Organisation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Department)
  boss_role!: Department;

  @ManyToOne(() => Department)
  member_role!: Department;

  @TreeParent()
  super!: Organisation;

  @TreeChildren()
  subsets!: Organisation[];

  // カスタム属性
  boss = { role_name: '', user_id: undefined as string | undefined };
  member = { role_name: '', user_ids: [] as string[] };

  public sinkUser(user: User) {
    this.boss.role_name = this.boss_role.name ?? '';
    this.member.role_name = this.member_role.name ?? '';
    const roleIds = new Set(user.getDepartmentIds());
    if (roleIds.has(this.boss_role.id)) this.boss.user_id = user.id;
    if (roleIds.has(this.member_role.id)) this.member.user_ids.push(user.id);
    this.subsets.forEach((o) => o.sinkUser(user));
  }
}
