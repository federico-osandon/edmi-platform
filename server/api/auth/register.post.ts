import { db } from '../../utils/db'
import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password, name } = body

    if (!email || !password || !name) {
        throw createError({
            statusMessage: 'Missing required fields'
        })
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password must be at least 6 characters long'
        })
    }

    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email))
    if (existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User already exists'
        })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (active: false by default)
    const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        role: 'student', // Default role
        active: false,
    }).returning()

    return {
        message: 'User registered successfully. Please wait for admin approval.',
        user: { id: newUser.id, email: newUser.email, name: newUser.name }
    }
})
