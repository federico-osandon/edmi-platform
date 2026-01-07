import { db } from '../../../utils/db'
import { enrollments, users } from '../../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // TODO: Add admin verification middleware
    const courseId = Number(event.context.params?.id)

    if (!courseId) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' })
    }

    try {
        const enrolledStudents = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            enrolledAt: enrollments.enrolledAt,
            status: enrollments.status
        })
            .from(enrollments)
            .innerJoin(users, eq(enrollments.userId, users.id))
            .where(and(
                eq(enrollments.courseId, courseId),
                eq(enrollments.status, 'enrolled')
            ))

        return enrolledStudents
    } catch (error) {
        console.error('Error fetching enrolled students:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch enrolled students'
        })
    }
})
