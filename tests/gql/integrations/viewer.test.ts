import * as chai from 'chai'
import 'mocha'
import '../../globalBeforeAfter'
import { doQuery } from '../doQuery'

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
})
