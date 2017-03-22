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

    // init playback queue if necessary
    if (!this.queues.has(message.guild.id)) this.queues.set(message.guild.id, [])

    if (secondTerm === 'pause') {
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          message.channel.sendMessage('Playback is already paused')
        } else {
          voice.pause()
          message.channel.sendMessage('Playback paused')
        }
      })

    } else if (secondTerm === 'resume') {
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          voice.resume()
          message.channel.sendMessage('Playback resumed')
        } else {
          message.channel.sendMessage('Playback is not paused')
        }
      })

    } else if (secondTerm === 'stop') {
      this.useVoiceConnection(client, message, voice => {
        voice.end()
        this.queues.delete(message.guild.id)
      })

    } else if (secondTerm === 'volume') {
      this.useVoiceConnection(client, message, voice => {
        if (messageWithoutCommands < 0 && messageWithoutCommands < 400) return message.channel.sendMessage('Enter a value between 0-400')
        voice.setVolume(messageWithoutCommands / 100)
        message.channel.sendMessage('volume set to ' + messageWithoutCommands + "%")
      })

    } else if (secondTerm === 'skip') {
      var queue = this.queues.get(message.guild.id)
      var voiceConnection = client.voiceConnections.get(message.guild.id)
      if (!voiceConnection || queue.length === 0) return message.channel.sendMessage('Nothing to skip')
      voiceConnection.player.dispatcher.end()

    } else if (secondTerm === 'queue' || secondTerm === 'q'){
      var queue = this.queues.get(message.guild.id)
      if (queue.length === 0) return message.channel.sendMessage('Nothing in queue')
      var replyString = '```\ncurrently playing ↴\n'
      var index = 0
      queue.forEach( queueItem => {
        replyString += ++index + '. ' + queueItem.title + '\n'
      })
      message.channel.sendMessage(replyString + '```')

    } else if (secondTerm === 'play') {
      var queue = this.queues.get(message.guild.id)

      //todo: move link checking out of this search
      youtube.search(messageWithoutCommands, 1, (err, res) => {
        if (err) return console.log(err)
        if (res.items.length === 0) return message.channel.sendMessage('No results for for that search')
        if (res.items[0].id.kind === 'youtube#playlist') return message.channel.sendMessage('No results for for that search')
        var videoId = res.items[0].id.videoId
        var videoTitle = res.items[0].snippet.title
        var channelTitle = res.items[0].snippet.channelTitle

        if (secondTerm.startsWith('http://') || secondTerm.startsWith('https://')) {
          var requestUrl = secondTerm
        } else {
          var requestUrl = youtubeUrl + videoId
        }
        queue.push({
          link: requestUrl,
          title: videoTitle,
          channel: channelTitle
        })
        this.queues.set(message.guild.id, queue)

        var voiceConnection = client.voiceConnections.get(message.guild.id)
        if (voiceConnection) {
          if (voiceConnection.speaking) return message.channel.sendMessage(videoTitle + ' added to the queue')
        } else {
          var stream = ytdl(requestUrl, { quality: 'highest', filter: 'audioonly' })
          var voiceChannel = message.guild.channels.find(channel => channel.type === 'voice' && channel.members.has(message.author.id))
          voiceChannel.join().then( voice => {
            this.playStream(voice, stream, queue, message)
          })
        }
      })
    }
  }

  useVoiceConnection(client, message, callback)  {
    var voiceConnection = client.voiceConnections.get(message.guild.id)
    if (voiceConnection) {
      callback(voiceConnection.player.dispatcher)
    } else {
      message.channel.sendMessage('ethbot is not in a voice channel. Use @ethbot help to learn how to fix that')
    }
  }

  playStream(voice, stream, queue, message) {
    var firstQueueItem = queue[0]
    message.channel.sendMessage('\n\n`Now playing:` ' + firstQueueItem.title + '\n`Link:` ' + firstQueueItem.link + '\n`Channel:` ' + firstQueueItem.channel)
    voice.playStream(stream).on('end', reason => {
      queue.shift()
      this.queues.set(message.guild.id, queue)
      if (queue.length === 0) return message.channel.sendMessage('Queue playback complete')
      var newStream = ytdl(queue[0].link, { quality: 'highest', filter: 'audioonly' })
      this.playStream(voice, newStream, queue, message)
    })
  }
}

module.exports = AudioModule
