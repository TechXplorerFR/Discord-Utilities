//ENVIRONMENT VARIABLES

const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { Player } = require('discord-player');
const { DiscordTogether } = require('discord-together');
const enmap = require('enmap');
const fs = require('fs')

//Client Declaration 

const client = new Client({
    allowedMentions: {parse: ['users', 'roles', 'everyone']},
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
});

const { checkValid } = require("./functions/validation/checkValid")
const Embeds = require("./functions/embeds/Embeds")
const Logger = require("./functions/Logger/Logger")
const Util = require("./functions/util/Util")
const { TOKEN, ERROR_LOGS_CHANNEL, YT_COOKIE } = require("./config.json");
const { loadCommands } = require("./handling/loadCommands");
const { loadEvents } = require("./handling/loadEvents");
const { loadSlashCommands } = require("./handling/loadSlashCommands")
const { loadPlayerEvents } = require("./handling/loadPlayerEvents");

//Client variables

client.together = new DiscordTogether(client);
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.cat = fs.readdirSync("./Commands/");
client.setMaxListeners(0);
const Cookie = YT_COOKIE;
client.log = Logger;
client.utils = Util;
client.say = Embeds;
client.player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  leaveOnEmpty: false,
  leaveOnEmptyCooldown: 60000,
  autoSelfDeaf: true,
  initialVolume: 130,
  ytdlDownloadOptions: {
    requestOptions: {
      headers: {
        cookie: Cookie,
      }
    }
  },
})

client.player.use("YOUTUBE_DL", require("@discord-player/downloader").Downloader);
client.db = new Enmap({ name: "musicdb" });

client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});

loadCommands(client);
loadEvents(client);
loadPlayerEvents(client);
loadSlashCommands(client);
checkValid();

// Error Handling

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);

  const exceptionembed = new MessageEmbed()
  .setTitle("Uncaught Exception")
  .setDescription(`${err}`)
  .setColor("RED")
  const channel = client.channels.cache.get(ERROR_LOGS_CHANNEL)
  channel.send({ embeds: [exceptionembed] })
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    "[FATAL] Possibly Unhandled Rejection at: Promise ",
    promise,
    " reason: ",
    reason.message
  );
});

client.login(TOKEN).then(() => {
  console.log(
    chalk.bgBlueBright.black(
      ` Successfully logged in as: ${client.user.username}#${client.user.discriminator} `
    )
  );
});
process.on("beforeExit", (stream) => {
  console.log('Stopping script')
})
