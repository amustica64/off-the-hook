-- 0002: enc_key() reads Supabase Vault first, GUC second. Doc 13 §7, Doc 07 §9.
--
-- The defect this fixes, found 30 August 2026 and reproduced against a real
-- Postgres: create_referral encrypts notes with pgp_sym_encrypt(..., enc_key()),
-- and enc_key() read only current_setting('app.enc_key'). Nothing in the
-- application set that GUC. db/client.ts opens a plain postgres() connection,
-- so every application connection had no key, and the referral form failed with
-- "encryption key not configured" on every environment including Supabase. It
-- failed only when the referrer wrote notes, which is the sensitive context the
-- form exists to collect, on the safeguarding route.
--
-- It survived because tests/rls/rls-proof.sql set the GUC itself before calling
-- the RPC, so the proof arranged a condition the application never arranged.
--
-- Two things change here.
--
-- 1. enc_key() reads the Vault first. Doc 13 §7 is explicit that "the
--    safeguarding lead's name and the encryption key move into the real
--    Supabase Vault, not a GUC", and Doc 07 §9 puts Vault in production. The
--    GUC stays as the documented local-development fallback so the local stack
--    and the proof still run without Supabase.
--
-- 2. The GUC is no longer expected to be set per connection. A per-connection
--    GUC is fragile under connection pooling: PgBouncer in transaction mode
--    hands a pooled backend to the next caller, so a SET made by one request is
--    not reliably present for the next. Locally the key is set as a database
--    default instead (see the db:key script in package.json), which every
--    connection inherits without any application code setting anything.

-- ---------------------------------------------------------------------------
-- enc_key
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER on purpose. Called from inside the SECURITY DEFINER RPCs it
-- serves, it runs with the definer's privileges and can read the Vault. Called
-- directly by anon or authenticated, it has no privilege on the vault schema,
-- so to_regclass returns null and there is no path to the production key. It is
-- also revoked from those roles below. Do not make this SECURITY DEFINER.
create or replace function enc_key() returns text language plpgsql stable as $$
declare k text;
begin
  -- Supabase Vault. to_regclass returns null when the extension is absent or
  -- not visible to the caller, which is both the local case and the
  -- unprivileged-caller case, so this is the capability check and the
  -- permission check at once.
  if to_regclass('vault.decrypted_secrets') is not null then
    begin
      execute 'select decrypted_secret from vault.decrypted_secrets where name = $1'
        into k using 'app_enc_key';
    exception when insufficient_privilege or undefined_table then
      k := null;
    end;
  end if;

  -- Local development fallback. Set as a database default, not per connection.
  if k is null or k = '' then
    k := nullif(current_setting('app.enc_key', true), '');
  end if;

  if k is null then
    raise exception 'encryption key not configured'
      using errcode = '55000',
            hint = 'Set the app_enc_key secret in Supabase Vault, or for local development run the db:key script.';
  end if;
  return k;
end $$;

-- Nothing but the definer RPCs has any business calling this.
revoke execute on function enc_key() from public;
revoke execute on function enc_key() from anon, authenticated;
