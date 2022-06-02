import dayjs from 'dayjs';
import { Client, Intents } from 'discord.js';
import { AppDataSource } from '../app';
import { DATE_FORMAT } from '../const';
import Department from '../model/Department';
import User from '../model/User';

export default class DiscordService {
  public async updateUsers() {
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
      return new Error('the guild was not found');
    }
    const departments = await AppDataSource.manager.find(Department);
    const latestUsers = await guild.members.fetch();
    const users = await AppDataSource.manager.find(User);
    const latestUserIds = latestUsers.map((u) => u.id);
    // サーバーを最近脱退したメンバーに脱退日を設定
    const leftUsers = users
      .filter((user) => user.isAlive() && !latestUserIds.includes(user.id))
      .map((user) => {
        user.left_at = dayjs().format(DATE_FORMAT);
        return user;
      });
    // 既存・新規メンバーの情報を更新
    const updatedUsers = latestUsers.map((m) => {
      const user = users.find((user) => user.id == m.id) ?? new User(m.id);
      user.username = m.user.username;
      user.displayName = m.displayName;
      if (m.joinedAt) user.joined_at = dayjs(m.joinedAt).format(DATE_FORMAT);
      const roleIds = new Set(m.roles.cache.mapValues((r) => r.id).keys());
      user.departments = departments.filter((d) => roleIds.has(d.id));
      return user;
    });
    await AppDataSource.manager.save(User, leftUsers);
    await AppDataSource.manager.save(User, updatedUsers);
    return updatedUsers;
  }
}
