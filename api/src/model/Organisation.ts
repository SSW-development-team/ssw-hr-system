import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Department from './Department';
@Entity()
export default class Organisation {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department)
  boss_role: Department;

  @ManyToOne(() => Department)
  member_role: Department;

  @ManyToOne(() => Organisation, (org) => org.subsets)
  super?: Organisation;

  @OneToMany(() => Organisation, (org) => org.super)
  subsets!: Organisation[];

  constructor(
    id: number,
    name: string,
    boss_role: Department,
    member_role: Department
  ) {
    this.id = id;
    this.name = name;
    this.boss_role = boss_role;
    this.member_role = member_role;
  }
}
