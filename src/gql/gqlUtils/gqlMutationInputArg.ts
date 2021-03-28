import { tgGraphQLInputObjectType, tgGraphQLNonNull } from '../../libs/typedGraphQL/index'

export const gqlMutationInputArg = <T extends Record<string, { type: any }>>(
  name: string,
  fields: T
) => ({
  input: {
    type: tgGraphQLNonNull(
      tgGraphQLInputObjectType({
        name: `${name}_input_arg`,
        fields: () => fields,
      })
    ),
  },
})
