import 'mocha'
import * as chai from 'chai'
import { toGlobalId } from 'graphql-relay'
import { doQuery } from '../doQuery'
import '../../globalBeforeAfter'
import loadData from '../../../scripts/loadDataFn'
import { getJwtToken } from '../../utils'
const expect = chai.expect

const JOHN_DOE_JWT = getJwtToken('1', 'john.doe@example.com')

describe('Posts integration', () => {
  /*--------------------------------------------*/
  /*----------------- queries ------------------*/
  /*--------------------------------------------*/

  it('Should return all available posts', async () => {
    const query = `
      query {
        posts(first: 2) {
          totalCount
          edges {
            node {
              id
              originalId
              text
              author {
                originalId
                name
                email
                posts {
                  totalCount
                }
              }
            }
          }
        }
      }
    `
    const expected = {
      posts: {
        totalCount: 4,
        edges: [
          {
            node: {
              id: 'UG9zdDox',
              originalId: '1',
              text: 'Hallo, this is my first status11',
              author: {
                originalId: '1',
                email: 'john.doe@example.com',
                name: 'John Doe',
                posts: {
                  totalCount: 2,
                },
              },
            },
          },
          {
            node: {
              id: 'UG9zdDoy',
              originalId: '2',
              text: 'Wow this is awesome app',
              author: {
                originalId: '2',
                email: 'john.smith@example.com',
                name: 'John Smith',
                posts: {
                  totalCount: 2,
                },
              },
            },
          },
        ],
      },
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })


  it('Should return post by id', async () => {
    const postOriginalId = '3'
    const postId = toGlobalId('Post', postOriginalId)
    const query = `
      fragment PostData on Post {
        id
        text
        originalId
      }
      query {
        somePost: node(id: "${postId}") {
          ...PostData
        }
      }
    `
    const expected = {
      somePost: {
        id: postId,
        text: 'Hallo, this is my second status',
        originalId: postOriginalId
      },
    }
    const response = await doQuery(query)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)
  })

  it('Should create post without login', async () => {
    const newPost = {
      text: 'another post',
      originalId: '5',
    }

    const createPostMutation = `
      mutation CreatePostMutation {
        CreatePostMutation(input: {
          text: "${newPost.text}",
        }) {
          createdPost {
            text
            id
            originalId
          }
          error
        }
      }
    `

    const expectedResultPostMutation = {
      CreatePostMutation: {
        createdPost: null,
        error: 'USER_IS_NOT_LOGGED',
      },
    }
    const createPostResponse = await doQuery(createPostMutation, 'fake-jwt')
    expect(createPostResponse.status).to.equal(200)
    expect(createPostResponse.data.data).to.have.deep.equals(expectedResultPostMutation)
  })


  /*--------------------------------------------*/
  /*---------------- mutations -----------------*/
  /*--------------------------------------------*/

  it('Should Create post', async () => {
    const newPost = {
      text: 'hi',
      originalId: '5',
    }

    const createPostMutation = `
      mutation CreatePostMutation {
        CreatePostMutation(input: {
          text: "${newPost.text}",
        }) {
          createdPost {
            text
            id
            originalId
          }
          error
        }
      }
    `
    const createdPost = {
      ...newPost,
      id: 'UG9zdDo1',
    }
    const expectedResultPostMutation = {
      CreatePostMutation: {
        createdPost,
        error: null,
      },
    }
    const createPostResponse = await doQuery(createPostMutation, JOHN_DOE_JWT)
    expect(createPostResponse.status).to.equal(200)
    expect(createPostResponse.data.data).to.have.deep.equals(expectedResultPostMutation)


    const getByIdQuery = `
      fragment PostData on Post {
        id
        text
        originalId
      }

      query {
        node(id: "UG9zdDo1") {
          ...PostData
        }
      }
    `
    const expected = {
      node: createdPost,
    }
    const response = await doQuery(getByIdQuery)
    expect(response.status).to.equal(200)
    expect(response.data.data).to.have.deep.equals(expected)

    // reset mutation of data
    await loadData()
  })

})
