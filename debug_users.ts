import { db } from './server/utils/db'
import { users } from './server/database/schema'

async function listUsers() {
    try {
        const allUsers = await db.select().from(users)
        console.log('Total Users:', allUsers.length)
        console.table(allUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            active: u.active
        })))
    } catch (e) {
        console.error('Error fetching users:', e)
    }
}

listUsers()
