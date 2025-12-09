import { db } from '../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
    // TODO: Add admin check middleware
    const allUsers = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        active: users.active,
        createdAt: users.createdAt
    }).from(users)

    return allUsers
})
