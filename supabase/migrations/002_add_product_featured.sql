-- Run this only if your database already exists from Phase 1
-- (i.e. supabase/schema.sql was already run before this file existed).
-- If you are setting up Supabase for the first time, just run
-- supabase/schema.sql — it already includes this column.

alter table products
  add column if not exists is_featured boolean not null default false;
