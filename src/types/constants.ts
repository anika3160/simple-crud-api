export interface IUser {
  readonly id: string
  username: string
  age: number
  hobbies: string[]
}

export enum IPCMessageType {
  GetUsers = 'getUsers',
  SetUsers = 'setUsers'
}

export enum ContentType {
  text = 'text/html',
  json = 'application/json',
}

export enum Method {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

export const BASE_USERS_URL = '/api/users';