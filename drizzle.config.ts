import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
    dialect: 'turso',
    schema: './server/database/schema.ts',
    out: './server/database/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'file:sqlite.db',
        authToken: process.env.DATABASE_AUTH_TOKEN,
    },
})
