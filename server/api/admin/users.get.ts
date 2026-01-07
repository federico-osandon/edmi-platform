import { db } from '../../utils/db'
import { users } from '../../database/schema'
import { eq, and, like } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // TODO: Add admin check middleware
    const query = getQuery(event)
    const grupo = query.grupo as string

    // Build conditions
    let conditions = undefined
    if (grupo && ['pastores', 'servidores'].includes(grupo)) {
        // @ts-ignore
        conditions = eq(users.grupo, grupo)
    }

    const allUsers = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        grupo: users.grupo,
        active: users.active,
        createdAt: users.createdAt
    })
        .from(users)
        .where(conditions)

    return allUsers
})
