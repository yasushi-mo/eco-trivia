-- CreateTable
CREATE TABLE "Quizzes" (
    "id" SERIAL NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trivia" (
    "id" SERIAL NOT NULL,
    "explanation_text" TEXT NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trivia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizTags" (
    "quizId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "QuizTags_pkey" PRIMARY KEY ("quizId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trivia_quiz_id_key" ON "Trivia"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- AddForeignKey
ALTER TABLE "Trivia" ADD CONSTRAINT "Trivia_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizTags" ADD CONSTRAINT "QuizTags_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizTags" ADD CONSTRAINT "QuizTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
