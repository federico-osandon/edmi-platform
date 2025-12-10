/**
 * Utility functions for soft-delete operations
 */

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate unique slug by appending number if needed
 */
export async function generateUniqueSlug(
    baseSlug: string,
    checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (await checkExists(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

/**
 * Validate required fields
 */
export function validateRequired(data: Record<string, any>, fields: string[]): string[] {
    const errors: string[] = []
    
    for (const field of fields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors.push(`${field} is required`)
        }
    }
    
    return errors
}

/**
 * Mark record as deleted (soft delete)
 */
export function markAsDeleted() {
    return {
        deletedAt: new Date()
    }
}

/**
 * Check if a value is a valid timestamp
 */
export function isValidTimestamp(value: any): boolean {
    if (!value) return false
    const date = new Date(value)
    return !isNaN(date.getTime())
}
