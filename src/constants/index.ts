// ---------------------------------
// -------- global err defs --------
// ---------------------------------
export const INVALID_CREDENTIALS = `INVALID_CREDENTIALS`
export const USER_IS_NOT_LOGGED = `USER_IS_NOT_LOGGED`
export const USER_NOT_FOUND = `USER_NOT_FOUND`
export const POST_NOT_FOUND = `POST_NOT_FOUND`

export enum OrderByPostKey {
  CreatedAt = 'CreatedAt',
  Text = 'Text',
} 

export enum OrderByUserKey {
  CreatedAt = 'CreatedAt',
  Name = 'Name',
  Role = 'Role',
  Email = 'Email'
}

export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Author = 'Author',
  Contributor = 'Contributor',
  Subscriber = 'Subscriber',
}
