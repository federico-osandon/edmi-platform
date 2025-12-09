import { db } from '../../../../utils/db'
import { users } from '../../../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
    }

    // TODO: Add admin check middleware

    const [user] = await db.select().from(users).where(eq(users.id, Number(id))).limit(1)

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    if (user.role === 'superadmin') {
        throw createError({ statusCode: 403, statusMessage: 'Cannot modify superadmin status' })
    }

    const newActiveStatus = !user.active

    await db.update(users)
        .set({ active: newActiveStatus })
        .where(eq(users.id, Number(id)))
        .run()

    return { message: newActiveStatus ? 'User activated' : 'User deactivated' }
})
