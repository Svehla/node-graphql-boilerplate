import { ValidationError } from 'typed-env-parser'

export const getListFromEnvParser = <T>(
  envName: string,
  valueParser: (arg: any) => T
) => (): T[] => {
  const envValue = process.env[envName]?.trim()
  const parsedArr = JSON.parse(envValue ?? '')
  if (!Array.isArray(parsedArr)) {
    throw new ValidationError('Passed value is not array', envName)
  }
  return parsedArr.map(i => valueParser(i))
}
