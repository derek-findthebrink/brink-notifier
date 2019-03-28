const { Command/* , flags */ } = require('@oclif/command')
const ora = require('ora')
const notifier = require('node-notifier')
const yaml = require('js-yaml')
const fs = require('fs')

const notifyEveryMs = (milliseconds, { title, message, urgency = 'critical' }) => {
  if (typeof milliseconds !== 'number') {
    throw new TypeError(`Milliseconds must be a number. Received: ${milliseconds}`)
  }
  if (milliseconds < 1000 * 60) {
    throw new Error(`Minimum interval is one minute. '${milliseconds}ms' is invalid.`)
  }
  if (milliseconds > 1000 * 60 * 60 * 12) {
    throw new Error(`Maximum interval is 12 hours. '${milliseconds}ms' is invalid.`)
  }
  setInterval(() => {
    notifier.notify({
      wait: true,
      category: 'brink notifier',
      time: 1000 * 60 * 5, // expires in 5 minutes
      title,
      message,
      urgency,
    })
  }, milliseconds)
}

const getNotificationsConfig = () => (
  yaml.safeLoad(fs.readFileSync('./config.example.yml', 'utf8'))
)

const parseInterval = (interval) => {
  const { quantity, unit } = interval
  switch (unit) {
  case 'hour':
    return 1000 * 60 * 60 * quantity
  case 'minute':
    return 1000 * 60 * quantity
  default:
    break
  }
}

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
