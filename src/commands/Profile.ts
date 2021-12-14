import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "profile";
  description = "show user profile";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author);

    msg.channel.send({ embeds: [player.show()] });
  }
}
