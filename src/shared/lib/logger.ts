const highlight = (color?: string) =>
  `background-color: ${color}; color: ${
    color ? '#000' : '#fff'
  }; padding-left: 4px; padding-right: 4px; font-weight: normal;`

export const createLogger = (isEnabled?: boolean) => {
  return (msg: string, method = 'method') => {
    if (isEnabled) {
      console.log(
        '%ceffector-socket.io' + `%c${msg}` + `%c[${method}]`,
        highlight('#4fb6ed'),
        highlight(),
        'color: #4fedde;'
      )
    }
  }
}
