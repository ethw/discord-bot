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
    //map of guildId to isRepeating boolean
    this.isRepeatings = new Map()
  }

  Message(command, message, client, callback) {
    var guildId = message.guild.id

    //0 - mentions, 1 - audio, 2 - command
    var tokens = message.content.split(" ")
    var secondTerm = tokens[2].toLowerCase()
    var messageWithoutCommands = tokens.slice(3).join(" ").trim()

    // init playback queue if necessary
    if (!this.queues.has(guildId)) this.queues.set(guildId, [])
    if (!this.isRepeatings.has(guildId)) this.isRepeatings.set(guildId, false)

    if (secondTerm === 'pause' || secondTerm === 'ps') {
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          message.channel.sendMessage('Playback is already paused')
        } else {
          voice.pause()
          message.channel.sendMessage('Playback paused')
        }
      })

    } else if (secondTerm === 'resume' || secondTerm === 'rs') {
      this.useVoiceConnection(client, message, voice => {
        if (voice.paused) {
          voice.resume()
          message.channel.sendMessage('Playback resumed')
        } else {
          message.channel.sendMessage('Playback is not paused')
        }
      })

    } else if (secondTerm === 'stop' || secondTerm === 's') {
      this.queues.set(guildId, [])
      this.useVoiceConnection(client, message, voice => {
        voice.end()
      })

    } else if (secondTerm === 'volume' || secondTerm === 'v') {
      this.useVoiceConnection(client, message, voice => {
        if (messageWithoutCommands < 0 && messageWithoutCommands < 400) return message.channel.sendMessage('Enter a value between 0-400')
        voice.setVolume(messageWithoutCommands / 100)
        message.channel.sendMessage('volume set to ' + messageWithoutCommands + "%")
      })

    } else if (secondTerm === 'skip' || secondTerm === 'sk') {
      var queue = this.queues.get(guildId)
      var voiceConnection = client.voiceConnections.get(guildId)
      if (!voiceConnection || queue.length === 0) return message.channel.sendMessage('Nothing to skip')
      voiceConnection.player.dispatcher.end()

    } else if (secondTerm === 'queue' || secondTerm === 'q'){
      var queue = this.queues.get(guildId)
      if (queue.length === 0) return message.channel.sendMessage('Nothing in queue')
      var replyString = '```md\ncurrently playing ↴  repeat: ' + (this.isRepeatings.get(guildId) ? 'on' : 'off') + '\n'
      var index = 0
      queue.forEach( queueItem => {
        replyString += ++index + '. ' + queueItem.title + '\n'
      })
      message.channel.sendMessage(replyString + '```')

    } else if (secondTerm === 'repeat' || secondTerm === 'r') {
      var isRepeating = this.isRepeatings.get(guildId)
      this.setIsRepeating(message, !isRepeating)
    } else if (secondTerm === 'play' || secondTerm === 'p') {
      var queue = this.queues.get(guildId)

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
        this.queues.set(guildId, queue)

        var voiceConnection = client.voiceConnections.get(guildId)
        if (voiceConnection) {
          if (voiceConnection.speaking) return message.channel.sendMessage(videoTitle + ' added to the queue')
        } else {
          var stream = ytdl(requestUrl, { quality: 'highest', filter: 'audioonly' })
          var voiceChannel = message.guild.channels.find(channel => channel.type === 'voice' && channel.members.has(message.author.id))
          voiceChannel.join().then( voice => {
            this.playStream(voice, stream, queue, message, "")
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

  playStream(voice, stream, queue, message, reason) {
    var firstQueueItem = queue[0]
    // Send stream info unless stream is repeating, or stream was skipped
    if (!this.isRepeatings.get(message.guild.id) || reason !== 'user') {
      message.channel.sendMessage('\n\n`Now playing:` ' + firstQueueItem.title + '\n`Link:` ' + firstQueueItem.link + '\n`Channel:` ' + firstQueueItem.channel)
    } else {
      message.channel.sendMessage('`Now repeating:` '+ firstQueueItem.title)
    }
    voice.playStream(stream).on('end', reason => {
      if (!this.isRepeatings.get(message.guild.id) && queue.length > 0) this.queues.set(message.guild.id, queue.length === 1 ? [] : queue.slice(1))
      var newQueue = this.queues.get(message.guild.id)
      if (newQueue.length === 0) {
        this.setIsRepeating(message, false, this.isRepeatings.get(message.guild.id))
        voice.disconnect()
        return message.channel.sendMessage('Queue playback complete')
      }
      var newStream = ytdl(newQueue[0].link, { quality: 'highest', filter: 'audioonly' })
      this.playStream(voice, newStream, newQueue, message, reason)
    })
  }

  setIsRepeating(message, newIsRepeating, shouldMessage = true) {
    if (newIsRepeating && shouldMessage) {
      message.reply('Repeat current audio: `on`')
    } else if (shouldMessage) {
      message.reply('Repeat current audio: `off`')
    }
    this.isRepeatings.set(message.guild.id, newIsRepeating)
  }
}

module.exports = AudioModule
