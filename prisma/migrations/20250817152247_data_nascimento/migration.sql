/*
  Warnings:

  - Changed the type of `dataNascimento` on the `Crianca` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Crianca" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "dataNascimento",
ADD COLUMN     "dataNascimento" VARCHAR(10) NOT NULL;
