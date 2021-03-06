import { In, getRepository } from 'typeorm'
import { entities } from '../database/entities'
import DataLoader from 'dataloader'

// TODO: check if batching works correctly
const getUsers = async (ids: number[]) => {
  const foundUsers = await getRepository(entities.User).find({
    where: { id: In(ids) },
    order: { createdAt: 'ASC' },
  })

  // console.info('call to database! ', ids)
  return ids.map(id => foundUsers.find(i => i.id === id))
}

export const getDataLoaders = () => ({
  user: new DataLoader((ids: any) => getUsers(ids)),
})
