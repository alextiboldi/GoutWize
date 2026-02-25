-- toggle_comment_vote: atomically insert/delete a comment vote and update the denormalized count
CREATE OR REPLACE FUNCTION public.toggle_comment_vote(p_comment_id uuid)
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

  SELECT EXISTS (
    SELECT 1 FROM votes
    WHERE comment_id = p_comment_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM votes WHERE comment_id = p_comment_id AND user_id = v_user_id;
    UPDATE comments SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = p_comment_id
      RETURNING upvotes INTO v_upvotes;
    RETURN jsonb_build_object('voted', false, 'upvotes', v_upvotes);
  ELSE
    INSERT INTO votes (id, comment_id, user_id) VALUES (gen_random_uuid(), p_comment_id, v_user_id);
    UPDATE comments SET upvotes = upvotes + 1 WHERE id = p_comment_id
      RETURNING upvotes INTO v_upvotes;
    RETURN jsonb_build_object('voted', true, 'upvotes', v_upvotes);
  END IF;
END;
$$;
