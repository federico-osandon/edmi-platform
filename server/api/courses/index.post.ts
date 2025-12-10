import { db } from '../../utils/db'
import { courses } from '../../database/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { requireAdmin } from '../../utils/auth'
import { generateSlug, generateUniqueSlug, validateRequired } from '../../utils/helpers'

export default defineEventHandler(async (event) => {
    console.log('=== CREATE COURSE ENDPOINT ===')
    
    // Require admin or superadmin role
    try {
        const authenticatedUser = await requireAdmin(event)
        console.log('Authenticated user:', authenticatedUser)
    } catch (error) {
        console.log('Authentication failed:', error)
        throw error
    }
    
    const authenticatedUser = await requireAdmin(event)

    const body = await readBody(event)

    // Validate required fields
    const requiredErrors = validateRequired(body, ['title', 'grupo'])
    if (requiredErrors.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation error',
            data: { errors: requiredErrors }
        })
    }

    // Validate grupo
    if (body.grupo && !['pastores', 'servidores'].includes(body.grupo)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Grupo must be either "pastores" or "servidores"'
        })
    }

    // Generate slug from title if not provided
    let slug = body.slug
    if (!slug) {
        slug = generateSlug(body.title)
    } else {
        slug = generateSlug(slug)
    }

    // Ensure slug is unique
    const checkSlugExists = async (slugToCheck: string): Promise<boolean> => {
        const existing = await db
            .select({ id: courses.id })
            .from(courses)
            .where(and(
                eq(courses.slug, slugToCheck),
                isNull(courses.deletedAt)
            ))
            .limit(1)
        return existing.length > 0
    }

    slug = await generateUniqueSlug(slug, checkSlugExists)

    // Validate dates if provided
    if (body.startAt && body.endAt) {
        const startDate = new Date(body.startAt)
        const endDate = new Date(body.endAt)
        
        if (endDate <= startDate) {
            throw createError({
                statusCode: 400,
                statusMessage: 'End date must be after start date'
            })
        }
    }

    // Validate capacity
    if (body.capacity !== undefined && body.capacity < 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Capacity must be a positive number'
        })
    }

    // Validate price
    if (body.priceCents !== undefined && body.priceCents < 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Price must be a positive number'
        })
    }

    // Prepare course data
    const now = new Date()
    const courseData: any = {
        title: body.title,
        slug: slug,
        description: body.description || null,
        teacherId: body.teacherId || authenticatedUser.id,
        grupo: body.grupo,
        category: body.category || null,
        level: body.level || null,
        capacity: body.capacity ?? 0,
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
        published: body.published ?? false,
        thumbnailUrl: body.thumbnailUrl || null,
        language: body.language || null,
        priceCents: body.priceCents || null,
        currency: body.currency || null,
        requirements: body.requirements || null,
        isOnline: body.isOnline ?? true,
        location: body.location || null,
        enrollmentCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: authenticatedUser.id,
        updatedBy: authenticatedUser.id,
        deletedAt: null
    }

    // Insert course
    const [newCourse] = await db.insert(courses).values(courseData).returning()

    return {
        success: true,
        message: 'Course created successfully',
        course: newCourse
    }
})
