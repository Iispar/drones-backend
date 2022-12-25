
/**
 * method for easier logging.
 */
const info = (...params) => {
  console.log(...params)
}

/**
 * method for easier errors.
 */
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
