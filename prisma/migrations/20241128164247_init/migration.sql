-- CreateTable
CREATE TABLE "MatricNumber" (
    "id" SERIAL NOT NULL,
    "matricNum" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatricNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatricNumber_matricNum_key" ON "MatricNumber"("matricNum");
