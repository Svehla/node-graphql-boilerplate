import { AuthRequest } from '../auth/authAbstraction'
import { Response } from 'express'
import { getDataLoaders } from '../dataLoader/dataLoaderMiddleware'

export interface GqlContext {
  req: AuthRequest
  res: Response
  dataLoaders: ReturnType<typeof getDataLoaders>
}
