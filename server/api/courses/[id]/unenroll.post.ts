import { db } from '../../../utils/db'
import { enrollments } from '../../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // TODO: Verify admin role
    const courseId = Number(event.context.params?.id)
    if (!courseId) throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' })

    const body = await readBody(event)
    const { userId } = body

    if (!userId) throw createError({ statusCode: 400, statusMessage: 'User ID is required' })

    try {
        // Soft delete or update status to dropped?
        // Let's update status to 'dropped' or 'cancelled' or just delete.
        // For now, let's update to 'dropped' to keep history.

        await db.update(enrollments)
            .set({
                status: 'dropped',
                droppedAt: new Date()
            })
            .where(and(
                eq(enrollments.courseId, courseId),
                eq(enrollments.userId, userId)
            ))

        return { success: true }
    } catch (error) {
        console.error('Error unenrolling student:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to unenroll student' })
    }
})
