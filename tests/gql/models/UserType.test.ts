import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'
import * as chai from 'chai'
import 'mocha'
import UserType from '../../../src/gql/models/User/UserType'
import '../../globalBeforeAfter'
const expect = chai.expect

describe('Post type specification', () => {
  it('Should have an `id` field of type ID', () => {
    expect(UserType.getFields()).to.have.property('id')
    expect(UserType.getFields().id.type).to.deep.equals(new GraphQLNonNull(GraphQLID))
  })
})
