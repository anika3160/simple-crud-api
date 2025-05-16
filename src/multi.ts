import * as dotenv from 'dotenv'
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'
import { IUser } from './types/constants.js'
import createProxyServer from './modules/servers/proxy.js'
import createUsersServer from './modules/servers/users.js'
import { IPCMessageType } from './types/constants.js'

dotenv.config()
const PORT: number = Number(process.env.PORT) || 3000
const numCPUs: number = os.cpus().length
let users: IUser[] = []

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork()

    worker.on('message', (msg) => {
      if (msg.type === IPCMessageType.GetUsers) {
        worker.send({ type: IPCMessageType.SetUsers, users })
      }
      if (msg.type === IPCMessageType.SetUsers) {
        users = msg.users
      }
    })
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
  })

  const proxy = createProxyServer(PORT, numCPUs)
  proxy.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`)
  })
} else {
  const id = Number(cluster?.worker?.id)
  const workerPort: number = PORT + id
  const usersServer = createUsersServer()
  usersServer.listen(workerPort, () => {
    console.log(`Server is running on port ${workerPort}`)
  })

  usersServer.on('error', (err: any) => {
    console.log(err)
  })
}