import { db } from '../../utils/db'
import { courses, users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // In a real app, you might want to filter by enrollment or show all public courses
    const allCourses = await db.select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        teacherName: users.name,
        createdAt: courses.createdAt
    })
        .from(courses)
        .leftJoin(users, eq(courses.teacherId, users.id))

    return allCourses
})
