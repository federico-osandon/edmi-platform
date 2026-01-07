import { db } from '../../../utils/db'
import { users } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // TODO: Verify admin
    const id = Number(event.context.params?.id)

    const [user] = await db.select().from(users).where(eq(users.id, id))

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        grupo: user.grupo,
        active: user.active
    }
})
