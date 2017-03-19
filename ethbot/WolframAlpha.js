var env = require('../config.json'),
    WolframAlpha = require('wolfram-alpha');
var wolfram = WolframAlpha.createClient(env.wolframappid);

class WolframAlphaModule {
  Message(command, message, callback) {
    var commandTermArray = message.content.split(" ")
    var commandTerm = commandTermArray[1];
    var commandTermIndex = message.content.indexOf(commandTerm);
    var wolframString = message.content.substring(commandTermIndex + command.length).trim();

    if (!wolframString.trim()) return callback("Please enter a wolfram query. `@ethanbot help` for more info.");

    wolfram.query(wolframString, (err, results) => {
      var responseString = '\n';
      if (!err) {
        var counter = 0;
        results.forEach(result => {
          if (++counter < 3)
            result.subpods.forEach(subpod => responseString += subpod.image + '\n');
        });
      callback(responseString);
      } else {
        console.log(err);
      }
    })
  }
}

module.exports = WolframAlphaModule;
