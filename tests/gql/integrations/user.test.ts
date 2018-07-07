import 'mocha'
import * as chai from 'chai'
import { doQuery } from '../doQuery'
import { toGlobalId } from 'graphql-relay'
import '../../globalBeforeAfter'

const expect = chai.expect

describe('Posts integration', () => {
  it('Should return user by id', async () => {
    const userOriginalId = '1'
    const userId = toGlobalId('User', userOriginalId)
    const query = `
      fragment UserData on User {
        id
        email
        name
        originalId
        posts {
          totalCount
        }
      }

      query {
        someUser: node(id: "${userId}") {
          ...UserData
        }
      }
    `
    const expected = {
      someUser: {
        id: userId,
        originalId: userOriginalId,
        email: 'john.doe@example.com',
        name: 'John Doe',
        posts: {
          totalCount: 2
        }
      },
    }

    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })
})



