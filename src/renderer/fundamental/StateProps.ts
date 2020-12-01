import Aqua from 'r/fundamental/aqua'
import { States } from 'r/states'
import ReactiveObj from 'r/fundamental/ReactiveObj'

export default class StateProps extends ReactiveObj {
  bindToStates(states: States): void {
    Object.entries(this.proxied).forEach(([key]) => {
      if (states[key] instanceof Aqua) {
        states[key].hook(this.proxied, key)
      }
    })
  }
}
