import { db } from '../../utils/db'
import { courses, users, enrollments } from '../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
    }

    const course = await db.select({
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

    if (!course[0]) {
        throw createError({ statusCode: 404, statusMessage: 'Course not found' })
    }

    // Check if current user is enrolled
    // Note: In a real app we'd get userId from session. 
    // For this demo we'll assume the client sends userId in query or we skip this check if not authenticated properly yet
    // But let's try to get it from a header or query for now to demonstrate logic, or just return the course.

    return course
})
