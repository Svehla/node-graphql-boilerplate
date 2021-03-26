import { LessThan, getRepository } from 'typeorm'
import {
  tgGraphQLBoolean,
  tgGraphQLInt,
  tgGraphQLList,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const cursorPaginationArgs = () => ({
  first: {
    // TODO: add positive integer custom scalar type
    type: tgGraphQLNonNull(tgGraphQLInt),
  },
  after: {
    type: tgGraphQLString,
  },
  // TODO: add forward pagination
  // last: {
  //   type: tgGraphQLInt,
  // },
  // before: {
  //   type: tgGraphQLString,
  // },
})

export const cursorPaginationList = <T>(name: string, type: T) =>
  tgGraphQLObjectType({
    name: `cursor_connection_${name}`,
    fields: () => ({
      pageInfo: {
        type: tgGraphQLObjectType({
          name: `cursor_connection_${name}_page_info`,
          fields: () => ({
            hasNextPage: {
              type: tgGraphQLBoolean,
            },
            startCursor: {
              type: tgGraphQLString,
            },
            // TODO: add forward pagination
            // hasPreviousPage: {
            //   type: tgGraphQLBoolean,
            // },
            // endCursor: {
            //   type: tgGraphQLString,
            // },
            // totalCount: {
            //   type: tgGraphQLInt,
            // },
          }),
        }),
      },
      edges: {
        type: tgGraphQLList(
          tgGraphQLObjectType({
            name: `cursor_connection_${name}_edges`,
            fields: () => ({
              cursor: {
                type: tgGraphQLString,
              },
              node: {
                type: type,
              },
            }),
          })
        ),
      },
    }),
  })

const removeLastItem = <T>(arr: T[]) => {
  const newArr = [...arr]
  newArr.pop()
  return newArr
}
/**
 *
 * inspiration:
 * https://github.com/graphql/graphql-relay-js/issues/94#issuecomment-232410564
 */
export const getSelectAllDataWithCursorByCreatedAt = async (
  entity: any,
  args: { first: number; after: string | null | undefined },
  extraWhere: Record<string, any> = {}
) => {
  const repository = getRepository(entity)

  let afterNodeDate = undefined as Date | undefined

  // should cursor be `createdAt`? rounded to milliseconds
  if (args.after) {
    // TODO: add opaque abstraction??? :thinking-face:
    const afterItem = await repository.findOne({ where: { id: args.after } })

    if (!afterItem) {
      throw new Error(`cursor item "${args.after}" does not exists`)
    }
    // JS Date vs Postgres Date round shit behavior
    // @ ts-expect-error
    // afterItem!.createdAt.setMilliseconds(afterItem!.createdAt.getMilliseconds() + 100)
    // do i need to string?
    // @ts-expect-error
    afterNodeDate = afterItem?.createdAt // .toString()
  }

  const take = args.first + 1

  const posts: any[] = await repository.find({
    skip: 0,
    take,
    where: {
      ...extraWhere,

      ...(afterNodeDate
        ? { createdAt: LessThan(afterNodeDate) } //.toISOString()),
        : {}),
    },
    order: {
      createdAt: 'DESC',
    },
  })

  const hasNextPage = posts.length === take

  return {
    pageInfo: {
      hasNextPage,
    },
    edges: removeLastItem(posts).map(i => ({
      cursor: i.id,
      node: i,
    })),
  }
}
