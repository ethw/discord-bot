const env = require('../config.json')
const Youtube = require('youtube-node')
const ytdl = require('ytdl-core')

const youtube = new Youtube()
youtube.setKey(env.googleAPIKey)
const youtubeUrl = "https://www.youtube.com/watch?v="

class AudioModule {

  constructor() {
    //map of guildId to queue
    this.queues = new Map()
  }

  Message(command, message, client, callback) {
    //0 - mentions, 1 - audio, 2 - command
    var tokens = message.content.split(" ")
    var secondTerm = tokens[2]
    var messageWithoutCommands = tokens.slice(3).join(" ").trim()

    if (secondTerm === 'pause') {
      //voice is StreamDispatcher type
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          message.reply('Playback is already paused')
        } else {
          voice.pause()
          message.reply('Playback paused')
        }
      })
    } else if (secondTerm === 'resume') {
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          voice.resume()
          message.reply('Playback resumed')
        } else {
          message.reply('Playback is not paused')
        }
      })
    } else if (secondTerm === 'stop') {
      this.useVoiceConnection(client, message, voice => {
        voice.end()
        this.queues.delete(message.guild.id)
      })
    } else if (secondTerm === 'volume') {
      this.useVoiceConnection(client, message, voice => {
        if (messageWithoutCommands < 0 && messageWithoutCommands < 400) return message.reply('Enter a value between 0-400')
        voice.setVolume(messageWithoutCommands / 100)
        message.reply('volume set to ' + messageWithoutCommands + "%")
      })
    } else if (secondTerm === 'play') {
      youtube.search(messageWithoutCommands, 1, (err, res) => {
        if (err) return console.log(err)
        if (res.items.length === 0) return message.reply('No results for for that search')
        if (res.items[0].id.kind === 'youtube#playlist') return message.reply('No results for for that search')
        var videoId = res.items[0].id.videoId
        var title = res.items[0].snippet.title
        var channelTitle = res.items[0].snippet.channelTitle

        message.channel.startTyping()

        try {
          //todo: stop searching even for links
          if (secondTerm.startsWith('http://') || secondTerm.startsWith('https://')) {
            var requestUrl = secondTerm
          } else {
            var requestUrl = youtubeUrl + videoId

          }
          var stream = ytdl(requestUrl, { quality: 'highest', filter: 'audioonly' })
          var voiceChannel = message.guild.channels.find(channel => channel.type === 'voice' && channel.members.has(message.author.id))
          voiceChannel.join().then( voice => {
            message.channel.stopTyping()
            message.reply('\n`Now playing:` ' + title + '\n`Link:` ' + requestUrl + '\n`Channel:` ' + channelTitle)
            voice.playStream(stream)
          })
        } catch (err) {
          console.log('err: ' + err)
        } finally {
          message.channel.stopTyping()
        }
      })
    }
  }

  useVoiceConnection(client, message, callback)  {
    var voiceConnection = client.voiceConnections.get(message.guild.id)
    if (voiceConnection) {
      callback(voiceConnection.player.dispatcher)
    } else {
      message.reply('ethbot is not in a voice channel. Use @ethbot help to learn how to fix that')
    }
  }
}

module.exports = AudioModule
