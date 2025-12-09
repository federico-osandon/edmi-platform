import { db } from '../utils/db'
import { users } from '../database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        // Check if super admin exists
        const [existingAdmin] = await db.select().from(users).where(eq(users.role, 'superadmin'))

        if (existingAdmin) {
            return { message: 'Super admin already exists' }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin', 10)

        // Create super admin
        const [admin] = await db.insert(users).values({
            email: 'admin@edmi.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'superadmin',
            active: true,
        }).returning()

        return { message: 'Super admin created', user: admin }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to seed database',
            data: error
        })
    }
})
