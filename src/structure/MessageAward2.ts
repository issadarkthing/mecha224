import { Message } from "discord.js";
import { DateTime } from "luxon";
import { Settings } from "./Settings";

export class MessageAward2 {

  static handleMessage(msg: Message) {

    const { guild } = msg;

    if (!guild || msg.author.bot) return;

    const settings = Settings.fromGuild(guild);
    const messageAward2 = settings.messageAward2;

    if (msg.channel.id !== messageAward2.channel.id) return;


    const now = DateTime.now();
    const { day, month, year } = now;
    const startTime = DateTime
      .fromJSDate(messageAward2.startTime)
      .set({ day, month, year });

    const endTime = DateTime
      .fromJSDate(messageAward2.endTime)
      .set({ day, month, year });

    if (!(now >= startTime && now < endTime)) return;

    const member = msg.member;
    const awardRole = messageAward2.role;

    if (member && !member.roles.cache.has(awardRole.id)) {
      member.roles.add(awardRole);
      msg.channel.send(`${member} received ${awardRole}!`);
    }

  }
}
