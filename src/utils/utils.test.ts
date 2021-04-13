import { removeTrailingSlash } from './string'

test('removeTrailingSlash', () => {
  expect(removeTrailingSlash('a/b/c/d/')).toStrictEqual('a/b/c/d')
})
