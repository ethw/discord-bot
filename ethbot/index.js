var env = require('../config.json'),
    Example = require('./Example.js');

class EthBot {
  constructor() {
    this.commands = env.commands;
    this.Example = new Example;
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
    commands.forEach(command => {
      if (message.startsWith(command))
        return callback(command);
    })
  }

  getKeyByValue(object, value) {
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        if (object[property] == value) return property;
      }
    }
  }

  runCommand(moduleName, command, message, callback) {
    this[moduleName].Message(command, message, callback);
  };
}

module.exports = EthBot;
