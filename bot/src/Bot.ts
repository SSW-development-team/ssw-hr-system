import axios from 'axios';
import dayjs from 'dayjs';
import { Client, GuildMember, Intents, TextChannel } from 'discord.js';
import apiClient from './apiClient';
import { DATE_FORMAT } from './const';
import { DepartmentDto } from './dto/DepartmentDto';
import { UserDto } from './dto/UserDto';

export default class Bot {
  private static readonly LOG_CHANNEL_ID = '982282250014056568';
  private readonly client: Client<boolean>;
  private readonly logChannel: TextChannel;

  public static async create() {
    const { CLIENT_ID, CLIENT_SECRET, GUILD_ID } = process.env;
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
    await new Promise<void>((resolve) => {
      client.once('ready', () => resolve());
    });
    const guild = await client.guilds.fetch(GUILD_ID);
    if (guild == null) {
      return new Error('the guild was not found');
    }
    const logChannel = guild.channels.cache.get(
      Bot.LOG_CHANNEL_ID
    ) as TextChannel;
    return new Bot(client, logChannel);
  }

  private constructor(client: Client<boolean>, logChannel: TextChannel) {
    this.client = client;
    this.logChannel = logChannel;
  }

  public run() {
    this.log('SSW-HR Bot has lanched!');

    this.client.on('guildMemberAdd', async (member) => {
      this.log(`A member joined: ${member.displayName}`);
      const user = await this.userMapper(member);
      if (user instanceof Error) return;
      apiClient.post('/users', user).catch((e) => this.log(e));
    });

    this.client.on('guildMemberRemove', (member) => {
      this.log(`A member left: ${member.displayName}`);
      apiClient
        .patch(`/users/${member.id}`, {
          left_at: dayjs().format(DATE_FORMAT),
        })
        .catch((e) => this.log(e));
    });

    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      this.log(`Member update: ${newMember.displayName}`);
      const user = await this.userMapper(newMember);
      if (user instanceof Error) return;
      apiClient.patch(`/users/${newMember.id}`, user).catch((e) => this.log(e));
    });
  }

  private async userMapper(member: GuildMember) {
    try {
      const departments: DepartmentDto[] = await (
        await apiClient.get(`/departments`)
      ).data;
      const user: UserDto = {
        id: member.id,
        username: member.user.username,
        displayName: member.displayName,
        joined_at: dayjs(member.joinedAt).format(DATE_FORMAT),
        departments: departments
          .map((d) => d.id)
          .filter((d) => member.roles.cache.has(d)),
      };
      return user;
    } catch (error) {
      const msg = 'Failed to get departments data';
      this.log(msg);
      return new Error(msg);
    }
  }

  private log(msg: string) {
    console.log(msg);
    this.logChannel.send(msg);
  }
}
