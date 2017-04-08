const env = require('../config.json')
const info = require('./google.json')
const GoogleImages = require('google-images')
const GoogleSearch = require('google-search')
const GoogleTranslate = require('google-translate')("AIzaSyBQS3HZCTqTWSoA8I4nn1WSJvHgrG1qA4w")
const imageClient = new GoogleImages(env.googleCustomSearchEngineId, env.googleAPIKey)
const searchClient = new GoogleSearch({key: env.googleAPIKey, cx: env.googleCustomSearchEngineId})

class GoogleModule {

  Message(command, message, client, callback) {
    var commandTermArray = message.content.split(" ")
    var secondCommandTerm = commandTermArray[2]
    var secondCommandIndex = message.content.indexOf(secondCommandTerm)
    var searchString = message.content.substring(secondCommandIndex + command.length).trim()

    var commandApis = {}
    var gFunctions = info.googleFunctions
    commandApis[gFunctions.Image] = () => imageClient.search(searchString, {page: 1, safe: 'off'}).then(images => callback(images[0].url))
    commandApis[gFunctions.Search] = () => searchClient.build({q: searchString}, (err, res) => {if (!err) callback(res.items[0].link)})
    commandApis[gFunctions.Translate] = () => {
      var language = searchString.substring(searchString.lastIndexOf(" ") + 1, searchString.length)
      if (language.length === 2) {
        var termWithoutLanguage = searchString.substring(0, searchString.lastIndexOf(" "))
        GoogleTranslate.translate(termWithoutLanguage, language, (err, translation) => {
          if (!err) {
            return callback(translation)
          } else {
            console.log(err)
            callback(info.messages.translateError)
          }
        })
      }
    }
    commandApis[gFunctions.Languages] = () => {
      if (this.languageCodes) {
        return callback(this.buildLanguageCodeReplyString(this.languageCodes))
      }

      GoogleTranslate.getSupportedLanguages( (err, languageCodes) => {
        if (!err) {
          this.languageCodes = languageCodes.map(code => code.toUpperCase())
           callback(this.buildLanguageCodeReplyString(languageCodes))
        } else {
          console.log(err)
          callback(info.messages.languagesError)
        }
      })
    }


    for (var gFunction in gFunctions) {
      if (gFunctions.hasOwnProperty(gFunction)) {
        var gFunctionValue = gFunctions[gFunction]
        if (gFunctionValue == secondCommandTerm) {
          commandApis[gFunctionValue]()
        }
      }
    }
  }

  buildLanguageCodeReplyString(languageCodes) {
    var replyString = info.messages.supportedLanguages
    var lastLanguage = languageCodes[languageCodes.length - 1]
    languageCodes.forEach( languageCode => {
      if (languageCode === lastLanguage) {
        replyString += languageCode.toUpperCase()
      } else {
        replyString += languageCode.toUpperCase() + ", "
      }
    })
    return replyString
  }
}

module.exports = GoogleModule
