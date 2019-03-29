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

exports.parseInterval = parseInterval

