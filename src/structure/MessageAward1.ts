import { Message } from "discord.js";
import { Settings } from "./Settings";
import crypto from "crypto";
import { Player } from "./Player";
import { DateTime } from "luxon";

export class MessageAward1 {

  static hash(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
  }

  static handleMessage(msg: Message) {

    const guild = msg.guild;

    if (!guild || msg.author.bot) return;

    const settings = Settings.fromGuild(guild);
    const msgAward = settings.messageAward1;

    if (msg.content.length < msgAward.length) return;

    const player = Player.fromUser(msg.author);
    const msgHash = this.hash(msg.content);

    if (player.last3messages.includes(msgHash)) return;

    player.messageCount++;

    const lastMessage = DateTime.fromJSDate(player.lastMessageDate);

    if (Math.abs(lastMessage.diffNow(["days"]).days) > 0) {
      player.messageDayStreak++;
      player.lastMessageDate = new Date();
    }

    player.last3messages.push(msgHash);

    if (player.last3messages.length > 3) {
      player.last3messages.shift();
    }

    if (
      player.messageDayStreak >= msgAward.days && 
      player.messageCount >= msgAward.count &&
      msg.member?.roles.cache.has(msgAward.role.id)
    ) {

      player.messageDayStreak = 0;
      player.messageCount = 0;

      msg.member?.roles.add(msgAward.role);
      msg.channel.send(`${msg.member} has received ${msgAward.role} role!`);
    }

    player.save();

  }
}
