import axios from 'axios'

export const doQuery = (query: string, token?: string) => {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
  return axios({
    // TODO: add env variables
    url: `http://localhost:3020/graphql`,
    method: 'post',
    headers: {
      // ...authHeaders,
      ...authHeaders,
      'Content-Type': 'application/graphql',
    },
    data: query,
  })
}
