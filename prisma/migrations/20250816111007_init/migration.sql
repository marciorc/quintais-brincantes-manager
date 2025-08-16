-- CreateTable
CREATE TABLE "public"."Responsavel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Crianca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "turmaId" TEXT,
    "responsavelId" TEXT NOT NULL,

    CONSTRAINT "Crianca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Turma" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_email_key" ON "public"."Responsavel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_usuario_key" ON "public"."Admin"("usuario");

-- AddForeignKey
ALTER TABLE "public"."Crianca" ADD CONSTRAINT "Crianca_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crianca" ADD CONSTRAINT "Crianca_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
