const { MessageEmbed } = require("discord.js");
const os = require('os')

const cpus = os.cpus()
const cpu = cpus[0];

const total = Object.values(cpu.times).reduce(
    (acc, tv) => acc + tv, 0
);

const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) * 1000;

const perc = currentCPUUsage / total;
module.exports = {
  name: "stats",
  description: "Displays the ressources used by your bot's process",
  botPerms: ["EMBED_LINKS"],
  run: async (client, message) => {
    if(message.member.permissions.has('ADMINISTRATOR')){
        let servers_count = message.client.guilds.cache.size;
  var myarray = [];
  message.client.guilds.cache.keyArray().forEach(async function (item, index) {

    let guildMember = message.client.guilds.cache.get(item).memberCount;
    myarray.push(guildMember);
  });
  let sum = myarray.reduce(function (a, b) {
    return a + b;
  });

  let totalSeconds = message.client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let uptime = `\`\`\`${days} jours, ${hours} heures, ${minutes} minutes et ${seconds} secondes\`\`\``;

  let embed = new MessageEmbed()
    .setTitle(`${message.client.user.username} Stats`)
    .setDescription(`**${message.client.user.username}**`)
    .addFields(
      { name: "📡 - Server count:", value: `\`\`\`${servers_count}\`\`\``, inline: true },
      { name: "👩‍👩‍👧‍👦 - Users:", value: `\`\`\`${sum}\`\`\``, inline: true },
      { name: "📺 - Channels", value: `\`\`\`${message.client.channels.cache.size}\`\`\``, inline: true },
      { name: "⌚ - Uptime: ", value: uptime, inline: true },
      { name: "🕛 - Latency: ", value: `\`\`\`${Math.round(client.ws.ping)} ms\`\`\``, inline: true },
      { name: "🗄️ - RAM: ", value: `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``, inline: true },
      { name: "💾 - Processor: ", value:`\`\`\`${perc} %\`\`\``, inline: true },
      { name: "📥 - Packages count: ", value:`\`\`\`${process.versions.modules}\`\`\``, inline: true }
    )
    .setColor("RANDOM")
    .setFooter(`${message.client.user.username}`);

  return message.channel.send({embeds:[embed]});
    }
  },
};
