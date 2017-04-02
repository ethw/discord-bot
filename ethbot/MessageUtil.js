const env = require('../config.json')
const Youtube = require('youtube-node')
const ytdl = require('ytdl-core')

const youtube = new Youtube()
youtube.setKey(env.googleAPIKey)
const youtubeUrl = "https://www.youtube.com/watch?v="

const messgeDeleteDelay = 15000

class MessageUtil {
  reply(message, replyString) {
    message.reply(replyString).then( message => message.delete(messgeDeleteDelay))
  }

  channel(message, replyString) {
    message.channel.sendMessage(replyString).then( message => message.delete(messgeDeleteDelay))
  }
}

module.exports = MessageUtil
