import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import Department from './Department';

@Entity()
export default class User {
  @PrimaryColumn({
    length: 18,
  })
  id?: string;

  @Column()
  name?: string;

  @Column('date')
  joined_at?: string;

  @Column('date', { nullable: true })
  left_at?: string;

  @Column({ default: '' })
  comment?: string;

  @ManyToMany(() => Department)
  @JoinTable()
  departments?: Department[];
}
