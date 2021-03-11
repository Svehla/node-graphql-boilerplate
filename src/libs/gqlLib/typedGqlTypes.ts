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
import { GraphQLEmail, GraphQLPassword } from 'graphql-custom-types'

// Custom types
export const gtGraphQLEmail = (GraphQLEmail as any) as string | undefined | null

export const gtGraphQLPassword = (...args: ConstructorParameters<typeof GraphQLPassword>) =>
  (new GraphQLPassword(...args) as any) as string

// TODO: add context as global interface to keep update it by anyone?

// i decide to use `gt` prefix => gt === graphqlType
export const gtGraphQLInt = (GraphQLInt as any) as number | undefined | null
export const gtGraphQLID = (GraphQLID as any) as string | undefined | null
export const gtGraphQLString = (GraphQLString as any) as string | undefined | null
export const gtGraphQLBoolean = (GraphQLBoolean as any) as boolean | undefined | null
export const gtGraphQLFloat = (GraphQLFloat as any) as number | undefined | null

type ReturnTypeIfFn<T> = T extends (...args: any[]) => infer Ret ? Ret : T

type MaybePromise<T> = Promise<T> | T

export const gtGraphQLNonNull = <T>(arg: T | null | undefined) =>
  (new GraphQLNonNull(arg as any) as any) as T

export const gtGraphQLList = <T>(arg: T) => (new GraphQLList(arg as any) as any) as T[]

export const gtGraphQLScalarType = <T>(
  config: ConstructorParameters<typeof GraphQLScalarType>[0]
): T =>
  // @ts-expect-error
  new GraphQLScalarType(config)
export const gtGraphQLInputObjectType = <Fields extends Record<string, { type: any }>>(gqlShape: {
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
      context: any
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

export const graphQLObjectType = <Fields extends Record<string, { type: any; args?: any }>>(
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
      context: any
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
    context: any
  ) => Promise<any>
  // ) => Promise<Config['type']>
) => {
  return {
    ...config,
    resolve: (a: undefined, ...rest: Parameters<typeof resolve>) => resolve(...rest),
  }
}

// is used to be resolved by `ReturnTypeIfFn<...>` generic
export const circularDependencyTsHack = <T>(arg: T): T => {
  const shittyCode = arg as any
  return shittyCode()
}