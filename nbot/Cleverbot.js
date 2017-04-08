const env = require('../config.json')
const Cleverbot = require('cleverbot-node')

const cleverbot = new Cleverbot
cleverbot.configure({botapi: env.cleverbotapikey})

class CleverbotModule {
  Message(command, message, client, callback) {
    var tokens = message.content.split(" ")
    var messageWithoutCommands = tokens.slice(2).join(" ")
    var channel = message.channel

    channel.startTyping()
    cleverbot.write(messageWithoutCommands, (res) => {
      channel.stopTyping()
      channel.sendMessage("`Cleverbot:` " + res.output)
    })
  }
}

module.exports = CleverbotModule
