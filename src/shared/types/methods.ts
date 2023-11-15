import { createPublisher }  from '../../publisher'
import { createSubscriber } from '../../subscribe'

export type Subscriber<Methods extends Record<string, string>> = ReturnType<
  typeof createSubscriber<Methods>
>

export type Publisher<Methods extends Record<string, string>> = ReturnType<
  typeof createPublisher<Methods>
>