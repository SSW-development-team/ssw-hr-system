import express from 'express';
import { AppDataSource } from '../app';
import Department from '../model/Department';

const departmentsRouter = express.Router();

departmentsRouter.get('/departments', async (req, res) => {
  res.status(200).send(await AppDataSource.manager.find(Department));
});

export default departmentsRouter;
