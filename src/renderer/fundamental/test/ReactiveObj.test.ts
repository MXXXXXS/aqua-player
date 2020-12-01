import StateProps from '~/renderer/fundamental/StateProps'
import Aqua from 'r/fundamental/aqua'

const testStates = {
  state0: new Aqua({
    data: 0,
  }),
  state1: new Aqua({
    data: 's',
  }),
}

const testProps = new StateProps({
  state0: 1,
  state1: '',
})

testProps.bindToStates(testStates)

const { state0, state1 } = testStates

test('初始绑定, testStates 值同步到 testProps', () => {
  expect(testProps.proxied.state0).toBe(0)
  expect(testProps.proxied.state1).toBe('s')
})

test('testStates 值变更, 同步到 testProps', () => {
  state0.tap('set', 2)
  expect(testProps.proxied.state0).toBe(2)
  state1.tap('set', 'string')
  expect(testProps.proxied.state1).toBe('string')
})
