import { Message } from "discord.js";
import { DateTime } from "luxon";
import { Settings } from "./Settings";

export class MessageAward2 {

  static handleMessage(msg: Message) {

    const { guild } = msg;

    if (!guild || msg.author.bot) return;

    const settings = Settings.fromGuild(guild);

    if (msg.channel.id !== settings.messageAward2.channel.id) return;

    const startTime = DateTime.fromJSDate(settings.messageAward2.startTime).hour;
    const endTime = DateTime.fromJSDate(settings.messageAward2.endTime).hour;
    const now = DateTime.now().hour;

    if (!(now >= startTime && now < endTime)) return;

    const member = msg.member;
    const awardRole = settings.messageAward2.role;

    if (member && !member.roles.cache.has(awardRole.id)) {
      member.roles.add(awardRole);
      msg.channel.send(`${member} received ${awardRole}!`);
    }

  }
}
