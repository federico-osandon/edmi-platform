import 'dotenv/config'
import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL || 'file:sqlite.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

const client = createClient({
  url,
  authToken,
})

async function main() {
    console.log('Inspecting DB at', url)
    try {
        const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table';")
        console.log('Tables:', tables.rows)

        const columns = await client.execute("PRAGMA table_info(courses);")
        console.log('Columns in courses:', columns.rows)

        console.log('Running raw query...')
        const result = await client.execute({
            sql: 'select "id" from "courses" where ("courses"."slug" = ? and "courses"."deleted_at" is null) limit ?',
            args: ['test-slug', 1]
        })
        console.log('Query result:', result)
    } catch (e) {
        console.error(e)
    }
}

main()
