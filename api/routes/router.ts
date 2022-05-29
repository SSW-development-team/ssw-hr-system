import express from 'express';
// import { AppDataSource } from '../app';
// import User from '../model/User';

const router = express.Router();

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

// router.get('/test', async (req, res) => {
//   const user = new User();
//   user.id = '123456789012345678';
//   user.name = 'Me and Bears';
//   // await AppDataSource.manager.save(user);
//   // res
//   //   .status(200)
//   //   .send({ message: `Photo has been saved. User id is ${user.id}` });
// });

export default router;
