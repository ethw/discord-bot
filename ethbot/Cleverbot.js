var env = require('../config.json'),
    Cleverbot = require('cleverbot-node');

var cleverbot = new Cleverbot;
cleverbot.configure({botapi: env.cleverbotapikey});

class CleverbotModule {
  Message(command, message, client, callback) {
    var tokens = message.content.split(" ");
    var messageWithoutCommands = tokens.slice(2).join(" ");
    var channel = message.channel;

    channel.startTyping();
    cleverbot.write(messageWithoutCommands, (res) => {
      channel.stopTyping();
      channel.sendMessage("`Cleverbot:` " + res.output);
    });
  }
}

module.exports = CleverbotModule;
