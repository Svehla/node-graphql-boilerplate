import { AuthRequest } from '../auth/authAbstraction'
import { Response } from 'express'
import { getDataLoaders } from './dataLoaderCache'

export interface GqlContext {
  req: AuthRequest
  res: Response
  dataLoaders: ReturnType<typeof getDataLoaders>
}
