import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('departments')
export default class Department {
  @PrimaryColumn({
    length: 18,
  })
  id: string;

  @Column()
  name?: string;

  constructor(id: string) {
    this.id = id;
  }
}
