
import * as jwt from 'jsonwebtoken'

export const getJwtToken = (id: string, email: string): string => (
  jwt.sign({ id, email }, process.env.JWT_SECRET)
)
