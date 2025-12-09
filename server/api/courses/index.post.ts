import { db } from '../../utils/db'
import { courses, users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { title, description, teacherId } = body

    if (!title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Title is required'
        })
    }

    // TODO: Add proper authorization check here (only admin/teacher)
    // For now we assume the client sends the correct teacherId or we get it from session

    const [newCourse] = await db.insert(courses).values({
        title,
        description,
        teacherId, // In real app, get from session or validate
    }).returning()

    return newCourse
})
