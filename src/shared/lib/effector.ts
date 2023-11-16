import { createEvent } from 'effector'
import { createStore } from 'effector'

export const createArrayStore = <P>() => {
  const add = createEvent<P>()
  const reset = createEvent()

  const $items = createStore<P[]>([])
    .on(add, (s, item) => [...s, item])
    .reset(reset)

  return {
    $items,
    add,
    reset
  }
}
