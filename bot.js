var env = require('./config.json'),
    EthBot = require('./ethbot/index.js'),
    Discord = require('discord.js');

var bot = new EthBot();
var client = new Discord.Client();

client.on('ready', () => {
  console.log('bot online');
})

client.on('message', message => {
  var commands = bot.loadCommands();
  var botMentionIsAtStart = message.content.split(" ")[0] === "<@!" + env.botId + ">"
                            || message.content.split(" ")[0] === "<@" + env.botId + ">"

  if (commands.length > 0 && botMentionIsAtStart) {
    var trimmedContent = message.content.substr(message.content.indexOf(" ") + 1);
    bot.checkMessageForCommand(trimmedContent, commands, (command) => {
      bot.runCommand(bot.getKeyByValue(bot.commands, command), command, message, (reply) => {
        message.reply(reply);
      })
    })
  }
})

client.login("MjkyNzk1OTQ2MzY1MDkxODQy.C69RPg.PMuUZ5buQhM4bSLXS-7S61iB04I")
