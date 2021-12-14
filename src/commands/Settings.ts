import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Prompt } from "../structure/Prompt";
import { Settings } from "../structure/Settings";
import { TextBasedChannels } from "discord.js";
import { oneLine, stripIndents } from "common-tags";
import { validateNumber } from "../utils";
import { DateTime } from "luxon";

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
      const startTime = DateTime.fromJSDate(settings.messageAward2.startTime);
      const endTime = DateTime.fromJSDate(settings.messageAward2.endTime);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(stripIndents`
        **Server:** ${settings.guild.name}
        **Spam Channels:** ${settings.spamChannels.join(", ")}
        **Gambling Channels:** ${settings.gamblingChannels.join(", ")}
        **Duel Channels:** ${settings.duelChannels.join(", ")}
         
        **Message Award 1**
        Role given if X (ratio) days with Y quality and Z length: 
        no gm spammers, no copy pasters etc
        Role: ${settings.messageAward1.role}
        Min Count: ${settings.messageAward1.count}
        Min Length: ${settings.messageAward1.length}
        Min Days: ${settings.messageAward1.days}

        **Message Award 2**
        Role given if user post a certain message in a certain channel at a
        certain time of the day
        Role: ${settings.messageAward2.role}
        Channel: ${settings.messageAward2.channel}
        Keyword: ${settings.messageAward2.keyword}
        Start Time: ${startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
        End Time: ${endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
        `)

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

    collect = await prompt.collect(
      oneLine`Please mention a role will be given for **Message Award 1**:
      Role given if X (ratio) days with Y quality and Z length/wathever
      keywords or smth else : no gm spammers, no copy pasters etc
      `
    );

    const msgAward1Role = collect.mentions.roles.first();

    if (!msgAward1Role) {
      throw new Error("A role didn't get mention");
    }

    const days = parseInt(await prompt.ask("How many days to get this role?"));
    validateNumber(days);

    const length = parseInt(await prompt.ask("Minimum message length to get the role"));
    validateNumber(length);

    const count = parseInt(await prompt.ask("How many messages to get this role?"));
    validateNumber(count);


    collect = await prompt.collect(
      oneLine`Please mention a role will be given for **Message Award 2**: Role
      given if user post a certain message in a certain channel at a certain
      time of the day`
    );

    const msgAward2Role = collect.mentions.roles.first();

    if (!msgAward2Role) {
      throw new Error("A role didn't get mention");
    }

    collect = await prompt.collect(
      `Please mention a channel for **Message Award 2**`
    );

    const msgAward2Channel = collect.mentions.channels.first();

    if (!msgAward2Channel) {
      throw new Error("No channel mentioned for **Message Award 2**");
    }

    const keyword = await prompt.ask(
      "Please specify keyword for this award to be triggered"
    );

    const now = DateTime.now();

    const startTimeInput = await prompt.ask(
      "Please select start time in 24 hours format: `00:00`"
    );

    const duration = parseInt(await prompt.ask("Please specify duration: (hours)"));
    validateNumber(duration);

    const [hour, minute] = startTimeInput.split(":")
      .map(x => {
        const time = parseInt(x);
        validateNumber(time)
        return time;
      });

    const startTime = now.set({ hour, minute });
    const endTime = startTime.plus({ hours: duration });

    const settings = new Settings({
      guild: msg.guild!,
      spamChannels: spam,
      gamblingChannels: gambling,
      duelChannels: duel,
      messageAward1: {
        role: msgAward1Role,
        days,
        length,
        count,
      },
      messageAward2: {
        role: msgAward2Role,
        keyword,
        channel: msgAward2Channel as TextBasedChannels,
        startTime: startTime.toJSDate(),
        endTime: endTime.toJSDate(),
      }
    });

    settings.save();
    msg.channel.send("Settings saved");
  }
}
