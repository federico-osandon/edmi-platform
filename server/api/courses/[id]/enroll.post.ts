import { db } from '../../../utils/db'
import { enrollments, courses } from '../../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { userId } = body // In production, get this from session!

    if (!id || !userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
    }

    // Check if course exists
    const [course] = await db.select().from(courses).where(eq(courses.id, Number(id)))
    if (!course) {
        throw createError({ statusCode: 404, statusMessage: 'Course not found' })
    }

    // Check if already enrolled
    const [existing] = await db.select().from(enrollments).where(
        and(
            eq(enrollments.courseId, Number(id)),
            eq(enrollments.userId, userId)
        )
    )

    if (existing) {
        return { message: 'Already enrolled' }
    }

    await db.insert(enrollments).values({
        courseId: Number(id),
        userId: userId
    })

    return { message: 'Enrolled successfully' }
})
