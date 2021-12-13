import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Prompt } from "../structure/Prompt";
import { Settings } from "../structure/Settings";
import { TextBasedChannels } from "discord.js";

export default class extends Command {
  name = "settings";
  description = "change bot settings";

  async exec(msg: Message, args: string[]) {

    const isAdmin = msg.member?.permissions.has("ADMINISTRATOR");

    if (!isAdmin) {
      throw new Error("only admin can use this command");
    }

    const arg1 = args[0];

    if (arg1 === "show") {

      const settings = Settings.fromGuild(msg.guild!);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField("Server", settings.guild.name)
        .addField("Spam Channels", settings.spamChannels.join(", "))
        .addField("Gambling Channels", settings.gamblingChannels.join(", "))
        .addField("Duel Channels", settings.duelChannels.join(", "))

      msg.channel.send({ embeds: [embed] });

      return;
    }

    const prompt = new Prompt(msg);

    let collect = await prompt.collect("Please mention gambling channel(s)");
    const gambling = [...collect.mentions.channels.values()] as TextBasedChannels[];

    collect = await prompt.collect("Please mention spam channel(s)");
    const spam = [...collect.mentions.channels.values()] as TextBasedChannels[];

    collect = await prompt.collect("Please mention duel channel(s)");
    const duel = [...collect.mentions.channels.values()] as TextBasedChannels[];

    const settings = new Settings({
      guild: msg.guild!,
      spamChannels: spam,
      gamblingChannels: gambling,
      duelChannels: duel,
    });

    settings.save();
    msg.channel.send("Settings saved");
  }
}
