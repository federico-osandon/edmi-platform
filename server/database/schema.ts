import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role', { enum: ['superadmin', 'admin', 'teacher', 'student'] }).default('student').notNull(),
    active: integer('active', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const courses = sqliteTable('courses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description'),
    teacherId: integer('teacher_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const enrollments = sqliteTable('enrollments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const assignments = sqliteTable('assignments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    dueDate: integer('due_date', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    enrollments: many(enrollments),
    courses: many(courses), // Courses taught by teacher
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
    teacher: one(users, {
        fields: [courses.teacherId],
        references: [users.id],
    }),
    enrollments: many(enrollments),
    assignments: many(assignments),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
    user: one(users, {
        fields: [enrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    }),
}))

export const assignmentsRelations = relations(assignments, ({ one }) => ({
    course: one(courses, {
        fields: [assignments.courseId],
        references: [courses.id],
    }),
}))
