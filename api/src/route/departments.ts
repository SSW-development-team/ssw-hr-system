import express from 'express';
import { AppDataSource } from '../data-source';
import Department from '../model/Department';

const departmentsRouter = express.Router();

departmentsRouter.get('/departments', async (req, res) => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  res.status(200).send(await AppDataSource.manager.find(Department));
});

export default departmentsRouter;
