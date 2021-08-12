export const key =
  <T extends KeyboardEvent>(key: string | string[], cb?: (event: T) => void) =>
  (event: T) =>
    (typeof key === 'string' ? event.key === key : key.includes(event.key)) && cb?.(event)

export const prevent =
  <T extends Event>(cb?: (event: T) => void) =>
  (event: T) => {
    event.preventDefault()
    cb?.(event)
  }
export const stop =
  <T extends Event>(cb?: (event: T) => void) =>
  (event: T) => {
    event.stopPropagation()
    cb?.(event)
  }

export const group =
  <T extends Event>(...args: ((event: T) => void)[]) =>
  (event: T) =>
    args.map(arg => arg(event))
