import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export default class Department {
  @PrimaryColumn({
    length: 19,
  })
  id: string;

  @Column()
  name?: string;
  @Column({ default: true })
  hide: boolean;

  user_ids: string[] = [];

  constructor(id: string) {
    this.id = id;
    this.hide = true;
  }
}
