import dayjs from 'dayjs';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import Department from './Department';

@Entity('users')
export default class User {
  @PrimaryColumn({
    length: 18,
  })
  id: string;

  @Column()
  displayName?: string;
  @Column()
  username?: string;

  @Column('date')
  joined_at?: string;

  @Column('date', { nullable: true })
  left_at?: string;

  @Column({ default: '' })
  comment?: string;

  @ManyToMany(() => Department, { eager: true })
  @JoinTable()
  departments?: Department[];

  constructor(id: string) {
    this.id = id;
  }

  public isAlive() {
    return (
      this.left_at == undefined ||
      dayjs(this.joined_at).isAfter(dayjs(this.left_at))
    );
  }
}
