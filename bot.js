const env = require('./config.json')
const NBot = require('./nbot/index.js')
const Discord = require('discord.js')
const LogUtil = require('./nbot/utils/LogUtil.js')

var bot = new NBot()
var client = new Discord.Client()

client.on('ready', () => {
  console.log('n online')
  client.user.setGame('@n help')
})

client.on('message', message => {
  try {
    var commands = bot.loadCommands()
    var botWasMentioned = message.isMentioned(client.user)
    var botMentionIsAtStart = message.content.split(' ')[0].includes(env.botId)

    if (commands.length > 0 && botWasMentioned && botMentionIsAtStart) {
      bot.checkMessageForCommand(message, commands, (command) => {
        if (command === 'a' && command !== 'audio') message.delete(15000)
        bot.runCommand(bot.getKeyByValue(bot.commands, command), command, message, client, (reply) => {
          message.reply(reply)
        })
      })
    }
  } catch (err) {
    var logUtil = new LogUtil()
    logUtil.logWithTime(err + '\n' + err.stack + '\n')
    throw err
  }
})

client.login(env.token)
