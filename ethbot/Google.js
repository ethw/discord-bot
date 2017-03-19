var env = require('../config.json'),
    GoogleImages = require('google-images');
var imageClient = new GoogleImages(env.googleInfo.cseid, env.googleInfo.cseapikey);

class Google {
  Message(command, message, callback) {
    var commandIndex = message.content.indexOf(command);
    var args = message.content.substring(commandIndex + command.length).trim();

    imageClient.search(args, {page: 1, safe: 'off'}).then(images => callback(images[0].url));
  }
}

module.exports = Google;
