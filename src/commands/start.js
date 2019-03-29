
const { Command/* , flags */ } = require('@oclif/command')
const ora = require('ora')
const yaml = require('js-yaml')
const fs = require('fs')

const { parseInterval } = require('../utils/parseInterval')
const { notifyEveryMs } = require('../utils/notifyEveryMs')

const getNotificationsConfig = () => (
  yaml.safeLoad(fs.readFileSync('./config.example.yml', 'utf8'))
)

const createNotificationDefinitions = (notifications) => {
  const squiglets = []
  notifications.forEach((notification) => {
    switch (notification.type) {
    // if type is interval, create an interval
    case 'interval': {
      const duration = parseInterval(notification.interval)
      const interval = notifyEveryMs(duration, notification)
      squiglets.push(interval)
      break
    }
    default:
      break
    }
  })

  return squiglets
}

// Command
// -----------------------------------------------------------------------------
class StartCommand extends Command {
  async run() {
    // const {flags} = this.parse(StartCommand)
    // create notifications and begin notifying
    createNotificationDefinitions(getNotificationsConfig().notifications)
    // fire up the spinner to show that the app is still working
    ora('We\'ve got you covered...').start()
  }
}

StartCommand.description = `Start up the notifications service
...
Extra documentation goes here
`

StartCommand.flags = {
  // name: flags.string({ char: 'n', description: 'name to print' }),
}

module.exports = StartCommand
