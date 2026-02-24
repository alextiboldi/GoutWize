-- Auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    'GoutWarrior_' || floor(random() * 9000 + 1000)::int,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-increment comment_count on posts when comment inserted
CREATE OR REPLACE FUNCTION public.increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_comment_inserted
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_comment_count();

-- Auto-decrement comment_count on posts when comment deleted
CREATE OR REPLACE FUNCTION public.decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_count();

-- ============================================================
-- Row Level Security
-- ============================================================

-- profiles: publicly readable, owner can update
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- posts: publicly readable, author can insert/update/delete
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts"
  ON public.posts FOR DELETE
  USING (author_id = auth.uid());

-- comments: publicly readable, author can insert/delete
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own comments"
  ON public.comments FOR DELETE
  USING (author_id = auth.uid());

-- votes: scoped to authenticated user
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own votes"
  ON public.votes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own votes"
  ON public.votes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own votes"
  ON public.votes FOR DELETE
  USING (user_id = auth.uid());

-- checkins: scoped to authenticated user
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own checkins"
  ON public.checkins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own checkins"
  ON public.checkins FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own checkins"
  ON public.checkins FOR UPDATE
  USING (user_id = auth.uid());

-- flares: scoped to authenticated user
ALTER TABLE public.flares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flares"
  ON public.flares FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own flares"
  ON public.flares FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own flares"
  ON public.flares FOR UPDATE
  USING (user_id = auth.uid());

-- Active flare count function (used by feed banner)
CREATE OR REPLACE FUNCTION public.get_active_flare_count()
RETURNS INT AS $$
  SELECT count(*)::int FROM public.flares WHERE status = 'active';
$$ LANGUAGE sql SECURITY DEFINER;
