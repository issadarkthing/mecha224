import { Message } from "discord.js";
import { client } from "../index";
import { Player } from "./Player";

export class Spawn {

  static handleCatch(msg: Message) {

    if (!msg.mentions.has(client.user!)) return;

    if (!msg.content.includes("catch")) return;

    if (!client.spawn.isSpawned) return;

    const player = Player.fromUser(msg.author);
    const loot = client.spawn.loot;

    player.coins += loot;
    client.spawn.isSpawned = false;

    player.save();

    msg.channel.send(`${msg.member} successfully claimed **${loot}** coins!`)
  }
}
