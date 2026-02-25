-- Add longest_streak column to profiles
ALTER TABLE profiles ADD COLUMN longest_streak integer NOT NULL DEFAULT 0;

-- Trigger function: after checkin insert/update, recalculate streak and update longest
CREATE OR REPLACE FUNCTION public.update_longest_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current integer;
  v_longest integer;
BEGIN
  v_current := get_checkin_streak(NEW.user_id);

  SELECT longest_streak INTO v_longest
  FROM profiles WHERE id = NEW.user_id;

  IF v_current > v_longest THEN
    UPDATE profiles SET longest_streak = v_current WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_longest_streak
  AFTER INSERT OR UPDATE ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_longest_streak();
