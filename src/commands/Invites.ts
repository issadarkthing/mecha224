import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";

export default class extends Command {
  name = "invites";
  disable = true;

  async exec(msg: Message) {

    if (!msg.guild) return;

    const invites = (await msg.guild.invites.fetch())
      .filter(x => x.guild?.id === msg.guild?.id)
      .filter(x => x.inviter?.id === msg.author.id)
      .reduce((acc, x) => acc + (x.uses || 0), 0)

    msg.channel.send(`You have total ${invites} invites!`);
  }
}
