import dayjs from 'dayjs';
import { Client, Guild, GuildMember, Intents, TextChannel } from 'discord.js';
import apiClient from './apiClient';
import { DATE_FORMAT } from './const';
import { DepartmentDto } from './dto/DepartmentDto';
import { UserDto } from './dto/UserDto';

export default class Bot {
  private static readonly LOG_CHANNEL_ID = '982282250014056568';
  private readonly client: Client<boolean>;
  private readonly logChannel: TextChannel;
  private readonly guild: Guild;

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
    return new Bot(client, logChannel, guild);
  }

  private constructor(
    client: Client<boolean>,
    logChannel: TextChannel,
    guild: Guild
  ) {
    this.client = client;
    this.logChannel = logChannel;
    this.guild = guild;
  }

  public async run() {
    this.log('SSW-HR Bot has lanched!');

    this.client.on('guildMemberAdd', async (member) => {
      this.log(`A member joined: ${member.displayName}`);
      const departments = await this.getDepartments();
      if (departments instanceof Error) return;
      const user = this.userMapper(member, departments);
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
      const departments = await this.getDepartments();
      if (departments instanceof Error) return;
      const user = this.userMapper(newMember, departments);
      apiClient.patch(`/users/${newMember.id}`, user).catch((e) => this.log(e));
    });

    await this.sync();
  }

  private userMapper(member: GuildMember, departments: DepartmentDto[]) {
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
  }

  private log(msg: string) {
    console.log(msg);
    this.logChannel.send(msg);
  }

  private async getDepartments() {
    try {
      const departments: DepartmentDto[] = await (
        await apiClient.get(`/departments`)
      ).data;
      return departments;
    } catch (error) {
      const msg = `Failed to get departments data, url=${apiClient.getUri()}`;
      this.log(msg);
      return new Error(msg);
    }
  }

  private async sync() {
    this.log('Starting sync');

    const storedUsers: UserDto[] = (await apiClient.get('/users')).data;
    const departments = await this.getDepartments();
    if (departments instanceof Error) return;
    const currentUsers = [...(await this.guild.members.fetch()).values()].map(
      (member) => this.userMapper(member, departments)
    );
    const currentUserIds = new Set(
      currentUsers
        .map((user) => user.id)
        .filter((id) => id !== undefined) as string[]
    );
    const storedAliveUserIds = storedUsers
      .filter(
        (user) =>
          user.left_at === undefined ||
          user.left_at === null ||
          dayjs(user.joined_at).isAfter(user.left_at)
      )
      .map((user) => user.id)
      .filter((id) => id !== undefined) as string[];

    const leftUsersIds = storedAliveUserIds.filter(
      (id) => !currentUserIds.has(id)
    );

    this.log('Updating left users ' + leftUsersIds.length);

    for await (const id of leftUsersIds) {
      await apiClient
        .patch(`/users/${id}`, {
          left_at: dayjs().format(DATE_FORMAT),
        })
        .catch((e) => this.log(e));
    }

    this.log('Updating all users');
    for await (const user of currentUsers) {
      await apiClient
        .patch(`/users/${user.id}`, user)
        .catch((e) => this.log(e));
    }

    this.log('Sync finished');
  }
}
