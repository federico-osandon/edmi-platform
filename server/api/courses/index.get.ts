import { db } from '../../utils/db'
import { courses, users } from '../../database/schema'
import { eq, and, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // Get query params
    const query = getQuery(event)
    const showAll = query.all === 'true' // Admin can see all including unpublished

    // Build where conditions
    const conditions = [isNull(courses.deletedAt)]
    
    // Only show published courses unless admin requests all
    if (!showAll) {
        conditions.push(eq(courses.published, true))
    }

    const allCourses = await db.select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        description: courses.description,
        teacherId: courses.teacherId,
        teacherName: users.name,
        grupo: courses.grupo,
        category: courses.category,
        level: courses.level,
        capacity: courses.capacity,
        startAt: courses.startAt,
        endAt: courses.endAt,
        published: courses.published,
        thumbnailUrl: courses.thumbnailUrl,
        language: courses.language,
        priceCents: courses.priceCents,
        currency: courses.currency,
        isOnline: courses.isOnline,
        location: courses.location,
        enrollmentCount: courses.enrollmentCount,
        createdAt: courses.createdAt
    })
        .from(courses)
        .leftJoin(users, eq(courses.teacherId, users.id))
        .where(and(...conditions))

    return allCourses
})
