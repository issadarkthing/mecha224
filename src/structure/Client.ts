import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";
import Enmap from "enmap";

interface Spawn {
  loot: number;
  isSpawned: boolean;
}

export class Client extends DiscordClient {
  settings = new Enmap("settings");
  players = new Enmap("player");
  commandManager = new CommandManager(process.env.PREFIX || "!");
  spawn: Spawn = { isSpawned: false, loot: 0 };
}
