-- Create a dedicated bot user for automated posts (AI agent)
-- Fixed UUID so it can be referenced in application code

INSERT INTO public.profiles (id, username, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-00000000b070'::uuid,
  'GoutWize Bot',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
