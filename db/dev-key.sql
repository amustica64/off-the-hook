-- Local development encryption key. Never used in production: there the key
-- lives in Supabase Vault as the secret `app_enc_key` (Doc 13 §7, Doc 07 §9).
--
-- This sets the key as a DATABASE default rather than a per-connection SET.
-- That matters. A per-connection GUC is fragile under connection pooling:
-- PgBouncer in transaction mode hands a pooled backend to the next caller, so
-- a SET made by one request is not reliably present for the next. A database
-- default is inherited by every new connection with no application code
-- setting anything, which is the same shape as the Vault read in production.
--
-- Run once per local database, before starting the app:
--   pnpm db:key
--
-- The value below is deliberately not a secret. It exists so referral notes
-- encrypt and decrypt locally. Nothing encrypted with it should ever leave a
-- development machine.

do $$
begin
  execute format(
    'alter database %I set app.enc_key = %L',
    current_database(),
    coalesce(nullif(current_setting('app.dev_key_override', true), ''), 'dev-only-not-a-secret')
  );
end $$;

-- New connections pick this up. Existing ones do not, so reconnect after this.
select current_database() as database, 'app.enc_key set as a database default' as result;
