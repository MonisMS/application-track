CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`role` text NOT NULL,
	`stage` text DEFAULT 'unknown' NOT NULL,
	`applied_date` text NOT NULL,
	`status` text DEFAULT 'applied' NOT NULL,
	`contact_person` text,
	`follow_up_date` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
