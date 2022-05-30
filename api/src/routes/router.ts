import dayjs from 'dayjs';
import express from 'express';
import { AppDataSource } from '../app';
import { UserDto } from '../dto/UserDto';
import ErrorResponse from '../ErrorResponse';
import Department from '../model/Department';
import User from '../model/User';

const router = express.Router();

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

router.get('/test', async (req, res) => {
  const user = new User('123456789012345678');
  user.name = 'Me and Bears2';
  user.joined_at = dayjs().format('YYYY-MM-DD');
  const department = new Department('123456789012345678');
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
  const user = await AppDataSource.manager.findOneBy(User, {
    id: req.params.id,
  });
  if (user == null) {
    res.status(404).send({ code: 404, message: 'User not found' });
    return;
  }
  res.status(200).send(user);
});

router.post('/users', async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await AppDataSource.manager.save(
          User,
          userMap(req.body, new User(req.body.id))
        )
      );
  } catch (error) {
    console.error(error);
    res.status(400).send({ code: 404, message: 'Bad request' });
  }
});

router.patch('/users/:id', async (req, res) => {
  res
    .status(200)
    .send(
      await AppDataSource.manager.save(
        User,
        userMap(req.body, new User(req.params.id))
      )
    );
});

function userMap(req: UserDto, user: User) {
  //idはマッピング対象外
  user.name = req.name;
  user.joined_at = req.joined_at;
  user.left_at = req.left_at;
  user.comment = req.comment;
  if (req.departments)
    user.departments = req.departments.map((d) => new Department(d));
  return user;
}

export default router;
