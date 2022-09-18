import express from 'express';
import { AppDataSource } from '../data-source';
import { UserDto } from '../dto/UserDto';
import Department from '../model/Department';
import User from '../model/User';

const router = express.Router();

router.get('/users', async (req, res) => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  res.status(200).send(await AppDataSource.manager.find(User));
});

router.get('/users/:id', async (req, res) => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
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
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
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
    res.status(400).send({ code: 500, message: 'Internal server error' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    res
      .status(200)
      .send(
        await AppDataSource.manager.save(
          User,
          userMap(req.body, new User(req.params.id))
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, message: 'Internal server error' });
  }
});

function userMap(req: UserDto, user: User) {
  //idはマッピング対象外
  user.displayName = req.username;
  user.username = req.displayName;
  user.joined_at = req.joined_at;
  user.left_at = req.left_at;
  user.comment = req.comment;
  user.check1 = req.check1;
  if (req.departments)
    user.departments = req.departments.map((d) => new Department(d));
  return user;
}

export default router;
