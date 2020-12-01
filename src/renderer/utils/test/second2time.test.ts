import { second2time, time2second } from '../second2time'

type TestCaseItem = [number, string]

const testCase: Array<TestCaseItem> = [
  [0, '0:00'],
  [12, '0:12'],
  [123, '2:03'],
  [643, '10:43'],
  [4221, '1:10:21'],
  [13341, '3:42:21'],
  [164211, '45:36:51'],
]

testCase.forEach((item) => {
  test('Second to time string', () => {
    expect(second2time(item[0])).toEqual(item[1])
  })
})

testCase.forEach((item) => {
  test('Time to second string', () => {
    expect(time2second(item[1])).toEqual(item[0])
  })
})
