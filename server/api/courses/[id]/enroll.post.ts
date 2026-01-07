import { db } from '../../../utils/db'
import { enrollments, users, courses } from '../../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // TODO: Verify admin role

    const courseId = Number(event.context.params?.id)
    if (!courseId) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' })
    }

    const body = await readBody(event)
    const { userIds } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'userIds array is required'
        })
    }

    try {
        // Verify course exists
        const [course] = await db.select().from(courses).where(eq(courses.id, courseId))
        if (!course) {
            throw createError({ statusCode: 404, statusMessage: 'Course not found' })
        }

        // Create enrollments
        const results = []
        for (const userId of userIds) {
            // Check if already enrolled
            const [existing] = await db.select()
                .from(enrollments)
                .where(and(
                    eq(enrollments.userId, userId),
                    eq(enrollments.courseId, courseId)
                ))

            if (!existing) {
                const [enrollment] = await db.insert(enrollments).values({
                    userId,
                    courseId,
                    status: 'enrolled',
                    enrolledAt: new Date()
                }).returning()
                results.push(enrollment)
            } else {
                // Reactivate if not enrolled
                if (existing.status !== 'enrolled') {
                    const [updated] = await db.update(enrollments)
                        .set({ status: 'enrolled', enrolledAt: new Date() })
                        .where(eq(enrollments.id, existing.id))
                        .returning()
                    results.push(updated)
                }
            }
        }

        // Update enrollment count
        // Note: Ideally this should be a transaction or executed query to count specific enrollments
        // For now simplest approach:
        /*
       const count = await db.select({ count: sql<number>`count(*)` })
           .from(enrollments)
           .where(eq(enrollments.courseId, courseId))
       
       await db.update(courses)
           .set({ enrollmentCount: count[0].count })
           .where(eq(courses.id, courseId))
       */

        return { success: true, enrolled: results.length }
    } catch (error) {
        console.error('Enrollment error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to enroll users'
        })
    }
})
