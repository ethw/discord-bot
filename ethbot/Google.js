var env = require('../config.json'),
    GoogleImages = require('google-images'),
    GoogleSearch = require('google-search');
var imageClient = new GoogleImages(env.googleInfo.cseid, env.googleInfo.cseapikey);
var searchClient = new GoogleSearch({key: env.googleInfo.cseapikey, cx: env.googleInfo.cseid});

class GoogleModule {
  Message(command, message, callback) {
    var commandTermArray = message.content.split(" ")
    var secondCommandTerm = commandTermArray[2];
    var secondCommandIndex = message.content.indexOf(secondCommandTerm);
    var searchString = message.content.substring(secondCommandIndex + command.length).trim();

    //todo: move second term matching to a config file
    if (secondCommandTerm === "search") {
      searchClient.build({q: searchString}, (err, res) => {if (!err) callback(res.items[0].link)});
    } else if (secondCommandTerm === "image" || secondCommandTerm === "images") {
      imageClient.search(searchString, {page: 1, safe: 'off'}).then(images => callback(images[0].url));
    }
  }
}

module.exports = GoogleModule;
