import fetch from 'node-fetch'

interface IConfig {
  variables: object | undefined
}
const HTTP_API_URL = `http://localhost:${process.env.PORT}/graphql`
export const doQuery = async (
  query: string,
  token?: string,
  config?: IConfig
) => {
  const variables = config && config.variables
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(HTTP_API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      query,
      ...(variables ? { variables } : {}),
    })
  })
  const data = await response.json()
  return {
    status: response.status,
    data
  }
}
