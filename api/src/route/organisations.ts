import express from 'express';
import { AppDataSource } from '../data-source';
import Organisation from '../model/Organisation';

const organisationsRouter = express.Router();

organisationsRouter.get('/organizations', async (_, res) => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const orgs = await AppDataSource.manager.find(Organisation, {
    where: { super: undefined }, // トップレベル組織のみ取得する
  });
  console.log(orgs);
  res.status(200).send(orgs);
});

export default organisationsRouter;
