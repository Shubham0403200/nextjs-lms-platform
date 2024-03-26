datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

generator client {
  provider = "prisma-client-js"
}

model Course {
  id String @id @default(uuid())
  userId String
  title String @db.Text
  description String? @db.Text
  imageUrl String? @db.Text
  price Float?
  isPublished Boolean @default(false)
  categoryId String?

  attachments Attachment[]
  category Category? @relation(fields: [categoryId], references: [id])
  chapters  Chapter[]
  purchases Purchase[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([categoryId])
}

model Category {
  id String @id @default(uuid())
  name String @unique
  courses Course[]
}

model Attachment {
  id String @id @default(uuid())
  name String
  url String @db.Text
  courseId String 

  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([courseId])
}

model Chapter {
  id String @id @default(uuid())
  title String @db.Text
  description String? @db.Text
  videoUrl String? @db.Text
  position Int
  isPublished Boolean @default(false)
  isFree Boolean @default(false)
  courseId String

  muxData MuxData?
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  userProgress UserProgress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
}

model MuxData {
  id String @id @default(uuid())
  chapterId String @unique
  assetId String 
  playbackId String? 
  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)
}

model UserProgress {
  id String @id @default(uuid())
  userId String
  chapterId String 

  chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  isCompleted Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([chapterId])
  @@unique([userId, chapterId])
}

model Purchase {
  id String @id @default(uuid())
  userId String
  courseId String 

  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
}

model StripeCustomer {
  id String @id @default(uuid())
  userId String @unique
  stripeCustomerId String @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
