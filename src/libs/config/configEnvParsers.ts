import { existsSync, readFileSync } from 'fs'

export class ValidationError extends Error {
  constructor(msg: string, envName?: string) {
    const fullMsg = envName
      ? `${msg}, current value of '${envName}' is '${process.env[envName]}'`
      : msg
    super(fullMsg)
  }
}

export const getNumberFromEnvParser = (envName: string) => () => {
  const envValue = process.env[envName]?.trim()
  const parsedInt = parseFloat(envValue ?? '')
  if (isNaN(parsedInt)) {
    throw new ValidationError('Value is not parsable as integer', envName)
  }
  return parsedInt
}

const defaultTransformFn = (value: string) => value

export const getStringFromEnvParser = (
  envName: string,
  transform = defaultTransformFn,
  allowEmptyString = false
) => () => {
  const envValue = process.env[envName]?.trim()
  if (envValue === undefined || (!allowEmptyString && envValue.length === 0)) {
    throw new ValidationError('Value is not set or it is empty string', envName)
  }
  return transform(envValue)
}

export const getStringEnumFromEnvParser = <T extends string>(
  envName: string,
  possibleEnumValues: T[] | readonly T[]
) => (): T => {
  const envValue = process.env[envName]?.trim() as T
  if (envValue === undefined || envValue.length === 0 || !possibleEnumValues.includes(envValue)) {
    throw new ValidationError(
      `Value does not match union: ${possibleEnumValues.join(' | ')}, or it is empty string`,
      envName
    )
  }
  return envValue
}

export const getBoolFromEnvParser = (envName: string) => () => {
  const envValue = process.env[envName]?.trim()
  if (envValue === 'true') {
    return true
  }
  if (envValue === 'false') {
    return false
  }
  throw new ValidationError('Value is not parsable as boolean', envName)
}

export const getSecretFromEnvFileParser = (envName: string, required = true) => () => {
  const envValue = process.env[envName]?.trim()
  if (!envValue || envValue.length === 0 || !existsSync(envValue)) {
    if (!required) {
      return ''
    }
    throw new ValidationError(`There is no file path stored in ${envName}`, envName)
  }
  return readFileSync(envValue, 'utf-8').trim()
}

// this is just for obtaining static value which are not provided by env, there are only few of them
export const getIdentityFn = <T extends string | number | boolean>(staticValue: T) => () =>
  staticValue

export type EnvParserGetter =
  | ReturnType<typeof getNumberFromEnvParser>
  | ReturnType<typeof getStringFromEnvParser>
  | ReturnType<typeof getBoolFromEnvParser>
  | ReturnType<typeof getSecretFromEnvFileParser>
  | ReturnType<typeof getIdentityFn>
  | ReturnType<typeof getStringEnumFromEnvParser>
