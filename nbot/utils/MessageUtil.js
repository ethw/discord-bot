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
