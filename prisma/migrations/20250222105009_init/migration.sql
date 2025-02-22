/*
  Warnings:

  - Added the required column `location_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `energy` VARCHAR(100) NULL,
    ADD COLUMN `location_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `recycle` VARCHAR(100) NULL,
    ADD COLUMN `transport` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(36) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `town` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
