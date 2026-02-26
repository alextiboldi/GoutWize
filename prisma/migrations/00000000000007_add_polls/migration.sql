-- CreateTable
CREATE TABLE "polls" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_options" (
    "id" UUID NOT NULL,
    "poll_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_votes" (
    "id" UUID NOT NULL,
    "poll_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- Make Comment.post_id nullable and add poll_id
ALTER TABLE "comments" ALTER COLUMN "post_id" DROP NOT NULL;
ALTER TABLE "comments" ADD COLUMN "poll_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "poll_votes_poll_id_user_id_key" ON "poll_votes"("poll_id", "user_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- UUID defaults (pattern from migration 00000000000002)
-- ============================================================
ALTER TABLE public.polls ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.poll_options ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.poll_votes ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- ============================================================
-- Row Level Security
-- ============================================================

-- polls: public SELECT, auth INSERT (author_id = auth.uid()), author DELETE
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Polls are publicly readable" ON public.polls;
CREATE POLICY "Polls are publicly readable"
  ON public.polls FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create polls" ON public.polls;
CREATE POLICY "Authenticated users can create polls"
  ON public.polls FOR INSERT
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors can delete own polls" ON public.polls;
CREATE POLICY "Authors can delete own polls"
  ON public.polls FOR DELETE
  USING (author_id = auth.uid());

-- poll_options: public SELECT, auth INSERT (check poll ownership via subquery)
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Poll options are publicly readable" ON public.poll_options;
CREATE POLICY "Poll options are publicly readable"
  ON public.poll_options FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Poll authors can create options" ON public.poll_options;
CREATE POLICY "Poll authors can create options"
  ON public.poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls
      WHERE polls.id = poll_id AND polls.author_id = auth.uid()
    )
  );

-- poll_votes: own-user SELECT/INSERT (user_id = auth.uid())
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own poll votes" ON public.poll_votes;
CREATE POLICY "Users can read own poll votes"
  ON public.poll_votes FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own poll votes" ON public.poll_votes;
CREATE POLICY "Users can create own poll votes"
  ON public.poll_votes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- cast_poll_vote RPC (pattern from migration 00000000000003)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cast_poll_vote(p_poll_id uuid, p_option_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_exists  boolean;
  v_result  jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if already voted
  SELECT EXISTS (
    SELECT 1 FROM poll_votes
    WHERE poll_id = p_poll_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    RAISE EXCEPTION 'Already voted on this poll';
  END IF;

  -- Insert vote
  INSERT INTO poll_votes (poll_id, option_id, user_id)
  VALUES (p_poll_id, p_option_id, v_user_id);

  -- Increment vote_count on chosen option
  UPDATE poll_options
  SET vote_count = vote_count + 1
  WHERE id = p_option_id AND poll_id = p_poll_id;

  -- Return updated options
  SELECT jsonb_build_object(
    'voted_option_id', p_option_id,
    'options', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', po.id,
          'label', po.label,
          'vote_count', po.vote_count,
          'display_order', po.display_order
        ) ORDER BY po.display_order
      )
      FROM poll_options po
      WHERE po.poll_id = p_poll_id
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- Update comment count triggers for nullable post_id + new poll_id
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN
    UPDATE public.posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  END IF;
  IF NEW.poll_id IS NOT NULL THEN
    UPDATE public.polls
    SET comment_count = comment_count + 1
    WHERE id = NEW.poll_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.post_id IS NOT NULL THEN
    UPDATE public.posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
  END IF;
  IF OLD.poll_id IS NOT NULL THEN
    UPDATE public.polls
    SET comment_count = comment_count - 1
    WHERE id = OLD.poll_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
