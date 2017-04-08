![n](http://i.imgur.com/8BbeHz1.png "n")
# - the peoples discord bot

n is a general multipurpose bot for discord.

### requires
- python 2.7
- node 6.x

### running the bot
1. `npm install` to install dependencies.
2. Edit config.json to add in your bot token, client id, and other required api information.
3. `node bot.js`, `runbot.bat`, or `runbot.sh` to run the bot.


### supported commands
- `@n google [search|image] <search term>` searches google search or images for the search term.
- `@n [wolf|wolfram] <wolfram query>]` displays wolfram results calculated from the query terms.
- `@n [cleverbot|cb] <phrase>` display the cleverbot reply to phrase.
- `@n [audio|a] <additional commands>` executes an audio command. Additional commands...
-     `[play|p] <search term or link>` searches youtube for the term or link and plays audio from that video
-     `[stop|s]` bot leaves channel, stops playing audio
-     `[pause|ps]` pauses playback
-     `[resume|rs]` resumes playback
-     `[volume|v] <x>` changes the volume to x%
-     `[skip|sk]` skips the next item in queue
-     `[queue|q]` lists the current playback queue
-     `[repeat|r]` toggles the repeat functionality

- `@n help` lists supported commands.
