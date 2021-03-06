import { Request, Response } from 'express'
import { appConfig, appEnvs } from '../../appConfig'
import axios from 'axios'

export const verifyEmailRestGqlProxy = async (req: Request, res: Response) => {
  try {
    const gqlRes = await axios.post(appConfig.localGqlEndpoint, {
      query: `
      mutation verifyUserEmailMutation(
        $verifyUserInput: Verify_user_input_mutation!
      ) {
        verifyUserEmailMutation(input: $verifyUserInput) {
          isTokenVerified
        }
      }
    `,
      variables: {
        verifyUserInput: { verifyToken: req.params.token },
      },
    })

    const isTokenVerified = gqlRes.data.data?.verifyUserEmailMutation?.isTokenVerified

    if (isTokenVerified) {
      res.redirect(`${appEnvs.adminService.URL}/playground`)
    } else {
      res.send('token is not valid')
    }
  } catch (err) {
    console.error(err)
    res.send(err)
  }
}
