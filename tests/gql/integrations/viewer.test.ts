import 'mocha'
import * as chai from 'chai'
import { doQuery } from '../doQuery'
import { toGlobalId } from 'graphql-relay'
import '../../globalBeforeAfter'
import { getJwtToken } from '../../utils'

const expect = chai.expect

describe('Viewer integration', () => {
  it('Should return unlogged user', async () => {
    const query = `
      {
        viewer {
          id
          name
        }
      }
    `
    const expected = {
      viewer: null,
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })

  it('Should return logged John Doe', async () => {
    const johnDoeJwt = getJwtToken('1', 'john.doe@example.com')
    const query = `
      {
        viewer {
          id
          originalId
          name
          email
        }
      }
    `
    const expected = {
      viewer: {
        id: toGlobalId('User', '1'),
        originalId: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    }
    const response = await doQuery(query, johnDoeJwt)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })

  it('Should return logged John Smith', async () => {
    const johnSmithJwt = getJwtToken('2', 'john.smith@example.com')
    const query = `
      {
        viewer {
          id
          originalId
          name
          email
        }
      }
    `
    const expected = {
      viewer: {
        id: toGlobalId('User', '2'),
        originalId: '2',
        name: 'John Smith',
        email: 'john.smith@example.com',
      },
    }
    const response = await doQuery(query, johnSmithJwt)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })
})
