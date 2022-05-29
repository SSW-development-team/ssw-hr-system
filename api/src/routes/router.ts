import dayjs from 'dayjs';
import express from 'express';
import { AppDataSource } from '../app';
import { UserDto } from '../dto/UserDTO';
import Department from '../model/Department';
import User from '../model/User';

const router = express.Router();

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

router.get('/test', async (req, res) => {
  const user = new User();
  user.id = '123456789012345678';
  user.name = 'Me and Bears2';
  user.joined_at = dayjs().format('YYYY-MM-DD');
  const department = new Department();
  department.id = '123456789012345678';
  department.name = 'シナリオ部門';
  user.departments = [department];
  await AppDataSource.manager.save(department);
  await AppDataSource.manager.save(user);
  res
    .status(200)
    .send({ message: `Photo has been saved. User id is ${user.id}` });
});

router.get('/users', async (req, res) => {
  res.status(200).send(await AppDataSource.manager.find(User));
});

router.get('/users/:id', async (req, res) => {
  res
    .status(200)
    .send(await AppDataSource.manager.findOneBy(User, { id: req.params.id }));
});

router.post('/users', async (req, res) => {
  const user = new User();
  const { id, name, joined_at, left_at, comment, departments } =
    req.body as UserDto;
  user.id = id;
  user.name = name;
  user.joined_at = joined_at;
  user.left_at = left_at;
  user.comment = comment;
  user.departments = departments.map((d) => {
    const department = new Department();
    department.id = d;
    return department;
  });
  res.status(200).send(await AppDataSource.manager.save(User, user));
});

export default router;
