-- Replace handle_new_user() with creative username generation
-- Pattern: Adjective + Noun + 2-digit number (e.g. CalmJoint42, BreezyStep07)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  adjectives text[] := ARRAY[
    'Calm', 'Steady', 'Breezy', 'Gentle', 'Mellow',
    'Swift', 'Brave', 'Chill', 'Zen', 'Easy',
    'Bold', 'Lucky', 'Witty', 'Sunny', 'Cool',
    'Wise', 'Keen', 'Noble', 'Vivid', 'Plucky',
    'Dapper', 'Nimble', 'Jolly', 'Peppy', 'Snappy',
    'Cosmic', 'Mighty', 'Golden', 'Silver', 'Radiant',
    'Fierce', 'Serene', 'Lively', 'Hardy', 'Spry'
  ];
  nouns text[] := ARRAY[
    'Joint', 'Step', 'Ankle', 'Toe', 'Stride',
    'Pacer', 'Mover', 'Walker', 'Strider', 'Dasher',
    'Ranger', 'Scout', 'Pilgrim', 'Roamer', 'Trekker',
    'Phoenix', 'Tiger', 'Falcon', 'Otter', 'Panda',
    'Sage', 'Fox', 'Bear', 'Wolf', 'Hawk',
    'Comet', 'Spark', 'Flint', 'Storm', 'Reef',
    'Ridge', 'Peak', 'Drift', 'Breeze', 'Trail'
  ];
  chosen_name text;
  attempts int := 0;
BEGIN
  LOOP
    chosen_name := adjectives[1 + floor(random() * array_length(adjectives, 1))::int]
                || nouns[1 + floor(random() * array_length(nouns, 1))::int]
                || lpad(floor(random() * 100)::int::text, 2, '0');

    -- Check for uniqueness; retry if collision (up to 10 attempts)
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = chosen_name);
    attempts := attempts + 1;
    EXIT WHEN attempts >= 10;
  END LOOP;

  -- Final fallback if all attempts collide (extremely unlikely with 35x35x100 = 122,500 combos)
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = chosen_name) THEN
    chosen_name := 'User_' || floor(random() * 900000 + 100000)::int;
  END IF;

  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    chosen_name,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
