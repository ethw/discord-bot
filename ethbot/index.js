const env = require('../config.json')
const Google = require('./Google.js')
const Help = require('./Help.js')
const WolframAlpha = require('./WolframAlpha.js')
const Cleverbot = require('./Cleverbot.js')
const Audio = require('./Audio.js')

class EthBot {
  constructor() {
    this.commands = env.commands;
    this.Google = new Google;
    this.Help = new Help;
    this.WolframAlpha = new WolframAlpha;
    this.Cleverbot = new Cleverbot;
    this.Audio = new Audio;
  }

  loadCommands() {
    var result = [];
    for (var key in this.commands) {
      if (this.commands.hasOwnProperty(key))
        result.push(this.commands[key]);
    }
    return result;
  }

  checkMessageForCommand(message, commands, callback) {
    var messageWithoutBotName = message.content.substr(message.content.indexOf(" ") + 1);
    var counter = 0
    commands.forEach(command => {
      if (messageWithoutBotName.startsWith(command)) {
        return callback(command);
      } else {
        if (++counter === commands.length) {
          message.delete(15000)
        }
      }
    })
  }

  getKeyByValue(object, value) {
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        if (object[property] == value) return property;
      }
    }
  }

  runCommand(moduleName, command, message, client, callback) {
    this[moduleName].Message(command, message, client, callback);
  };
}

module.exports = EthBot;
