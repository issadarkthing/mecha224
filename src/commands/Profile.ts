import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "profile";
  description = "show user profile";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author);

    player.lastMessageDate = new Date(2000, 1);
    player.messageDayStreak = 0;
    player.messageCount = 0;
    player.last3messages = [];
    player.save();
    console.log(player);

    msg.channel.send({ embeds: [player.show()] });
  }
}
