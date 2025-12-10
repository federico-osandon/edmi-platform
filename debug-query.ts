import 'dotenv/config'
import { db } from './server/utils/db'
import { courses } from './server/database/schema'
import { eq, and, isNull } from 'drizzle-orm'

async function main() {
    console.log('Running query...')
    try {
        const slugToCheck = 'test-slug'
        const existing = await db
            .select({ id: courses.id })
            .from(courses)
            .where(and(
                eq(courses.slug, slugToCheck),
                isNull(courses.deletedAt)
            ))
            .limit(1)
        console.log('Result:', existing)
    } catch (e) {
        console.error('Error:', e)
    }
}

main()
