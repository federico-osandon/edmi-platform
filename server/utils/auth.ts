import { H3Event } from 'h3'
import { db } from './db'
import { users } from '../database/schema'
import { eq, isNull } from 'drizzle-orm'

export interface AuthenticatedUser {
    id: number
    email: string
    name: string
    role: 'superadmin' | 'admin' | 'teacher' | 'student'
    grupo: 'pastores' | 'servidores'
}

/**
 * Get authenticated user from event
 * In production, this should validate JWT or session token
 * For now using mock token from header
 */
export async function getAuthenticatedUser(event: H3Event): Promise<AuthenticatedUser | null> {
    const authHeader = getHeader(event, 'authorization')
    
    console.log('=== AUTH DEBUG ===')
    console.log('authHeader:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No Bearer token found')
        return null
    }

    const token = authHeader.substring(7)
    console.log('Extracted token:', token)
    
    // Mock token format: 'mock-token-{userId}'
    // In production, validate JWT here
    if (!token.startsWith('mock-token-')) {
        console.log('Token does not start with mock-token-')
        return null
    }

    const userId = parseInt(token.replace('mock-token-', ''))
    console.log('Parsed userId:', userId)
    
    if (isNaN(userId)) {
        console.log('userId is NaN')
        return null
    }

    const [user] = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            grupo: users.grupo,
            active: users.active,
            deletedAt: users.deletedAt
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

    console.log('Found user:', user)

    // Check if user is valid and active
    // Handle Invalid Date: treat it as null (not deleted)
    const deletedAtDate = user?.deletedAt ? new Date(user.deletedAt) : null
    const hasValidDeletedAt = deletedAtDate && !isNaN(deletedAtDate.getTime())

    if (!user || !user.active || hasValidDeletedAt) {
        console.log('User not found, inactive, or deleted:', { 
            hasUser: !!user, 
            active: user?.active, 
            hasValidDeletedAt 
        })
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'superadmin' | 'admin' | 'teacher' | 'student',
        grupo: user.grupo as 'pastores' | 'servidores'
    }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(event: H3Event): Promise<AuthenticatedUser> {
    const user = await getAuthenticatedUser(event)
    
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    return user
}

/**
 * Require specific roles
 */
export async function requireRoles(
    event: H3Event, 
    allowedRoles: Array<'superadmin' | 'admin' | 'teacher' | 'student'>
): Promise<AuthenticatedUser> {
    const user = await requireAuth(event)
    
    if (!allowedRoles.includes(user.role)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Insufficient permissions'
        })
    }

    return user
}

/**
 * Check if user is admin or superadmin
 */
export async function requireAdmin(event: H3Event): Promise<AuthenticatedUser> {
    return await requireRoles(event, ['superadmin', 'admin'])
}

/**
 * Check if user is superadmin
 */
export async function requireSuperAdmin(event: H3Event): Promise<AuthenticatedUser> {
    return await requireRoles(event, ['superadmin'])
}
