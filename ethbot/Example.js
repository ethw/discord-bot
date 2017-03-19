class ExampleModule {
  Message(command, message, callback) {
    //Check that command is in string
    var commandIndex = message.content.indexOf(command);
    if (commandIndex > -1) {
      //get args after command (not used in this example)
      var args = message.content.substring(commandIndex + command.length).trim();
      callback("test");
    }
  }
}

module.exports = ExampleModule;
