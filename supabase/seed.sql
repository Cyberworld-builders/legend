
-- Seed data for local development. Runs automatically on `supabase db reset`.
-- Auth user for admin dashboard login (local only).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert seed user jay@cyberworldbuilders.com (password: password — change after first login in production)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'jay@cyberworldbuilders.com',
  crypt('password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Identity record so the user can sign in with email (identity id is distinct from user id)
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'jay@cyberworldbuilders.com',
  format('{"sub":"%s","email":"%s"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'jay@cyberworldbuilders.com')::jsonb,
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
