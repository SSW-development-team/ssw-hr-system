import express from 'express';
import { dataSource } from '../app';
import Department from '../model/Department';

const departmentsRouter = express.Router();

departmentsRouter.get('/departments', async (req, res) => {
  if (!dataSource.isInitialized) await dataSource.initialize();
  res.status(200).send(await dataSource.manager.find(Department));
});

export default departmentsRouter;
