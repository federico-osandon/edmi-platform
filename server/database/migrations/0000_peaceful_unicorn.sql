CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`due_date` integer,
	`lesson_id` integer,
	`points` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'homework' NOT NULL,
	`visibility` integer DEFAULT true NOT NULL,
	`allow_late_submissions` integer DEFAULT false NOT NULL,
	`late_penalty` integer DEFAULT 0 NOT NULL,
	`allow_submit_to_drive` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `assignments_course_id_idx` ON `assignments` (`course_id`);--> statement-breakpoint
CREATE INDEX `assignments_lesson_id_idx` ON `assignments` (`lesson_id`);--> statement-breakpoint
CREATE INDEX `assignments_due_date_idx` ON `assignments` (`due_date`);--> statement-breakpoint
CREATE INDEX `assignments_deleted_at_idx` ON `assignments` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`teacher_id` integer,
	`category` text,
	`level` text,
	`capacity` integer DEFAULT 0 NOT NULL,
	`start_at` integer,
	`end_at` integer,
	`published` integer DEFAULT false NOT NULL,
	`thumbnail_url` text,
	`language` text,
	`price_cents` integer,
	`currency` text,
	`requirements` text,
	`is_online` integer DEFAULT true NOT NULL,
	`location` text,
	`enrollment_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`created_by` integer,
	`updated_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE INDEX `courses_teacher_id_idx` ON `courses` (`teacher_id`);--> statement-breakpoint
CREATE INDEX `courses_published_idx` ON `courses` (`published`);--> statement-breakpoint
CREATE INDEX `courses_category_idx` ON `courses` (`category`);--> statement-breakpoint
CREATE INDEX `courses_start_at_idx` ON `courses` (`start_at`);--> statement-breakpoint
CREATE INDEX `courses_deleted_at_idx` ON `courses` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`status` text DEFAULT 'enrolled' NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`grade` integer,
	`paid` integer DEFAULT false NOT NULL,
	`payment_id` text,
	`enrolled_by` integer,
	`enrolled_at` integer,
	`completed_at` integer,
	`dropped_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`enrolled_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enrollments_user_course_unique` ON `enrollments` (`user_id`,`course_id`);--> statement-breakpoint
CREATE INDEX `enrollments_course_id_idx` ON `enrollments` (`course_id`);--> statement-breakpoint
CREATE INDEX `enrollments_status_idx` ON `enrollments` (`status`);--> statement-breakpoint
CREATE INDEX `enrollments_deleted_at_idx` ON `enrollments` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`position` integer DEFAULT 0 NOT NULL,
	`starts_at` integer,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `lessons_course_id_idx` ON `lessons` (`course_id`);--> statement-breakpoint
CREATE INDEX `lessons_module_id_idx` ON `lessons` (`module_id`);--> statement-breakpoint
CREATE INDEX `lessons_position_idx` ON `lessons` (`position`);--> statement-breakpoint
CREATE INDEX `lessons_deleted_at_idx` ON `lessons` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`lesson_id` integer,
	`type` text NOT NULL,
	`title` text,
	`url` text,
	`external_id` text,
	`meta` text,
	`position` integer DEFAULT 0 NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `materials_course_id_idx` ON `materials` (`course_id`);--> statement-breakpoint
CREATE INDEX `materials_lesson_id_idx` ON `materials` (`lesson_id`);--> statement-breakpoint
CREATE INDEX `materials_type_idx` ON `materials` (`type`);--> statement-breakpoint
CREATE INDEX `materials_deleted_at_idx` ON `materials` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `modules_course_id_idx` ON `modules` (`course_id`);--> statement-breakpoint
CREATE INDEX `modules_position_idx` ON `modules` (`position`);--> statement-breakpoint
CREATE INDEX `modules_deleted_at_idx` ON `modules` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `student_drive_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`folder_id` text NOT NULL,
	`folder_url` text,
	`permissions` text,
	`created_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `student_drive_folders_user_course_idx` ON `student_drive_folders` (`user_id`,`course_id`);--> statement-breakpoint
CREATE INDEX `student_drive_folders_deleted_at_idx` ON `student_drive_folders` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `submission_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`submission_id` integer NOT NULL,
	`url` text NOT NULL,
	`filename` text,
	`size` integer,
	`mime` text,
	`created_at` integer,
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `submission_files_submission_id_idx` ON `submission_files` (`submission_id`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignment_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`submitted_at` integer,
	`files_meta` text,
	`content` text,
	`grade` integer,
	`graded_by` integer,
	`graded_at` integer,
	`feedback` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`graded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `submissions_assignment_user_idx` ON `submissions` (`assignment_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `submissions_user_id_idx` ON `submissions` (`user_id`);--> statement-breakpoint
CREATE INDEX `submissions_status_idx` ON `submissions` (`status`);--> statement-breakpoint
CREATE INDEX `submissions_deleted_at_idx` ON `submissions` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`grupo` text DEFAULT 'servidores' NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`verification_token` text,
	`verification_token_expires` integer,
	`password_reset_token` text,
	`password_reset_expires` integer,
	`last_login_at` integer,
	`avatar_url` text,
	`bio` text,
	`phone` text,
	`locale` text,
	`timezone` text,
	`two_factor_enabled` integer DEFAULT false NOT NULL,
	`two_factor_secret_encrypted` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `users_grupo_idx` ON `users` (`grupo`);--> statement-breakpoint
CREATE INDEX `users_status_idx` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `users_deleted_at_idx` ON `users` (`deleted_at`);