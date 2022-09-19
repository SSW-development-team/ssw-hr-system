import express from 'express';
import { AppDataSource } from '../data-source';
import Organisation from '../model/Organisation';
import User from '../model/User';

const organisationsRouter = express.Router();

organisationsRouter.get('/organizations', async (_, res) => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const { manager } = AppDataSource;
  const orgs = await manager.getTreeRepository(Organisation).findTrees({
    relations: ['boss_role', 'member_role'],
  });
  const users = await manager.find(User);
  const root = orgs[0];
  users.forEach((u) => root.sinkUser(u));
  console.log(root);
  res.status(200).send(root);
});

export default organisationsRouter;
