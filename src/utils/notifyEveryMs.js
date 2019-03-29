const notifier = require('node-notifier')

const notifyEveryMs = (milliseconds, { title, message, urgency = 'critical' }) => {
  if (typeof milliseconds !== 'number') {
    throw new TypeError(`Milliseconds must be a number. Received: ${milliseconds}`)
  }
  // allow notifications at a minimum of 1 minute
  if (milliseconds < 1000 * 60) {
    throw new Error(`Minimum interval is one minute. '${milliseconds}ms' is invalid.`)
  }
  // allow notifications at a max of 12 hours
  if (milliseconds > 1000 * 60 * 60 * 12) {
    throw new Error(`Maximum interval is 12 hours. '${milliseconds}ms' is invalid.`)
  }

  return setInterval(() => {
    notifier.notify({
      wait: true,
      category: 'brink notifier',
      time: 1000 * 60 * 5,
      title,
      message,
      urgency,
    })
  }, milliseconds)
}

exports.notifyEveryMs = notifyEveryMs

