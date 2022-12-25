/**
 * Method to be able to see if a drone is already on the list of violating drones
 * @param {*} serialNumber
 * @param {*} list
 * @returns true || false
 */
const doesInclude = (serialNumber, list) => {
  for (const i in list) {
    if (list[i].serialNumber === serialNumber) {
      return true
    }
  }
}

/**
 * Returns the distance between two coordinates and the birdsnest.
 * @param x
 * @param y
 * @returns distance to nest
 */
const getDistance = (x, y) => {
  const distance = Math.sqrt(Math.pow((x - 250000), 2) + Math.pow((y - 250000), 2))
  return distance
}

/**
 * Checks if the distance is greater than the previous revorded distance of the drone.
 * Returns the index of the drone we are observing.
 * @param {*} serialNumber
 * @param {*} distance
 * @param {*} list
 * @returns index of key
 */
const isDistanceGreater = (serialNumber, distance, list) => {
  for (const i in list) {
    if (list[i].serialNumber === serialNumber && list[i].distance > distance) {
      return i
    }
  }
}

module.exports = { doesInclude, getDistance, isDistanceGreater }
