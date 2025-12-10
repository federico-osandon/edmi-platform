import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../database/schema'

// Use environment variables directly for Vercel compatibility
const url = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || 'file:sqlite.db'
const authToken = process.env.NUXT_DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN

const client = createClient({
  url,
  authToken,
})

export const db = drizzle(client, { schema })
