import { db } from '../../utils/db'
import { courses, users, enrollments } from '../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
    }

    const query = getQuery(event)
    const userId = query.userId ? Number(query.userId) : null

    const result = await db.select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        teacherName: users.name,
        teacherId: courses.teacherId,
        createdAt: courses.createdAt
    })
        .from(courses)
        .leftJoin(users, eq(courses.teacherId, users.id))
        .where(eq(courses.id, Number(id)))

    const course = result[0]

    if (!course) {
        throw createError({ statusCode: 404, statusMessage: 'Course not found' })
    }

    let isEnrolled = false
    if (userId) {
        const [enrollment] = await db.select()
            .from(enrollments)
            .where(and(
                eq(enrollments.courseId, course.id),
                eq(enrollments.userId, userId),
                eq(enrollments.status, 'enrolled')
            ))

        isEnrolled = !!enrollment
    }

    return {
        ...course,
        isEnrolled
    }
})
