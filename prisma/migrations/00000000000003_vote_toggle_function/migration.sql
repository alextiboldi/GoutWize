-- toggle_post_vote: atomically insert/delete a vote and update the denormalized count
CREATE OR REPLACE FUNCTION public.toggle_post_vote(p_post_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_exists  boolean;
  v_upvotes integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if a vote already exists
  SELECT EXISTS (
    SELECT 1 FROM votes
    WHERE post_id = p_post_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Remove the vote
    DELETE FROM votes WHERE post_id = p_post_id AND user_id = v_user_id;
    UPDATE posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = p_post_id
      RETURNING upvotes INTO v_upvotes;
    RETURN jsonb_build_object('voted', false, 'upvotes', v_upvotes);
  ELSE
    -- Add the vote
    INSERT INTO votes (id, post_id, user_id) VALUES (gen_random_uuid(), p_post_id, v_user_id);
    UPDATE posts SET upvotes = upvotes + 1 WHERE id = p_post_id
      RETURNING upvotes INTO v_upvotes;
    RETURN jsonb_build_object('voted', true, 'upvotes', v_upvotes);
  END IF;
END;
$$;
