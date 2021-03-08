export const notNullable = <T>(x: T | null | undefined | false): x is T =>
  x !== undefined && x !== null && x !== false
