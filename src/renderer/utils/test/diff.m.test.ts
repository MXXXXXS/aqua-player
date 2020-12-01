import diff from '../diff'

const lgjson = function (obj) {
  console.log(JSON.stringify(obj, null, 2))
}

const testObj0 = {
  1: '1',
  2: {
    3: '3',
    4: {
      5: '5',
    },
  },
}

const testObj1 = {
  1: '2',
  2: {
    3: '4',
    4: {
      5: '5',
    },
    6: '6',
  },
}

const testObj2 = {
  1: '2',
  2: {
    3: '4',
    4: {
      5: '5',
    },
    6: '6',
  },
}

function logDiff(testObj0, testObj1) {
  const diffResult = diff(testObj0, testObj1)
  lgjson(diffResult)
}
// logDiff(testObj0, testObj1)
logDiff(testObj1, testObj2)
