import { db } from '../../../utils/db'
import { assignments } from '../../../database/schema'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { title, description, dueDate } = body

    if (!id || !title) {
        throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
    }

    // TODO: Check if user is teacher of this course

    const [newAssignment] = await db.insert(assignments).values({
        courseId: Number(id),
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null
    }).returning()

    return newAssignment
})
