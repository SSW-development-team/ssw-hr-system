import express from 'express';
import { AppDataSource } from '../app';
import { UserDto } from '../dto/UserDto';
import Department from '../model/Department';
import User from '../model/User';
import DiscordService from '../service/DiscordService';

const router = express.Router();

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

router.get('/users', async (req, res) => {
  const result = await new DiscordService().updateUsers();
  if (result instanceof Error) {
    res.status(500).send({ message: result.message });
    return;
  }
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
  user.displayName = req.username;
  user.username = req.displayName;
  user.joined_at = req.joined_at;
  user.left_at = req.left_at;
  user.comment = req.comment;
  user.check1 = user.check1;
  if (req.departments)
    user.departments = req.departments.map((d) => new Department(d));
  return user;
}

export default router;
