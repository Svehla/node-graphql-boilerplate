import * as chai from 'chai'
import 'mocha'
import '../../globalBeforeAfter'
import { doQuery } from '../doQuery'

const expect = chai.expect

describe('Auth integration', () => {
  it('Should return error for invalid login', async () => {
    const userEmail = 'invalid@invalid.com'
    const userPassword = 'invalidPwd'
    const query = `
      mutation UserLoginMutation {
        UserLoginMutation(input: {
          email: "${userEmail}",
          password: "${userPassword}"
        }) {
          token
          error
        }
      }
    `

    const response = await doQuery(query)
    expect(response.data.data.UserLoginMutation.token).to.have.deep.equals(null)
    expect(response.data.data.UserLoginMutation.error).to.have.deep.equals('INVALID_CREDENTIALS')
  })
})



