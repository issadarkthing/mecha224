import { Guild, GuildChannelManager, TextBasedChannels } from "discord.js";
import { client } from "../index";

interface Options {
  guild: Guild;
  spamChannels: TextBasedChannels[];
  gamblingChannels: TextBasedChannels[];
  duelChannels: TextBasedChannels[];
}

export class Settings {
  readonly guild: Guild;
  spamChannels: TextBasedChannels[];
  gamblingChannels: TextBasedChannels[];
  duelChannels: TextBasedChannels[];

  constructor(opts: Options) {
    this.guild = opts.guild;
    this.spamChannels = opts.spamChannels;
    this.gamblingChannels = opts.gamblingChannels;
    this.duelChannels = opts.duelChannels;
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
    const gamblingChannels = this.getChannels(data.gamblingChannels, guild.channels);
    const duelChannels = this.getChannels(data.duelChannels, guild.channels);

    return new Settings({
      guild,
      duelChannels,
      gamblingChannels,
      spamChannels,
    });
  }

  save() {

    const guildID = this.guild.id;
    const spamChannels = this.spamChannels.map(x => x.id);
    const gamblingChannels = this.gamblingChannels.map(x => x.id);
    const duelChannels = this.duelChannels.map(x => x.id);

    client.settings.set(this.guild.id, {
      guildID,
      spamChannels,
      gamblingChannels,
      duelChannels,
    });
  }
}
