const env = require('../config.json')
const Youtube = require('youtube-node')
var ytdl = require('ytdl-core')

const youtube = new Youtube()
youtube.setKey('AIzaSyDZZ6giHIR2RO5hGT80fV0dEjYQw0QpRKo')
const youtubeUrl = "https://www.youtube.com/watch?v="

class AudioModule {
  Message(command, message, callback) {
    var tokens = message.content.split(" ")
    var messageWithoutCommands = tokens.slice(2).join(" ")

    message.channel.startTyping()
    youtube.search(messageWithoutCommands, 1, (err, res) => {
      if (err) return console.log(err)
      var videoId = res.items[0].id.videoId
      var title = res.items[0].snippet.title
      var channelTitle = res.items[0].snippet.channelTitle

      try {
        var requestUrl = youtubeUrl + videoId
        var stream = ytdl(requestUrl, { quality: 'highest', filter: 'audioonly' })
        var voiceChannel = message.guild.channels.find(channel => channel.type === 'voice' && channel.members.has(message.author.id))
        voiceChannel.join().then( voice => {
          voice.playStream(stream)
          message.channel.stopTyping()
          message.reply('\nNow playing: `' + title + '`\nChannel: `' + channelTitle + "`" )
        })
      } catch (err) {
        console.log('err: ' + err)
      }
    })
  }
}

module.exports = AudioModule
