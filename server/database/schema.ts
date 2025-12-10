import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role', { enum: ['superadmin', 'admin', 'teacher', 'student'] }).default('student').notNull(),
    grupo: text('grupo', { enum: ['pastores', 'servidores'] }).default('servidores').notNull(),
    active: integer('active', { mode: 'boolean' }).default(false).notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
    verificationToken: text('verification_token'),
    verificationTokenExpires: integer('verification_token_expires', { mode: 'timestamp' }),
    passwordResetToken: text('password_reset_token'),
    passwordResetExpires: integer('password_reset_expires', { mode: 'timestamp' }),
    lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    phone: text('phone'),
    locale: text('locale'),
    timezone: text('timezone'),
    twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false).notNull(),
    twoFactorSecretEncrypted: text('two_factor_secret_encrypted'),
    status: text('status', { enum: ['pending', 'active', 'suspended'] }).default('pending').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    roleIdx: index('users_role_idx').on(table.role),
    grupoIdx: index('users_grupo_idx').on(table.grupo),
    statusIdx: index('users_status_idx').on(table.status),
    deletedAtIdx: index('users_deleted_at_idx').on(table.deletedAt),
}))

// Courses
export const courses = sqliteTable('courses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    teacherId: integer('teacher_id').references(() => users.id),
    grupo: text('grupo', { enum: ['pastores', 'servidores'] }).notNull(),
    category: text('category'),
    level: text('level', { enum: ['beginner', 'intermediate', 'advanced'] }),
    capacity: integer('capacity').default(0).notNull(),
    startAt: integer('start_at', { mode: 'timestamp' }),
    endAt: integer('end_at', { mode: 'timestamp' }),
    published: integer('published', { mode: 'boolean' }).default(false).notNull(),
    thumbnailUrl: text('thumbnail_url'),
    language: text('language'),
    priceCents: integer('price_cents'),
    currency: text('currency'),
    requirements: text('requirements'),
    isOnline: integer('is_online', { mode: 'boolean' }).default(true).notNull(),
    location: text('location'),
    enrollmentCount: integer('enrollment_count').default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    createdBy: integer('created_by').references(() => users.id),
    updatedBy: integer('updated_by').references(() => users.id),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    slugIdx: index('courses_slug_idx').on(table.slug),
    teacherIdx: index('courses_teacher_id_idx').on(table.teacherId),
    grupoIdx: index('courses_grupo_idx').on(table.grupo),
    publishedIdx: index('courses_published_idx').on(table.published),
    categoryIdx: index('courses_category_idx').on(table.category),
    startAtIdx: index('courses_start_at_idx').on(table.startAt),
    deletedAtIdx: index('courses_deleted_at_idx').on(table.deletedAt),
}))

// Enrollments
export const enrollments = sqliteTable('enrollments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    status: text('status', { enum: ['pending', 'enrolled', 'completed', 'dropped', 'cancelled'] }).default('enrolled').notNull(),
    role: text('role', { enum: ['student', 'auditor', 'ta'] }).default('student').notNull(),
    progress: integer('progress').default(0).notNull(),
    grade: integer('grade'),
    paid: integer('paid', { mode: 'boolean' }).default(false).notNull(),
    paymentId: text('payment_id'),
    enrolledBy: integer('enrolled_by').references(() => users.id),
    enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    droppedAt: integer('dropped_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    userCourseUnique: uniqueIndex('enrollments_user_course_unique').on(table.userId, table.courseId),
    courseIdx: index('enrollments_course_id_idx').on(table.courseId),
    statusIdx: index('enrollments_status_idx').on(table.status),
    deletedAtIdx: index('enrollments_deleted_at_idx').on(table.deletedAt),
}))

// Assignments
export const assignments = sqliteTable('assignments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    dueDate: integer('due_date', { mode: 'timestamp' }),
    lessonId: integer('lesson_id').references(() => lessons.id),
    points: integer('points').default(0).notNull(),
    type: text('type', { enum: ['homework', 'quiz', 'project', 'exam'] }).default('homework').notNull(),
    visibility: integer('visibility', { mode: 'boolean' }).default(true).notNull(),
    allowLateSubmissions: integer('allow_late_submissions', { mode: 'boolean' }).default(false).notNull(),
    latePenalty: integer('late_penalty').default(0).notNull(),
    allowSubmitToDrive: integer('allow_submit_to_drive', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    createdBy: integer('created_by').references(() => users.id),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    courseIdx: index('assignments_course_id_idx').on(table.courseId),
    lessonIdx: index('assignments_lesson_id_idx').on(table.lessonId),
    dueDateIdx: index('assignments_due_date_idx').on(table.dueDate),
    deletedAtIdx: index('assignments_deleted_at_idx').on(table.deletedAt),
}))

// Modules (agrupación por curso)
export const modules = sqliteTable('modules', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    position: integer('position').default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    courseIdx: index('modules_course_id_idx').on(table.courseId),
    positionIdx: index('modules_position_idx').on(table.position),
    deletedAtIdx: index('modules_deleted_at_idx').on(table.deletedAt),
}))

// Lessons / Classes (pueden pertenecer a un módulo)
export const lessons = sqliteTable('lessons', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    moduleId: integer('module_id').references(() => modules.id),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    position: integer('position').default(0).notNull(),
    startsAt: integer('starts_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    courseIdx: index('lessons_course_id_idx').on(table.courseId),
    moduleIdx: index('lessons_module_id_idx').on(table.moduleId),
    positionIdx: index('lessons_position_idx').on(table.position),
    deletedAtIdx: index('lessons_deleted_at_idx').on(table.deletedAt),
}))

// Materials (videos, links, Drive folders, archivos, etc.)
export const materials = sqliteTable('materials', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    lessonId: integer('lesson_id').references(() => lessons.id),
    type: text('type', { enum: ['youtube','drive','file','link','pdf','video','markdown'] }).notNull(),
    title: text('title'),
    url: text('url'),
    externalId: text('external_id'),
    meta: text('meta'), // JSON string
    position: integer('position').default(0).notNull(),
    public: integer('public', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    courseIdx: index('materials_course_id_idx').on(table.courseId),
    lessonIdx: index('materials_lesson_id_idx').on(table.lessonId),
    typeIdx: index('materials_type_idx').on(table.type),
    deletedAtIdx: index('materials_deleted_at_idx').on(table.deletedAt),
}))

// Student Drive folders (opcional para integración con Google Drive)
export const studentDriveFolders = sqliteTable('student_drive_folders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    folderId: text('folder_id').notNull(), // Google Drive folder id
    folderUrl: text('folder_url'),
    permissions: text('permissions'), // JSON
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    userCourseIdx: index('student_drive_folders_user_course_idx').on(table.userId, table.courseId),
    deletedAtIdx: index('student_drive_folders_deleted_at_idx').on(table.deletedAt),
}))

// Normalizar archivos de submissions (opcional)
export const submissionFiles = sqliteTable('submission_files', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    submissionId: integer('submission_id').references(() => submissions.id).notNull(),
    url: text('url').notNull(),
    filename: text('filename'),
    size: integer('size'),
    mime: text('mime'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
    submissionIdx: index('submission_files_submission_id_idx').on(table.submissionId),
}))

// Submissions (nueva tabla)
export const submissions = sqliteTable('submissions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    assignmentId: integer('assignment_id').references(() => assignments.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    submittedAt: integer('submitted_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    filesMeta: text('files_meta'), // JSON string con metadatos de archivos
    content: text('content'),
    grade: integer('grade'),
    gradedBy: integer('graded_by').references(() => users.id),
    gradedAt: integer('graded_at', { mode: 'timestamp' }),
    feedback: text('feedback'),
    status: text('status', { enum: ['submitted', 'late', 'resubmitted', 'graded'] }).default('submitted').notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    assignmentUserIdx: index('submissions_assignment_user_idx').on(table.assignmentId, table.userId),
    userIdx: index('submissions_user_id_idx').on(table.userId),
    statusIdx: index('submissions_status_idx').on(table.status),
    deletedAtIdx: index('submissions_deleted_at_idx').on(table.deletedAt),
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    enrollments: many(enrollments),
    courses: many(courses), // Courses taught by teacher
    submissions: many(submissions),
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

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    course: one(courses, {
        fields: [assignments.courseId],
        references: [courses.id],
    }),
    submissions: many(submissions),
}))

export const submissionsRelations = relations(submissions, ({ one }) => ({
    assignment: one(assignments, {
        fields: [submissions.assignmentId],
        references: [assignments.id],
    }),
    user: one(users, {
        fields: [submissions.userId],
        references: [users.id],
    }),
}))
