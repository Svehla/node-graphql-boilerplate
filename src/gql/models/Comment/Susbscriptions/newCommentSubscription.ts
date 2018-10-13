import { GraphQLID, GraphQLInputObjectType } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
import { withFilter } from 'graphql-subscriptions'
import { isNilOrEmpty } from 'ramda-adjunct'
import pubsub from '../../../publicSubscription'
import CommentType from '../CommentType'

export enum SubsTypes {
  NewComment = 'NewComment',
}

const NewCommentSubscriptionInput = new GraphQLInputObjectType({
  name: 'NewCommentSubscriptionInput',
  description: ``,
  fields: {
    reportId: {
      type: GraphQLID
    }
  }
})


export default {
  // auth stuffs
  newComment: {
    type: CommentType,
    args: {
      input: {
        type: NewCommentSubscriptionInput
      }
    },
    // resolve have to be there... dont know why yet
    resolve: data => data,
    subscribe: withFilter(
      () => pubsub.asyncIterator(SubsTypes.NewComment), (payload, variables = {}, context) => {
        // TODO: can't add context in playground and test subscription without frontend
        // disable auth for dev env?
        if (isNilOrEmpty(context.user)) {
          return false
        }
        const globalReportId = variables.input && variables.input.reportId
        const reportId = Number(fromGlobalId(globalReportId).id)
        return payload.report_id === reportId
      }
    ),
  }
}
