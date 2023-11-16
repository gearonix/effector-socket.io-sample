import                       './globals.css'

import { clsx }         from 'clsx'

import { Parent }       from './parent'
import { useIsMounted } from './shared/hooks'
import { Icon }         from './shared/ui/icon'

const repoLink = 'https://github.com/gearonix/effector-socket.io'

export const Entrypoint = () => {
  const isMounted = useIsMounted()

  return (
    <>
      <div className={clsx('container', { loaded: isMounted() })}>
        <img src="/src/shared/assets/logo.png" className="logo" />
        <h1 className="title">effector-socket.io</h1>
        <Parent />
      </div>

      <a href={repoLink} target="_blank">
        <Icon
          name="sprite/github-mark"
          style={{ color: '#fff' }}
          className="github-icon"
        />
      </a>
    </>
  )
}
