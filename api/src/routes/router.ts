import { REST } from '@discordjs/rest';
import dayjs from 'dayjs';
import express from 'express';
import { AppDataSource } from '../app';
import { UserDto } from '../dto/UserDto';
import Department from '../model/Department';
import User from '../model/User';
import { Routes } from 'discord-api-types/v9';
import { Client, Intents } from 'discord.js';

const router = express.Router();

const DATE_FORMAT = 'YYYY-MM-DD';

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

router.get('/test', async (req, res) => {
  const user = new User('123456789012345678');
  user.name = 'Me and Bears2';
  user.joined_at = dayjs().format(DATE_FORMAT);
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

router.get('/test2', async (req, res) => {
  console.log(process.env.CLIENT_ID);
  const { CLIENT_ID, GUILD_ID, CLIENT_SECRET } = process.env;
  if (
    CLIENT_ID === undefined ||
    GUILD_ID === undefined ||
    CLIENT_SECRET == undefined
  )
    throw new Error('CLIENT_ID is undefined!');

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
  });
  await client.login(CLIENT_SECRET);
  await new Promise<void>((resolve, reject) => {
    client.once('ready', () => resolve());
  });
  const guild = client.guilds.cache.get(GUILD_ID);
  if (guild == null) {
    res.status(500).send({ message: 'the guild was not found' });
    return;
  }
  const departments = await AppDataSource.manager.find(Department);
  const latestUsers = await guild.members.fetch();
  const users = await AppDataSource.manager.find(User);
  const latestUserIds = latestUsers.map((u) => u.id);
  // サーバーを最近脱退したメンバーに脱退日を設定
  const leftUsers = users
    .filter((user) => user.isAlive() && !(user.id in latestUserIds))
    .map((user) => {
      user.left_at = dayjs().format(DATE_FORMAT);
      return user;
    });
  // 既存・新規メンバーの情報を更新
  const updatedUsers = latestUsers.map((m) => {
    const user = users.find((user) => user.id == m.id) ?? new User(m.id);
    user.name = m.displayName;
    if (m.joinedAt) user.joined_at = dayjs(m.joinedAt).format(DATE_FORMAT);
    user.departments = departments.filter((d) => d.id in m.roles.cache);
    return user;
  });
  await AppDataSource.manager.save(User, leftUsers);
  await AppDataSource.manager.save(User, updatedUsers);
  res.status(200).send({ users: updatedUsers });
  // TODO: set default encoding utf8mb4generalci
});

export default router;
