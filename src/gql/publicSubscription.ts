// GraphQL subscriptions is a simple npm package that lets
// you wireup GraphQL with a pubsub system (like Redis) to implement subscriptions in GraphQL.
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export default pubsub
