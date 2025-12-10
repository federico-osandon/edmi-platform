ALTER TABLE `courses` ADD `grupo` text NOT NULL;--> statement-breakpoint
CREATE INDEX `courses_grupo_idx` ON `courses` (`grupo`);