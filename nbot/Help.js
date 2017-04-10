const descriptions = require('./help.json')

class HelpModule {
  Message (command, message, client, callback) {
    var replyString = '\n'
    for (var prop in descriptions) {
      if (descriptions.hasOwnProperty(prop)) {
        replyString += descriptions[prop] + '\n'
      }
    }
    message.author.sendMessage(replyString)
    message.channel.sendMessage('Check your private messages <@' + message.author.id + '>')
  }
}

module.exports = HelpModule
