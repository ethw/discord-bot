const fs = require('fs')

class LogUtil {
  logWithTime(logString) {
    var now = new Date()
    var calendarString = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    var timeInDayString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    var logString = calendarString + ' ' + timeInDayString + ' : ' + logString

    console.log(logString)
    fs.appendFileSync('log', logString)
  }
}

module.exports = LogUtil
