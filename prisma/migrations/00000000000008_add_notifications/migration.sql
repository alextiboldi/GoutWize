-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "reference_id" UUID,
    "actor_id" UUID,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UUID default
ALTER TABLE public.notifications ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Index for efficient queries
CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can insert notifications (via SECURITY DEFINER triggers)
-- No direct user INSERT policy needed — triggers handle creation

-- ============================================================
-- Notification triggers
-- ============================================================

-- 1. Comment on post → notify post author
CREATE OR REPLACE FUNCTION public.notify_comment_on_post()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_post_title text;
  v_actor_username text;
BEGIN
  -- Only for post comments (not poll comments)
  IF NEW.post_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get post author
  SELECT author_id, title INTO v_post_author_id, v_post_title
  FROM public.posts WHERE id = NEW.post_id;

  -- Don't notify yourself
  IF v_post_author_id IS NULL OR v_post_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Get actor username
  SELECT username INTO v_actor_username
  FROM public.profiles WHERE id = NEW.author_id;

  INSERT INTO public.notifications (user_id, type, reference_id, actor_id, message)
  VALUES (
    v_post_author_id,
    'comment_on_post',
    NEW.post_id,
    NEW.author_id,
    v_actor_username || ' replied to your post: "' || LEFT(v_post_title, 60) || '"'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_notify_post_author ON public.comments;
CREATE TRIGGER on_comment_notify_post_author
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_comment_on_post();

-- 2. Comment on poll → notify poll author
CREATE OR REPLACE FUNCTION public.notify_comment_on_poll()
RETURNS TRIGGER AS $$
DECLARE
  v_poll_author_id uuid;
  v_poll_question text;
  v_actor_username text;
BEGIN
  IF NEW.poll_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT author_id, question INTO v_poll_author_id, v_poll_question
  FROM public.polls WHERE id = NEW.poll_id;

  IF v_poll_author_id IS NULL OR v_poll_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  SELECT username INTO v_actor_username
  FROM public.profiles WHERE id = NEW.author_id;

  INSERT INTO public.notifications (user_id, type, reference_id, actor_id, message)
  VALUES (
    v_poll_author_id,
    'comment_on_poll',
    NEW.poll_id,
    NEW.author_id,
    v_actor_username || ' commented on your poll: "' || LEFT(v_poll_question, 60) || '"'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_notify_poll_author ON public.comments;
CREATE TRIGGER on_comment_notify_poll_author
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_comment_on_poll();

-- 3. Upvote on post → notify post author
CREATE OR REPLACE FUNCTION public.notify_upvote_post()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_post_title text;
BEGIN
  IF NEW.post_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT author_id, title INTO v_post_author_id, v_post_title
  FROM public.posts WHERE id = NEW.post_id;

  IF v_post_author_id IS NULL OR v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, type, reference_id, actor_id, message)
  VALUES (
    v_post_author_id,
    'upvote_post',
    NEW.post_id,
    NEW.user_id,
    'Your post "' || LEFT(v_post_title, 60) || '" received an upvote'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vote_notify_post_author ON public.votes;
CREATE TRIGGER on_vote_notify_post_author
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.notify_upvote_post();

-- 4. Upvote on comment → notify comment author
CREATE OR REPLACE FUNCTION public.notify_upvote_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_comment_author_id uuid;
  v_comment_body text;
BEGIN
  IF NEW.comment_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT author_id, body INTO v_comment_author_id, v_comment_body
  FROM public.comments WHERE id = NEW.comment_id;

  IF v_comment_author_id IS NULL OR v_comment_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, type, reference_id, actor_id, message)
  VALUES (
    v_comment_author_id,
    'upvote_comment',
    NEW.comment_id,
    NEW.user_id,
    'Your comment was upvoted: "' || LEFT(v_comment_body, 60) || '"'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vote_notify_comment_author ON public.votes;
CREATE TRIGGER on_vote_notify_comment_author
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.notify_upvote_comment();

-- ============================================================
-- RPC: mark_all_notifications_read
-- ============================================================
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE notifications
  SET read = true
  WHERE user_id = v_user_id AND read = false;
END;
$$;

-- ============================================================
-- RPC: get_unread_notification_count
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_count integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT count(*)::integer INTO v_count
  FROM notifications
  WHERE user_id = v_user_id AND read = false;

  RETURN v_count;
END;
$$;
