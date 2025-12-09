import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../database/schema'

const config = useRuntimeConfig()

const client = createClient({
  url: config.databaseUrl || 'file:sqlite.db',
  authToken: config.databaseAuthToken,
})

export const db = drizzle(client, { schema })
