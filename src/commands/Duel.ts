import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { random } from "../utils";
import { Settings } from "../structure/Settings";
import { Prompt } from "../structure/Prompt";

export default class extends Command {
  name = "duel";
  description = "duel with another person";

  async exec(msg: Message) {

    const settings = Settings.fromGuild(msg.guild!);

    if (!settings.duelChannels.some(x => msg.channel.id === x.id)) {
      throw new Error(`Please use ${settings.duelChannels.join(", ")}`)
    }

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("Please mention a user");

    } else if (mentionedUser.id === msg.author.id) {
      throw new Error("You cannot duel with yourself");

    }

    const prompt = new Prompt(msg, 
      { filter: msg => msg.author.id === mentionedUser.id }
    );

    const opponentInput = await prompt.ask(
      `${msg.author} has challenged you into a duel. Do you accept ${mentionedUser}? [y/n]`
    );

    if (opponentInput !== "y") {
      throw new Error("Opponent rejected the duel");
    }

    const player = Player.fromUser(msg.author);
    const opponent = Player.fromUser(mentionedUser);

    const [winner, loser] = random.shuffle([player, opponent]);

    const coins = Math.round(loser.coins * 0.2);

    winner.coins += coins;
    loser.coins -= coins;

    winner.save();
    loser.save();

    msg.channel.send(`**${winner.name}** won!`);
    msg.channel.send(`**${winner.name}** takes ${coins} coins from **${loser.name}**!`);

  }
}
