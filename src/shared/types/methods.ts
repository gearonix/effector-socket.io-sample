import { publisherMapper } from '../../publisher'
import { subscriberMapper } from '../../subscribe'

export type Subscriber<Methods extends Record<string, string>> = ReturnType<
  typeof subscriberMapper<Methods>
>

export type Publisher<Methods extends Record<string, string>> = ReturnType<
  typeof publisherMapper<Methods>
>

export type Restore<Methods extends Record<string, string>> = ReturnType<
  typeof subscriberMapper<Methods, 'restore'>
>

export type Event<Methods extends Record<string, string>> = ReturnType<
  typeof subscriberMapper<Methods, 'event'>
>
