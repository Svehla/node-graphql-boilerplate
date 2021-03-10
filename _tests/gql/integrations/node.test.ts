import * as chai from 'chai'
import { toGlobalId } from 'graphql-relay'
import 'mocha'
import '../../globalBeforeAfter'
import { doQuery } from '../doQuery'
const expect = chai.expect

describe('Posts integration', () => {
  /*--------------------------------------------*/
  /*----------------- queries ------------------*/
  /*--------------------------------------------*/
  it('Should return null for unexisted nodeId', async () => {
    const nodeId = 'XX_fake_XX'
    const query = `
      fragment PostData on Post {
        id
        text
        originalId
      }
      query {
        node(id: "${nodeId}") {
          ...PostData
        }
      }
    `
    const expected = {
      node: null,
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })

  it('Should return null for Unknown node type', async () => {
    const nodeId = 'XX_fake_XX'
    const postId = toGlobalId('Fake', nodeId)
    const query = `
      fragment PostData on Post {
        id
        text
        originalId
      }
      query {
        node(id: "${postId}") {
          ...PostData
        }
      }
    `
    const expected = {
      node: null,
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })

  it('Should return null for valid node but bad tableId', async () => {
    const postOriginaId = '900000000'
    const postId = toGlobalId('Post', postOriginaId)
    const query = `
      fragment PostData on Post {
        id
        text
        originalId
      }
      query {
        node(id: "${postId}") {
          ...PostData
        }
      }
    `
    const expected = {
      node: null,
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })
})
