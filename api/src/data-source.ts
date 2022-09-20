import { DataSource } from 'typeorm';
import { addOrg1663509124858 } from './migration/1663509124858-add-org';
import { changeOrgId1663510747117 } from './migration/1663510747117-change-org-id';
import { orgTree1663515249193 } from './migration/1663515249193-org-tree';
import { addIcon1663673387454 } from './migration/1663673387454-add-icon';
import Department from './model/Department';
import Organisation from './model/Organisation';
import User from './model/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'ssw_hr',
  entities: [User, Department, Organisation],
  synchronize: true,
  logging: false,
  migrations: [
    addOrg1663509124858,
    changeOrgId1663510747117,
    orgTree1663515249193,
    addIcon1663673387454,
  ],
});
