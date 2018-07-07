import 'mocha'
import * as chai from 'chai'
import { doQuery } from '../doQuery'
import * as jwt from 'jsonwebtoken'
import '../../globalBeforeAfter'

const expect = chai.expect

describe('Auth integration', () => {

  it('Should return correct jwt', async () => {
    const userEmail = 'john.doe@example.com'
    const userPassword = '1111'
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
    const responseToken: string = response.data.data.UserLoginMutation.token

    const decoded = jwt.verify(responseToken, process.env.JWT_SECRET)
    expect(response.status).to.equal(200)
    // @ts-ignore
    expect(decoded.email).to.equal(userEmail)
    // @ts-ignore
    expect(response.data.data.UserLoginMutation.error).to.have.deep.equals(null)
  })

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



