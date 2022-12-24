const express = require('express')
const app = express()
const axios = require('axios')
fs = require('fs');
var parser = require('xml2json');

let listOfDrones = []

setInterval(() => {
    getData()
  }, 2000)

const doesInclude = (serialNumber, list) => {
    for (const i in list) {
        if (list[i].serialNumber === serialNumber){
            return true
        }
    }
}

const getDistance = (x,y) => {
    const distance = Math.sqrt(Math.pow((x - 250000), 2) + Math.pow((y - 250000), 2))
    return distance
}

const isDistanceGreater = (serialNumber, distance, list) => {
    for (const i in list) {
        if (list[i].serialNumber === serialNumber && list[i].distance > distance){
            return i
        }
    }
}

const getData = async () => {
    const request = await axios.get('https://assignments.reaktor.com/birdnest/drones')
    fs.readFile( './data.xml', async function(err, data) {
    var json = parser.toJson(request.data);
    var drones = JSON.parse(json).report.capture.drone
    for (const i in drones) {
        const distance = getDistance(drones[i].positionX, drones[i].positionY)
        const serialNumber = drones[i].serialNumber
        if (!(doesInclude(serialNumber, listOfDrones)) && distance < 100000) {
            pilotData = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
            pilot = pilotData.data
            const data = {
                serialNumber: drones[i].serialNumber,
                distance: distance,
                FirstName: pilot.firstName,
                LastName: pilot.lastName,
                email: pilot.email,
                number: pilot.phoneNumber
            }
            listOfDrones.push(data)
        } else if (isDistanceGreater(serialNumber, distance, listOfDrones) != null) {
            const data = {
                serialNumber: drones[i].serialNumber,
                distance: distance,
                FirstName: pilot.firstName,
                LastName: pilot.lastName,
                email: pilot.email,
                number: pilot.phoneNumber
            }
            const index = isDistanceGreater(serialNumber, distance, listOfDrones)
            listOfDrones[index].distance = distance
        }
    }
})}

app.get('/', async (req, res) => {
    res.send(listOfDrones)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})