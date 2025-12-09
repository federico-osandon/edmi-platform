import { db } from '../../utils/db'
import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing credentials'
        })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials'
        })
    }

    // Compare password with hash
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials'
        })
    }

    if (!user.active) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Account is not active. Please contact administrator.'
        })
    }

    // Simple session for demo. In production use proper session management (e.g. h3-session or JWT)
    // For now we return user info to store in client
    return {
        token: 'mock-token-' + user.id, // Mock token
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    }
})
