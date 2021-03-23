import { gtGraphQLInputObjectType, gtGraphQLNonNull } from '../../libs/gqlLib/typedGqlTypes'

export const gqlMutationInputArg = <T extends Record<string, { type: any }>>(
  name: string,
  fields: T
) => ({
  input: {
    type: gtGraphQLNonNull(
      gtGraphQLInputObjectType({
        name: `${name}_input_arg`,
        fields: () => fields,
      })
    ),
  },
})
