module.exports = {
    name: "shutdown",
    description: "Shut's down the bot",
    run: async (client, message, args) => {
      if (!message.author.permissions.has('ADMINISTRATOR'))
        return message.channel.send("This command is developer Only");
  
      message.channel.send("Shutting down...").then((m) => {
        client.destroy();
        process.exit(0)
      });
      await message.channel.send("The Bot has been ShutDown and process has been killed");
    },
  };
  