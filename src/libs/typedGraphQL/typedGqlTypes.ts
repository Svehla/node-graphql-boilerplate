import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import {
  GraphQLDateTime,
  GraphQLEmail,
  GraphQLLimitedString,
  GraphQLPassword,
  GraphQLUUID,
} from 'graphql-custom-types'

import { GqlContext as GqlC } from '../../utils/GqlContextType'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// TODO:
// > move context type definition out of library
// > https://www.typescriptlang.org/docs/handbook/declaration-merging.html
type GqlContext = GqlC

// Custom types
export const tgGraphQLEmail = (GraphQLEmail as any) as string | undefined | null
export const tgGraphQLDateTime = (GraphQLDateTime as any) as string | undefined | null
export const tgGraphQLUUID = (GraphQLUUID as any) as string | undefined | null

// TODO: GraphQL UUID vs ID type

export const tgGraphQLPassword = (...args: ConstructorParameters<typeof GraphQLPassword>) =>
  // TODO: | null | undefined?
  (new GraphQLPassword(...args) as any) as string

export const tgGraphQLLimitedString = (
  ...args: ConstructorParameters<typeof GraphQLLimitedString>
) =>
  // TODO: | null | undefined?
  (new GraphQLLimitedString(...args) as any) as string

// i decide to use `gt` prefix => gt === graphqlType
export const tgGraphQLInt = (GraphQLInt as any) as number | undefined | null
export const tgGraphQLID = (GraphQLID as any) as string | undefined | null
export const tgGraphQLString = (GraphQLString as any) as string | undefined | null
export const tgGraphQLBoolean = (GraphQLBoolean as any) as boolean | undefined | null
export const tgGraphQLFloat = (GraphQLFloat as any) as number | undefined | null

type ReturnTypeIfFn<T> = T extends (...args: any[]) => infer Ret ? Ret : T

type MaybePromise<T> = Promise<T> | T

export const tgGraphQLNonNull = <T>(arg: T | null | undefined) =>
  (new GraphQLNonNull(arg as any) as any) as T

export const tgGraphQLList = <T>(arg: T) => (new GraphQLList(arg as any) as any) as T[]

export const tgGraphQLScalarType = <T>(
  config: ConstructorParameters<typeof GraphQLScalarType>[0]
): T =>
  // @ts-expect-error
  new GraphQLScalarType(config)

export const tgGraphQLInputObjectType = <Fields extends Record<string, { type: any }>>(gqlShape: {
  name: string
  fields: () => Fields
}): { [FieldKey in keyof Fields]: ReturnTypeIfFn<Fields[FieldKey]['type']> } | undefined =>
  // @ts-expect-error
  new GraphQLInputObjectType(gqlShape)

export const graphqlSubQueryType = <Fields extends Record<string, { type: any; args?: any }>>(
  gqlFields: Fields,
  resolvers: {
    [FieldKey in keyof Fields]: (
      args: {
        [ArgKey in keyof Fields[FieldKey]['args']]: Fields[FieldKey]['args'][ArgKey]['type']
      },
      context: GqlContext
    ) => MaybePromise<any>
    // ) => MaybePromise<Fields[FieldKey]['type']>
  }
) => {
  const fieldsWithResolvers: Record<string, any> = {}

  for (const key in gqlFields) {
    fieldsWithResolvers[key] = {
      ...gqlFields[key],
      resolve: (_parent: any, args: any, context: any) => resolvers?.[key]?.(args, context),
    }
  }

  return fieldsWithResolvers as any
}

// TODO: check validity of this type
// type HackToOmitFnCircularDepType<T> = T extends (...args: any[]) => any ? any : T

export const tgGraphQLObjectType = <Fields extends Record<string, { type: any; args?: any }>>(
  gqlShape: {
    name: string
    interfaces?: any[]
    isTypeOf?: any
    fields: () => Fields
  },
  resolvers?: {
    [FieldKey in keyof Fields]?: (
      parent: {
        [NestedKey in keyof Fields]?: ReturnTypeIfFn<Fields[NestedKey]['type']>
      },
      args: {
        [ArgKey in keyof Fields[FieldKey]['args']]: ReturnTypeIfFn<
          Fields[FieldKey]['args'][ArgKey]['type']
        >
      },
      context: GqlContext
    ) => MaybePromise<any>
    // ) => MaybePromise<HackToOmitFnCircularDepType<Fields[FieldKey]['type']>>
  },
  opts?: { globalResolverDecorator?: (...args: any[]) => any }
): { [FieldKey in keyof Fields]?: ReturnTypeIfFn<Fields[FieldKey]['type']> } | undefined => {
  const gqlObject = new GraphQLObjectType({
    ...gqlShape,
    fields: () => {
      const fieldsWithResolvers: Record<string, any> = {}

      const gqlFields = gqlShape.fields()

      for (const key in gqlFields) {
        fieldsWithResolvers[key] = {
          ...gqlFields[key],
          resolve: opts?.globalResolverDecorator
            ? opts.globalResolverDecorator(resolvers?.[key] ?? ((parent: any) => parent[key]))
            : resolvers?.[key],
        }
      }

      return fieldsWithResolvers
    },
  }) as any

  return gqlObject
}

// ------------- enums -------------
export const graphQLSimpleEnum = <T extends string>(
  typeName: string,
  _possibleValues: Record<T, any>
) => {
  const simplifiedObj = Object.fromEntries(
    Object.entries(_possibleValues).map(([k, value]) => [k, { value }])
  ) as {
    [K in T]: { value: K }
  }

  return graphQLEnumType(typeName, simplifiedObj)
}

export const graphQLEnumType = <T extends string>(
  name: string,
  values: Record<T, { value: any }>
): T | undefined =>
  // @ts-expect-error
  new GraphQLEnumType({
    name,
    values,
  })

// mutations

export const gqlMutation = <
  Config extends {
    type: any
    args: Record<string, { type: any }>
  }
>(
  config: Config,
  resolve: (
    args: { [ArgKey in keyof Config['args']]: Config['args'][ArgKey]['type'] },
    context: GqlContext
  ) => Promise<any>
  // ) => Promise<Config['type']>
) => {
  return {
    ...config,
    resolve: (a: undefined, ...rest: Parameters<typeof resolve>) => resolve(...rest),
  }
}

// is used to be resolved by `ReturnTypeIfFn<...>` generic
export const lazyCircularDependencyTsHack = <T>(arg: T): T => {
  const shittyCode = arg as any
  return shittyCode()
}
