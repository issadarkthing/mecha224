import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { random } from "../utils";
import { Settings } from "../structure/Settings";

export default class extends Command {
  name = "work";
  description = "earn coin";
  throttle = 5 * 1000;
  min = 10;
  max = 200;

  async exec(msg: Message) {

    const settings = Settings.fromGuild(msg.guild!);

    if (!settings.spamChannels.some(x => x.id === msg.channel.id)) {
      throw new Error(`Please use ${settings.spamChannels.join(", ")}`);
    }

    const earn = random.integer(this.min, this.max);
    const player = Player.fromUser(msg.author);

    player.coins += earn;
    player.save();

    msg.channel.send(`You earned **${earn}** coins!`);
  }
}
