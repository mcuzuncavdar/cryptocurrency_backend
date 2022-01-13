const {Log, validateLog} = require("../../model/Log");

module.exports = async function (logSubject, logMessage, logType = 'error') {

  let {error} = validateLog({logType, logSubject, logMessage});

  if (!error) {
    let log = new Log({
      logType, logSubject, logMessage
    });

    await log.save();
  }

};
