import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { IPCMessageType } from '../../types/constants.js'
import read from './read.js'
import { isValidAge, isValidHobbies, isValidUsername } from './validators.js'
import write from './write.js'
import { IUser } from '../../types/constants.js'

const useMemory = process.env.USE_INMEMORY_DB === 'true'
let memoryUsers: IUser[] = []
const isClusterWorker = !!process.send

function getUsersIPC(): Promise<IUser[]> {
  return new Promise((resolve) => {
    process.send?.({ type: IPCMessageType.GetUsers })
    const handler = (msg: any) => {
      if (msg.type === 'users') {
        process.off('message', handler)
        resolve(msg.users)
      }
    }
    process.on('message', handler)
  })
}

function setUsersIPC(users: IUser[]): void {
  process.send?.({ type: 'setUsers', users })
}

export const getUserById = (id: string, users: IUser[]): IUser | undefined =>
  users.find((user) => user.id === id)

export const createOrUpdateUser = (username: string, age: number, hobbies: string[], id?: string): IUser => {
  if ((!id || uuidValidate(id)) && isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id: id ? id : uuidv4(), username, age, hobbies }
  }
  throw new Error('Incorrect data. Please try again with correct data.')
}

export const getListOfUsers = async () => {
  if (useMemory) {
    if (isClusterWorker) {
      return await getUsersIPC()
    }
    return memoryUsers
  }
  const data: string = await read()
  const users: IUser[] = JSON.parse(data).users
  return users
}

export const updateUsersData = async (users: IUser[]) => {
  if (useMemory) {
    if (isClusterWorker) {
      setUsersIPC(users)
      return
    }
    memoryUsers.length = 0
    memoryUsers.push(...JSON.parse(JSON.stringify(users)))
    return
  }
  await write(JSON.stringify({ users }))
}