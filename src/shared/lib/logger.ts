const highlight = (color?: string) =>
  `background-color: ${color}; color: ${
    color ? '#000' : '#fff'
  }; padding-left: 4px; padding-right: 4px; font-weight: normal;`

type LoggerMode = 'log' | 'warn' | 'error'

export const createLogger = (isEnabled?: boolean) => {
  return (msg: string, event: string, consoleMethod: LoggerMode = 'log') => {
    if (isEnabled) {
      console[consoleMethod](
        '%ceffector-socket.io' + `%c${msg}` + `%c[${event}]`,
        highlight('#4fb6ed'),
        highlight(),
        'color: #4fedde;'
      )
    }
  }
}
