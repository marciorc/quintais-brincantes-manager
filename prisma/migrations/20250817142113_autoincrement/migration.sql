/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Crianca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Crianca` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `turmaId` column on the `Crianca` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Responsavel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Responsavel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Turma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Turma` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `responsavelId` on the `Crianca` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Crianca" DROP CONSTRAINT "Crianca_responsavelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Crianca" DROP CONSTRAINT "Crianca_turmaId_fkey";

-- AlterTable
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Crianca" DROP CONSTRAINT "Crianca_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "turmaId",
ADD COLUMN     "turmaId" INTEGER,
DROP COLUMN "responsavelId",
ADD COLUMN     "responsavelId" INTEGER NOT NULL,
ADD CONSTRAINT "Crianca_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Responsavel" DROP CONSTRAINT "Responsavel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Turma" DROP CONSTRAINT "Turma_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Turma_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Crianca" ADD CONSTRAINT "Crianca_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crianca" ADD CONSTRAINT "Crianca_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
