import { db } from '../../utils/db'
import { users, enrollments } from '../../database/schema'
import { eq, and, ne, notInArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // Only admins/superadmins can access this
    // TODO: Add proper middleware/auth check here if not global

    const query = getQuery(event)
    const courseId = Number(query.courseId)

    if (!courseId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Course ID is required'
        })
    }

    try {
        // Get all users who are already enrolled in the course (only active enrollments)
        const enrolledUsers = await db.select({ id: enrollments.userId })
            .from(enrollments)
            .where(and(
                eq(enrollments.courseId, courseId),
                eq(enrollments.status, 'enrolled')
            ))

        const enrolledUserIds = enrolledUsers.map(u => u.id)

        let conditions = and(
            eq(users.active, true),
            eq(users.role, 'student')
        )

        if (enrolledUserIds.length > 0) {
            conditions = and(
                conditions,
                notInArray(users.id, enrolledUserIds)
            )
        }

        const candidates = await db.select({
            id: users.id,
            name: users.name,
            email: users.email
        })
            .from(users)
            .where(conditions)

        return candidates
    } catch (error) {
        console.error('Error fetching candidates:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch candidates'
        })
    }
})
