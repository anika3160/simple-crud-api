import { beforeAll, describe, expect, test } from '@jest/globals'
import request from 'supertest'
import { updateUsersData } from '../modules/db/db.js'
import createUsersServer from '../modules/servers/users.js'
import { BASE_USERS_URL } from '../types/constants.js'

const server = createUsersServer()

const user = {
  username: 'Anna',
  age: 27,
  hobbies: ['ski', 'codding'],
}

beforeAll(async () => {
  await updateUsersData([])
});

describe('POST/api/users', () => {
  describe('given a user data', () => {
    test('should respond with a 201 status code', async () => {
      const response = await request(server).post(BASE_USERS_URL).send(user)
      expect(response.statusCode).toBe(201)
    })
    test('should specify json in the content type header', async () => {
      const response = await request(server).post(BASE_USERS_URL).send(user)
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    test('response has id', async () => {
      const response = await request(server).post(BASE_USERS_URL).send(user)
      expect(response.body.id).toBeDefined()
    })
  })

  describe('when the data is missing', () => {
    test('should respond with a status code of 400', async () => {
      const bodyData = [
        {
          username: 'Anna',
          age: 27,
        },
        {
          username: 'Anna',
          hobbies: ['ski', 'codding'],
        },
        {
          age: 27,
          hobbies: ['ski', 'codding'],
        },
        {},
      ]
      for (const body of bodyData) {
        const response = await request(server).post(BASE_USERS_URL).send(body)
        expect(response.statusCode).toBe(400)
      }
    })
  })

  describe('when the data is missing', () => {
    test('should respond with a status code of 400', async () => {
      const bodyData = [
        {
          username: 'Anna',
          age: 27,
        },
        {
          username: 'Anna',
          hobbies: ['ski', 'codding'],
        },
        {
          age: 27,
          hobbies: ['ski', 'codding'],
        },
        {},
      ]
      for (const body of bodyData) {
        const response = await request(server).post(BASE_USERS_URL).send(body)
        expect(response.statusCode).toBe(400)
      }
    })
  })
  
})