
export const asyncAwait = (closure: () => void) => {
  (async () => {
    await closure()
  })()
}

export function makeLoggerId(): number {
  return Math.floor(Math.random() * 100000)
}

export function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}