-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billboard` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Billboard_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `billboardId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,

    INDEX `Category_storeId_idx`(`storeId`),
    INDEX `Category_billboardId_idx`(`billboardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `brandId` VARCHAR(191) NOT NULL,
    `descriptionId` VARCHAR(191) NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Product_storeId_idx`(`storeId`),
    INDEX `Product_categoryId_idx`(`categoryId`),
    INDEX `Product_descriptionId_idx`(`descriptionId`),
    INDEX `Product_brandId_idx`(`brandId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `address` VARCHAR(191) NOT NULL DEFAULT '',
    `customerName` VARCHAR(191) NOT NULL DEFAULT '',
    `customerEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `city` VARCHAR(191) NOT NULL DEFAULT '',
    `country` VARCHAR(191) NOT NULL DEFAULT '',
    `postalCode` VARCHAR(191) NOT NULL DEFAULT '',
    `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `trackingNumber` VARCHAR(191) NULL,
    `shippingMethod` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `paymentIntentId` VARCHAR(191) NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Order_storeId_idx`(`storeId`),
    INDEX `Order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NULL,
    `colorId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(65, 30) NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    INDEX `OrderItem_sizeId_idx`(`sizeId`),
    INDEX `OrderItem_colorId_idx`(`colorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Size` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Size_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Color_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Brand_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Description` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Description_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Image_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductSize_productId_idx`(`productId`),
    INDEX `ProductSize_sizeId_idx`(`sizeId`),
    UNIQUE INDEX `ProductSize_productId_sizeId_key`(`productId`, `sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductColor` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `colorId` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductColor_productId_idx`(`productId`),
    INDEX `ProductColor_colorId_idx`(`colorId`),
    UNIQUE INDEX `ProductColor_productId_colorId_key`(`productId`, `colorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockHistory` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StockHistory_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToWishlist` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserToWishlist_AB_unique`(`A`, `B`),
    INDEX `_UserToWishlist_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
