import { db } from '../utils/db'
import { users, enrollments } from '../database/schema'
import { eq, and, notInArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    try {
        const allUsers = await db.select().from(users)
        const allEnrollments = await db.select().from(enrollments)

        // Simulate candidates logic for courseId = 1
        const courseId = 1
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


        return {
            status: 'success',
            count: allUsers.length,
            users: allUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                active: u.active
            })),
            enrollments: allEnrollments,
            simulatedCandidatesCourse1: candidates,
            enrolledUserIds
        }
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
            stack: error.stack
        }
    }
})
