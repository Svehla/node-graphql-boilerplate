import { EnvParserGetter } from './configEnvParsers'

interface ConfigValidators {
  [Key: string]: ConfigValidators | EnvParserGetter
}

interface RawValidatedConfig {
  [Key: string]: RawValidatedConfig | ReturnType<EnvParserGetter>
}

// crafted with love by Jakub Svehla
type AppConfig<C> = C extends (...args: any[]) => infer Res
  ? Res
  : C extends Record<any, any>
  ? {
      [K in keyof C]: AppConfig<C[K]>
    }
  : C

export const validateConfig = <T extends ConfigValidators>(configValidators: T) => {
  const errors: Array<[string, Error]> = []

  const validateRecursively = (innerConfigValidators: ConfigValidators, path: string[] = []) => {
    const result: RawValidatedConfig = {}
    Object.entries(innerConfigValidators).forEach(([configKey, validatorOrNested]) => {
      const newPath = [...path, configKey]
      if (typeof validatorOrNested === 'object') {
        result[configKey] = validateRecursively(validatorOrNested, newPath)
      } else {
        try {
          result[configKey] = validatorOrNested()
        } catch (e) {
          errors.push([newPath.join('.'), e])
        }
      }
    })
    return result
  }

  const validatedConfig = validateRecursively(configValidators)

  if (errors.length > 0) {
    const aggregatedErrorMsg = errors.map(([path, error]) => `'${path}': ${error}`).join('\n')
    console.error(aggregatedErrorMsg)
    throw new Error(aggregatedErrorMsg)
  }

  return validatedConfig as AppConfig<T>
}
