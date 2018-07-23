// ---------------------------------
// -------- global err defs --------
// ---------------------------------
export const INVALID_CREDENTIALS = `INVALID_CREDENTIALS`
export const USER_IS_NOT_LOGGED = `USER_IS_NOT_LOGGED`

export enum OrderByPostKey {
  CreatedAt = 'CreatedAt',
  Text = 'Text',
}

export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Author = 'Author',
  Contributor = 'Contributor',
  Subscriber = 'Subscriber',
}
