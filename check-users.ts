import 'dotenv/config'
import { db } from './server/utils/db'
import { users } from './server/database/schema'

async function main() {
    const allUsers = await db.select().from(users)
    console.log('Users:', allUsers.map(u => ({ id: u.id, emailVerified: u.emailVerified, twoFactorEnabled: u.twoFactorEnabled })))
}

main()
