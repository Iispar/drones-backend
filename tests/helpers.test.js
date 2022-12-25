const helpers = require('../utils/helpers')
const { filterData } = require('../controllers/drones')

const list = [
  {
    serialNumber: 'ABCD',
    distance: 92000,
    time: 25
  },
  {
    serialNumber: 'BCAD',
    distance: 10000,
    time: 11
  },
  {
    serialNumber: 'YYYY',
    distance: 24000,
    time: '22'
  }
]

test('distance works', () => {
  const x = 250000
  const yWorks = 349000
  const yBroken = 352000
  const distanceFine = helpers.getDistance(x, yWorks)
  const distanceWrong = helpers.getDistance(x, yBroken)
  expect(distanceFine).toBe(99000)
  expect(distanceWrong).toBe(102000)
})

test('is greater than works', () => {
  const distance = 25000
  const resultFalse = helpers.isDistanceGreater('BCAD', distance, list)
  const resultTrue = helpers.isDistanceGreater('ABCD', distance, list)
  expect(resultFalse).toBe(false)
  expect(resultTrue).toBe('0')
})

test('is in list works', () => {
  const resultTrue = helpers.doesInclude('BCAD', list)
  const resultFalse = helpers.doesInclude('XXXX', list)
  expect(resultFalse).toBe(false)
  expect(resultTrue).toBe(true)
})

test('time filter works', () => {
  filterData(list, 28)
  expect(list.length).toBe(2)
})
