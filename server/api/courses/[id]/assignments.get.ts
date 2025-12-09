import { db } from '../../../utils/db'
import { assignments } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
    }

    const courseAssignments = await db.select().from(assignments).where(eq(assignments.courseId, Number(id)))

    return courseAssignments
})
