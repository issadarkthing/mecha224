import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed, TextBasedChannels } from "discord.js";
import { random } from "../utils";
import { client } from "../index";

export default class extends Command {
  name = "spawn";
  description = "spawns the bot on random channel and earn coin from catching it";

  async exec(msg: Message) {

    if (!msg.member?.permissions.has("ADMINISTRATOR")) {
      throw new Error("only admin can use this command");
    }

    const guild = msg.guild;
    
    if (!guild) return;

    let channel = guild.channels.cache.random();

    while (!channel?.isText) {
      channel = guild.channels.cache.random();
    }

    const loot = random.integer(1000, 5000);

    client.spawn.loot = loot;
    client.spawn.isSpawned = true;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `**${loot}** coins spawned. Claim me by using \`@${client.user?.username} i catch you!\``
      );
      

    (channel as TextBasedChannels).send({ embeds: [embed] });
    msg.channel.send(`The bot spawned in ${channel}`);

  }
}
