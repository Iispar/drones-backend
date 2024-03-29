const axios = require('axios')
const fs = require('fs')
const parser = require('xml2json')
const dronesRouter = require('express').Router()
const helpers = require('../utils/helpers')

const listOfDrones = []
let time

/**
 * Interval so we update the data from the server every 2 seconds.
 */
setInterval(() => {
  getData(listOfDrones, time)
  filterData(listOfDrones, time)
}, 2000)

/**
 * Check if an drone has been in the list for over 10 minutes, if true delete the drone from the list
 */
const filterData = (listOfDrones, time) => {
  for (const i in listOfDrones) {
    const timeOfDetection = Number(listOfDrones[i].time.split(':')[1])
    const detectionHour = Number(listOfDrones[i].time.split(':')[0])
    let timeNow = Number(time.split(':')[1])
    const hour = Number(time.split(':')[0])
    if (detectionHour !== hour) {
      timeNow += 60
    }
    if (timeNow - timeOfDetection > 10) {
      listOfDrones.splice(i, 1)
    }
  }
}

/**
 * Method for retriewing the data and also filtering it straight away. We keep only the serial number, distance and pilot information.
 * We also update the distance if the pilot is already in the list.
 */
const getData = async () => {
  // get raw data from the API
  const request = await axios.get('https://assignments.reaktor.com/birdnest/drones')
  // to access the xml data we format it to JSON.
  fs.readFile('./data.xml', async function () {
    const json = parser.toJson(request.data)
    let drones = JSON.parse(json).report.capture
    time = drones.snapshotTimestamp
    time = time.split('T')[1].split('.')[0]
    drones = drones.drone
    for (const i in drones) {
      const distance = helpers.getDistance(drones[i].positionX, drones[i].positionY)
      const serialNumber = drones[i].serialNumber
      // if the pilot isn't already in the list and is violating the boarder
      if (!(helpers.doesInclude(serialNumber, listOfDrones)) && distance < 100000) {
        // get pilots information from the address. Only do this if the pilot is violating the boarder.
        // use a try catch to catch if getting the pilots data returns a error.
        try {
          const pilotData = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
          const pilot = pilotData.data
          const data = {
            serialNumber: drones[i].serialNumber,
            distance,
            positionX: drones[i].positionX,
            positionY: drones[i].positionY,
            firstName: pilot.firstName,
            lastName: pilot.lastName,
            email: pilot.email,
            number: pilot.phoneNumber,
            time
          }
          listOfDrones.push(data)
        } catch (err) {
          console.log(err.response.data)
          const data = {
            serialNumber: drones[i].serialNumber,
            distance,
            positionX: drones[i].positionX,
            positionY: drones[i].positionY,
            firstName: 'first name not found',
            lastName: 'last name not found',
            email: 'email not found',
            number: 'number not found',
            time
          }
          listOfDrones.push(data)
        }

      // if the pilot is already in the list we just update the location and distance.
      } else if (helpers.isDistanceGreater(serialNumber, distance, listOfDrones) !== false) {
        const index = helpers.isDistanceGreater(serialNumber, distance, listOfDrones)
        listOfDrones[index].distance = distance
        listOfDrones[index].positionX = drones[i].positionX
        listOfDrones[index].positionY = drones[i].positionY
      }
    }
  })
}

/**
 * Response with a get to the address with the information about drones violating the boarder
 */
dronesRouter.get('/', async (req, res) => {
  res.send(listOfDrones)
})

module.exports = dronesRouter
