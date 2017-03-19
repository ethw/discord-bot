var env = require('./config.json'),
    EthBot = require('./ethbot/index.js'),
    Discord = require('discord.js');

var bot = new EthBot();
var client = new Discord.Client();

client.on('ready', () => {
  console.log('bot online');
  client.user.setGame('@ethbot help');
})

client.on('message', message => {
  var commands = bot.loadCommands();
  var botWasMentioned = message.mentions.users.get(env.botId) !== undefined;
  var botMentionIsAtStart = message.content.split(" ")[0].includes(env.botId)

  if (commands.length > 0 && botWasMentioned && botMentionIsAtStart) {
    var trimmedContent = message.content.substr(message.content.indexOf(" ") + 1);
    bot.checkMessageForCommand(trimmedContent, commands, (command) => {
      bot.runCommand(bot.getKeyByValue(bot.commands, command), command, message, (reply) => {
        message.reply(reply);
      })
    })
  }
})

client.login("MjkyNzk1OTQ2MzY1MDkxODQy.C69RPg.PMuUZ5buQhM4bSLXS-7S61iB04I")
