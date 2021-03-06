import { Client } from "./structure/Client";
import path from "path";
import { config } from "dotenv";
import { MessageAward2 } from "./structure/MessageAward2";
import { MessageAward1 } from "./structure/MessageAward1";
import { Spawn } from "./structure/Spawn";

config();

export const client = new Client({ 
  intents: [
    "GUILDS", 
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MEMBERS",
  ],
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "REACTION",
  ]
});


client.commandManager.verbose = true;
client.commandManager.registerCommands(path.resolve(__dirname, "./commands"));

client.commandManager.registerCommandNotFoundHandler((msg, cmdName) => {
  msg.channel.send(`Cannot find command "${cmdName}"`);
})

client.commandManager.registerCommandOnThrottleHandler((msg, cmd, timeLeft) => {
  const time = (timeLeft / 1000).toFixed(2);
  msg.channel.send(`You cannot run ${cmd.name} command after ${time} s`);
})

client.commandManager.registerCommandErrorHandler((err, msg) => {
  msg.channel.send((err as Error).message);
  console.log(err);
})

client.on("ready", () => console.log(client.user?.username, "is ready!"))
client.on("messageCreate", msg => client.commandManager.handleMessage(msg));
client.on("messageCreate", msg => MessageAward1.handleMessage(msg));
client.on("messageCreate", msg => MessageAward2.handleMessage(msg));
client.on("messageCreate", msg => Spawn.handleCatch(msg));

client.login(process.env.BOT_TOKEN);
