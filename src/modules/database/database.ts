import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { isValidUsername, isValidAge, isValidHobbies } from './validators.js'
import read from './read.js'
import write from './write.js'

export interface IUser {
  readonly id: string
  username: string
  age: number
  hobbies: string[]
}

const useMemory = process.env.USE_INMEMORY_DB === 'true'
let memoryUsers: IUser[] = []

export const getUserById = (id: string, users: IUser[]): IUser | undefined =>
  users.find((user) => user.id === id)

export const createOrUpdateUser = (username: string, age: number, hobbies: string[], id?: string): IUser => {
  if ((!id || uuidValidate(id)) && isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id: id ? id : uuidv4(), username, age, hobbies }
  }
  throw new Error('Incorrect data. Please try again with correct data.')
}

export const getListOfUsers = async () => {
  if (useMemory) return memoryUsers
  const data: string = await read()
  const users: IUser[] = JSON.parse(data).users
  return users
}

export const updateUsersData = async (users: IUser[]) => {
  if (useMemory) {
    memoryUsers.length = 0
    memoryUsers.push(...users)
    return
  }
  await write(JSON.stringify({ users }))
}