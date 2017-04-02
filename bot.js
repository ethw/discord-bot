var env = require('./config.json'),
    EthBot = require('./ethbot/index.js'),
    Discord = require('discord.js'),
    fs = require('fs');

var bot = new EthBot();
var client = new Discord.Client();

client.on('ready', () => {
  console.log('ethbot online');
  client.user.setGame('@ethbot help');
})

client.on('message', message => {
  try {
    var commands = bot.loadCommands();
    var botWasMentioned = message.mentions.users.get(env.botId) !== undefined;
    var botMentionIsAtStart = message.content.split(" ")[0].includes(env.botId)

    if (commands.length > 0 && botWasMentioned && botMentionIsAtStart) {
      bot.checkMessageForCommand(message, commands, (command) => {
        if (command == 'a' && command != 'audio') message.delete(15000)

        bot.runCommand(bot.getKeyByValue(bot.commands, command), command, message, client, (reply) => {
          message.reply(reply);
        })
      })
    }
  } catch (err) {
    console.log(err)
    fs.writeFile("log", err, err => { if (err) console.log(err + '\n') })
    throw err
  }
})

client.login(env.token);
