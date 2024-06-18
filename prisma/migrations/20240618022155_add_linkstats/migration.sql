/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `link` TEXT NOT NULL,
    `conversion` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `clickcount` INTEGER NOT NULL,

    UNIQUE INDEX `Link_conversion_key`(`conversion`),
    UNIQUE INDEX `Link_token_key`(`token`),
    UNIQUE INDEX `Link_clickcount_key`(`clickcount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Linkstats` (
    `token` INTEGER NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `cpu` VARCHAR(191) NOT NULL,
    `is_mobile` BOOLEAN NOT NULL,
    `vendor` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Linkstats_token_key`(`token`),
    UNIQUE INDEX `Linkstats_browser_key`(`browser`),
    UNIQUE INDEX `Linkstats_cpu_key`(`cpu`),
    UNIQUE INDEX `Linkstats_is_mobile_key`(`is_mobile`),
    UNIQUE INDEX `Linkstats_vendor_key`(`vendor`),
    UNIQUE INDEX `Linkstats_model_key`(`model`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
