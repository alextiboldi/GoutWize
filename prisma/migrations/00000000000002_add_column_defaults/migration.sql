-- Add gen_random_uuid() defaults to all id columns (Prisma's @default(uuid())
-- only works at the ORM layer, not via Supabase PostgREST)

ALTER TABLE public.posts ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.comments ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.votes ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.checkins ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.flares ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add now() default to updated_at columns (Prisma's @updatedAt only works
-- at the ORM layer)

ALTER TABLE public.profiles ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE public.posts ALTER COLUMN updated_at SET DEFAULT now();
