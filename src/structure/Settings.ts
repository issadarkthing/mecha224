import { Guild, GuildChannelManager, Role, TextBasedChannels } from "discord.js";
import { client } from "../index";

// Roles given if X (ratio) days with Y quality and Z length/wathever keywords
// or smth else : no gm spammers, no copy pasters etc
interface MessageAward1 {
  role: Role;
  count: number; // minimum message count
  length: number; // minimum message length
  days: number; // minimum days length
}

// Role given if user post a certain message in a certain channel at a certain
// time of the day
interface MessageAward2 {
  role: Role;
  keyword: string;
  channel: TextBasedChannels;
  startTime: Date;
  endTime: Date;
}

interface Options {
  guild: Guild;
  spamChannels: TextBasedChannels[];
  gamblingChannels: TextBasedChannels[];
  duelChannels: TextBasedChannels[];
  messageAward1: MessageAward1;
  messageAward2: MessageAward2;
}


export class Settings {
  readonly guild: Guild;
  spamChannels: TextBasedChannels[];
  gamblingChannels: TextBasedChannels[];
  duelChannels: TextBasedChannels[];
  messageAward1: MessageAward1;
  messageAward2: MessageAward2;

  constructor(opts: Options) {
    this.guild = opts.guild;
    this.spamChannels = opts.spamChannels;
    this.gamblingChannels = opts.gamblingChannels;
    this.duelChannels = opts.duelChannels;
    this.messageAward1 = opts.messageAward1;
    this.messageAward2 = opts.messageAward2;
  }

  private static getChannels(
    ids: string[], 
    channels: GuildChannelManager,
  ): TextBasedChannels[] {

    const ch = channels.cache
      .filter(channel => ids.includes(channel.id))
      .filter(channel => channel.isText())
      .values();

    return [...ch] as TextBasedChannels[];
  }

  static fromGuild(guild: Guild) {

    const data = client.settings.get(guild.id);

    if (!data) {
      throw new Error("guild settings has not been configured");
    }

    const spamChannels = this.getChannels(data.spamChannels, guild.channels);
    if (spamChannels.length < 1) {
      throw new Error("no spam channel was chosen");
    }

    const gamblingChannels = this.getChannels(data.gamblingChannels, guild.channels);
    if (gamblingChannels.length < 1) {
      throw new Error("no gambling channel was chosen");
    }

    const duelChannels = this.getChannels(data.duelChannels, guild.channels);
    if (duelChannels.length < 1) {
      throw new Error("no duel channel was chosen");
    }

    const award2Channel = guild.channels.cache.get(data.messageAward2.channel);
    if (!award2Channel) {
      throw new Error("no Message Award 2 channel was chosen");
    }
    
    const msgAward1Role = guild.roles.cache.get(data.messageAward1.role);
    const msgAward2Role = guild.roles.cache.get(data.messageAward2.role);

    if (!msgAward1Role) {
      throw new Error(`${data.messageAward1.role} role is missing`);
    } else if (!msgAward2Role) {
      throw new Error(`${data.messageAward2.role} role is missing`);
    }

    return new Settings({
      guild,
      duelChannels,
      gamblingChannels,
      spamChannels,
      messageAward1: {
        ...data.messageAward1,
        role: msgAward1Role,
      },
      messageAward2: {
        ...data.messageAward2,
        role: msgAward2Role,
        channel: award2Channel,
      }
    });
  }

  save() {

    const guildID = this.guild.id;
    const spamChannels = this.spamChannels.map(x => x.id);
    const gamblingChannels = this.gamblingChannels.map(x => x.id);
    const duelChannels = this.duelChannels.map(x => x.id);
    const messageAward1 = { 
      ...this.messageAward1,
      role: this.messageAward1.role.id,
    };

    const messageAward2 = {
      ...this.messageAward2,
      role: this.messageAward2.role.id,
      channel: this.messageAward2.channel.id,
    }

    client.settings.set(this.guild.id, {
      guildID,
      spamChannels,
      gamblingChannels,
      duelChannels,
      messageAward1,
      messageAward2,
    });
  }
}
