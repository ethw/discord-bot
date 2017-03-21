var env = require('../config.json'),
    descriptions = require('./help.json');

class HelpModule {
  Message(command, message, client, callback) {
    var replyString = "\n";
    for (var prop in descriptions) {
      if (descriptions.hasOwnProperty(prop)) {
        replyString += descriptions[prop] + '\n'
      }
    }
    callback(replyString);
  }
}

module.exports = HelpModule;
