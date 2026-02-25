-- get_checkin_streak: calculates consecutive check-in days ending at today
CREATE OR REPLACE FUNCTION public.get_checkin_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streak integer := 0;
  v_check_date date := CURRENT_DATE;
  v_found boolean;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM checkins
      WHERE user_id = p_user_id AND date = v_check_date
    ) INTO v_found;

    IF NOT v_found THEN
      EXIT;
    END IF;

    v_streak := v_streak + 1;
    v_check_date := v_check_date - 1;
  END LOOP;

  RETURN v_streak;
END;
$$;
