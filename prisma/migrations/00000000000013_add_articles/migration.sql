-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "read_time" INTEGER NOT NULL,
    "meta_description" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex for listing queries (ordered by published_at)
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at" DESC);

-- CreateIndex for category filtering
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- Enable RLS
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;

-- Public read access (articles are publicly visible)
CREATE POLICY "articles_public_read" ON "articles"
    FOR SELECT USING (true);

-- Service role can insert/update/delete (bot API uses service role key)
CREATE POLICY "articles_service_write" ON "articles"
    FOR ALL USING (true) WITH CHECK (true);
