const env = require('../config.json')
const WolframAlpha = require('wolfram-alpha')
const wolfram = WolframAlpha.createClient(env.wolframappid)

class WolframAlphaModule {
  Message (command, message, client, callback) {
    var commandTermArray = message.content.split(' ')
    var commandTerm = commandTermArray[1]
    var commandTermIndex = message.content.indexOf(commandTerm)
    var wolframString = message.content.substring(commandTermIndex + command.length).trim()

    if (!wolframString.trim()) return message.reply('Please enter a wolfram query. `@n help` for more info.')

    wolfram.query(wolframString, (err, results) => {
      var responseString = '\n'
      if (err) throw err

      var counter = 0
      results.forEach(result => {
        if (++counter < 3) {
          result.subpods.forEach(subpod => { responseString += subpod.image + '\n' })
        }
      })
      callback(responseString)
    })
  }
}

module.exports = WolframAlphaModule
