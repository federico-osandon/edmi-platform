import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
    dialect: 'turso',
    schema: './server/database/schema.ts',
    out: './server/database/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL || 'file:sqlite.db',
        authToken: process.env.DATABASE_AUTH_TOKEN || process.env.NUXT_DATABASE_AUTH_TOKEN,
    },
})
