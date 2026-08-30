-- 0001: RLS, triggers, and SECURITY DEFINER RPC gates. Doc 06 §3 and §5, Doc 12 §3-4.
-- Runs on Supabase (auth schema exists) and on local Postgres (shim created below).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Local shim for Supabase auth. On Supabase these already exist and are skipped.
-- auth.jwt() reads request.jwt.claims, exactly as Supabase sets it per request.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.schemata where schema_name = 'auth') then
    create schema auth;
  end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'auth' and p.proname = 'jwt') then
    create function auth.jwt() returns jsonb language sql stable as
      $f$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $f$;
  end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'auth' and p.proname = 'uid') then
    create function auth.uid() returns uuid language sql stable as
      $f$ select nullif(auth.jwt() ->> 'sub', '')::uuid $f$;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;

grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function jwt_role() returns text language sql stable as
  $$ select auth.jwt() ->> 'role' $$;

create or replace function require_role(variadic allowed text[]) returns void
language plpgsql stable as $$
begin
  if jwt_role() is null or not (jwt_role() = any (allowed)) then
    raise exception 'not authorised' using errcode = '42501';
  end if;
end $$;

create or replace function write_audit(
  p_action text, p_entity_type text, p_entity_id uuid,
  p_before jsonb default null, p_after jsonb default null
) returns void language sql security definer set search_path = public as $$
  insert into audit_log (actor_id, actor_email, action, entity_type, entity_id, before, after)
  values (auth.uid(), auth.jwt() ->> 'email', p_action, p_entity_type, p_entity_id, p_before, p_after);
$$;

-- Encryption key: Supabase Vault in production, GUC app.enc_key for local dev.
create or replace function enc_key() returns text language plpgsql stable as $$
declare k text;
begin
  k := nullif(current_setting('app.enc_key', true), '');
  if k is null then raise exception 'encryption key not configured'; end if;
  return k;
end $$;

-- Fixed-window rate limit per Doc 06 §5.1. Raises when the window count exceeds the cap.
create or replace function check_rate_limit(p_key text, p_max int, p_window interval)
returns void language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into rate_limits (key, window_start, count) values (p_key, now(), 1)
  on conflict (key) do update set
    count = case when rate_limits.window_start < now() - p_window then 1 else rate_limits.count + 1 end,
    window_start = case when rate_limits.window_start < now() - p_window then now() else rate_limits.window_start end
  returning count into c;
  if c > p_max then raise exception 'rate limited' using errcode = 'P0001'; end if;
end $$;

-- updated_at + updated_by on every update (Doc 06 §2).
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['pages','journey_steps','impact_metrics','stories','partners','menu_items','events']
  loop
    execute format('drop trigger if exists set_updated_at on %I', t);
    execute format('create trigger set_updated_at before update on %I for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- referrals keeps updated_at without updated_by (no shared editorial columns there)
create or replace function set_updated_at_only() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists set_updated_at on referrals;
create trigger set_updated_at before update on referrals for each row execute function set_updated_at_only();

-- ---------------------------------------------------------------------------
-- Row Level Security. Default deny: RLS on, no write policies anywhere.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['pages','journey_steps','impact_metrics','stories','partners','menu_items',
                           'events','bookings','enquiries','referrals','subscribers','users','audit_log','rate_limits']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Baseline table grants: RLS is the gate, but grants are kept minimal too.
revoke all on all tables in schema public from anon, authenticated;
grant select on pages, journey_steps, impact_metrics, stories, partners, menu_items, events
  to anon, authenticated;
grant select on bookings, enquiries, referrals, subscribers, users, audit_log to authenticated;

-- Published content is public; editors and admins read everything (Doc 06 §3).
create policy "public read published" on pages for select
  using ((is_published and deleted_at is null) or jwt_role() in ('editor','admin'));
create policy "public read published" on journey_steps for select
  using (is_published or jwt_role() in ('editor','admin'));
create policy "public read published" on impact_metrics for select
  using (is_published or jwt_role() in ('editor','admin'));
create policy "public read published" on stories for select
  using ((is_published and deleted_at is null and consent_status = 'granted') or jwt_role() in ('editor','admin'));
create policy "public read published" on partners for select
  using (is_published or jwt_role() in ('editor','admin'));
create policy "public read published" on menu_items for select
  using (is_published or jwt_role() in ('editor','admin'));
create policy "public read published" on events for select
  using ((is_published and deleted_at is null) or jwt_role() in ('editor','admin'));

-- Operational tables
create policy "manager reads bookings" on bookings for select
  using (jwt_role() in ('manager','admin'));
create policy "admin reads enquiries" on enquiries for select
  using (jwt_role() = 'admin');
create policy "safeguarding reads referrals" on referrals for select
  using (jwt_role() in ('safeguarding','admin'));
create policy "admin reads subscribers" on subscribers for select
  using (jwt_role() = 'admin');
create policy "self or admin reads users" on users for select
  using (id = auth.uid() or jwt_role() = 'admin');
create policy "admin and safeguarding read audit" on audit_log for select
  using (jwt_role() in ('admin','safeguarding'));
-- rate_limits: no policies at all. Definer functions only.

-- ---------------------------------------------------------------------------
-- Public write RPCs (Doc 06 §5.1). Essential validation lives here, not only in Zod.
-- ---------------------------------------------------------------------------
create or replace function submit_booking(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform check_rate_limit('booking:' || coalesce(payload->>'ip_hash','anon'), 5, interval '1 hour');
  if coalesce(payload->>'first_name','') = '' or coalesce(payload->>'last_name','') = '' then
    raise exception 'name is required';
  end if;
  if payload->>'email' !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'email does not look right';
  end if;
  if coalesce((payload->>'party_size')::int, 0) not between 1 and 40 then
    raise exception 'party size out of range';
  end if;
  if coalesce((payload->>'gdpr_consent')::boolean, false) is distinct from true then
    raise exception 'consent is required';
  end if;
  insert into bookings (type, event_id, first_name, last_name, email, phone, party_size,
                        requested_at, dietary_notes, source, gdpr_consent, marketing_consent)
  values (coalesce(payload->>'type','restaurant'), nullif(payload->>'event_id','')::uuid,
          payload->>'first_name', payload->>'last_name', payload->>'email', payload->>'phone',
          (payload->>'party_size')::int, (payload->>'requested_at')::timestamptz,
          payload->>'dietary_notes', 'website', true,
          coalesce((payload->>'marketing_consent')::boolean, false))
  returning id into v_id;
  return v_id;
end $$;

create or replace function submit_enquiry(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform check_rate_limit('enquiry:' || coalesce(payload->>'ip_hash','anon'), 5, interval '1 hour');
  if payload->>'type' not in ('contact','hire','partnership','employer','press','trainee','funder','educator','volunteer','donation') then
    raise exception 'unknown enquiry type';
  end if;
  if payload->>'email' !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'email does not look right';
  end if;
  if coalesce(payload->>'message','') = '' then raise exception 'message is required'; end if;
  insert into enquiries (type, first_name, last_name, email, organisation, phone, message, metadata, gdpr_consent, source_page)
  values (payload->>'type', coalesce(payload->>'first_name',''), coalesce(payload->>'last_name',''),
          payload->>'email', payload->>'organisation', payload->>'phone', payload->>'message',
          payload->'metadata', coalesce((payload->>'gdpr_consent')::boolean, false), payload->>'source_page')
  returning id into v_id;
  return v_id;
end $$;

create or replace function subscribe_newsletter(p_email text, p_source text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform check_rate_limit('subscribe:' || p_email, 3, interval '1 hour');
  if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'email does not look right';
  end if;
  insert into subscribers (email, source) values (lower(p_email), p_source)
  on conflict (email) do nothing; -- double opt-in mail sent by the edge layer
end $$;

create or replace function confirm_subscription(p_token uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update subscribers set status = 'confirmed', confirmed_at = now()
  where confirm_token = p_token and status = 'pending';
  get diagnostics n = row_count;
  return n > 0;
end $$;

create or replace function unsubscribe(p_token uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update subscribers set status = 'unsubscribed', unsubscribed_at = now()
  where confirm_token = p_token and status <> 'unsubscribed';
  get diagnostics n = row_count;
  return n > 0;
end $$;

-- ---------------------------------------------------------------------------
-- Editor RPCs (Doc 06 §5.2)
-- ---------------------------------------------------------------------------
create or replace function save_page_draft(p_slug text, p_sections jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform require_role('editor','admin');
  update pages set sections_draft = p_sections where slug = p_slug;
  if not found then raise exception 'unknown page %', p_slug; end if;
end $$;

create or replace function publish_page(p_slug text) returns void
language plpgsql security definer set search_path = public as $$
declare v pages%rowtype;
begin
  perform require_role('editor','admin');
  select * into v from pages where slug = p_slug;
  if not found then raise exception 'unknown page %', p_slug; end if;
  update pages set sections = coalesce(sections_draft, sections), sections_draft = null,
                   is_published = true, published_at = now()
  where slug = p_slug;
  perform write_audit('publish_page', 'pages', v.id, to_jsonb(v.sections), v.sections_draft);
end $$;

create or replace function save_story(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform require_role('editor','admin');
  if coalesce((payload->>'featured')::boolean, false) then
    update stories set featured = false where featured; -- one featured at a time
  end if;
  insert into stories (id, slug, title, strapline, author_name, author_role, category, body_mdx,
                       pull_quote, featured, consent_status)
  values (coalesce(nullif(payload->>'id','')::uuid, gen_random_uuid()),
          payload->>'slug', payload->>'title', payload->>'strapline', payload->>'author_name',
          payload->>'author_role', payload->>'category', coalesce(payload->>'body_mdx',''),
          payload->>'pull_quote', coalesce((payload->>'featured')::boolean,false),
          coalesce(payload->>'consent_status','pending'))
  on conflict (id) do update set
    slug = excluded.slug, title = excluded.title, strapline = excluded.strapline,
    author_name = excluded.author_name, author_role = excluded.author_role,
    category = excluded.category, body_mdx = excluded.body_mdx,
    pull_quote = excluded.pull_quote, featured = excluded.featured,
    consent_status = excluded.consent_status
  returning id into v_id;
  return v_id;
end $$;

create or replace function publish_story(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_consent text;
begin
  perform require_role('editor','admin');
  select consent_status into v_consent from stories where id = p_id;
  if not found then raise exception 'unknown story'; end if;
  if v_consent <> 'granted' then
    raise exception 'story cannot publish without granted consent'; -- FR-06
  end if;
  update stories set is_published = true, published_at = now() where id = p_id;
  perform write_audit('publish_story', 'stories', p_id);
end $$;

create or replace function withdraw_story_consent(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform require_role('editor','admin','safeguarding');
  update stories set consent_status = 'withdrawn', is_published = false where id = p_id;
  perform write_audit('withdraw_story_consent', 'stories', p_id);
end $$;

create or replace function save_menu_item(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform require_role('editor','admin');
  if coalesce((payload->>'price_pence')::int, -1) < 0 then raise exception 'price required'; end if;
  insert into menu_items (id, name, description, price_pence, section, "order",
                          allergens, is_vegetarian, is_vegan, is_available, is_published)
  values (coalesce(nullif(payload->>'id','')::uuid, gen_random_uuid()),
          payload->>'name', payload->>'description', (payload->>'price_pence')::int,
          payload->>'section', (payload->>'order')::int,
          coalesce((select array_agg(x) from jsonb_array_elements_text(payload->'allergens') x), '{}'),
          coalesce((payload->>'is_vegetarian')::boolean,false),
          coalesce((payload->>'is_vegan')::boolean,false),
          coalesce((payload->>'is_available')::boolean,true),
          coalesce((payload->>'is_published')::boolean,true))
  on conflict (id) do update set
    name = excluded.name, description = excluded.description, price_pence = excluded.price_pence,
    section = excluded.section, "order" = excluded."order", allergens = excluded.allergens,
    is_vegetarian = excluded.is_vegetarian, is_vegan = excluded.is_vegan,
    is_available = excluded.is_available, is_published = excluded.is_published
  returning id into v_id;
  return v_id;
end $$;

create or replace function reorder_menu_items(p_section text, p_ordered_ids uuid[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform require_role('editor','admin');
  update menu_items m set "order" = x.ord
  from unnest(p_ordered_ids) with ordinality as x(id, ord)
  where m.id = x.id and m.section = p_section;
end $$;

create or replace function save_partner(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform require_role('editor','admin');
  insert into partners (id, name, category, website_url, short_note, "order", is_published)
  values (coalesce(nullif(payload->>'id','')::uuid, gen_random_uuid()),
          payload->>'name', payload->>'category', payload->>'website_url',
          payload->>'short_note', (payload->>'order')::int,
          coalesce((payload->>'is_published')::boolean,true))
  on conflict (id) do update set
    name = excluded.name, category = excluded.category, website_url = excluded.website_url,
    short_note = excluded.short_note, "order" = excluded."order", is_published = excluded.is_published
  returning id into v_id;
  return v_id;
end $$;

-- ---------------------------------------------------------------------------
-- Manager RPCs (Doc 06 §5.3)
-- ---------------------------------------------------------------------------
create or replace function update_booking_status(p_id uuid, p_status text, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare v_old text;
begin
  perform require_role('manager','admin');
  if p_status not in ('pending','confirmed','declined','cancelled','seated','no_show') then
    raise exception 'unknown status';
  end if;
  select status into v_old from bookings where id = p_id;
  if not found then raise exception 'unknown booking'; end if;
  update bookings set status = p_status, admin_note = coalesce(p_note, admin_note) where id = p_id;
  perform write_audit('update_booking_status', 'bookings', p_id,
                      jsonb_build_object('status', v_old), jsonb_build_object('status', p_status));
end $$;

-- ---------------------------------------------------------------------------
-- Safeguarding RPCs (Doc 06 §5.4). Notes encrypted at rest; reads audited.
-- ---------------------------------------------------------------------------
create or replace function create_referral(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  -- Public referral form submits through this gate; rate limited like other public writes.
  perform check_rate_limit('referral:' || coalesce(payload->>'ip_hash','anon'), 5, interval '1 hour');
  if payload->>'referrer_email' !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'email does not look right';
  end if;
  if length(coalesce(payload->>'candidate_last_name_initial','')) <> 1 then
    raise exception 'candidate is identified by first name and one initial only';
  end if;
  insert into referrals (referrer_name, referrer_organisation, referrer_email, referrer_phone,
                         candidate_first_name, candidate_last_name_initial, release_date,
                         supervision_status, risk_assessment_shared, notes_encrypted)
  values (payload->>'referrer_name', payload->>'referrer_organisation', payload->>'referrer_email',
          payload->>'referrer_phone', payload->>'candidate_first_name',
          upper(payload->>'candidate_last_name_initial'),
          nullif(payload->>'release_date','')::date, payload->>'supervision_status',
          coalesce((payload->>'risk_assessment_shared')::boolean,false),
          case when coalesce(payload->>'notes','') = '' then null
               else encode(pgp_sym_encrypt(payload->>'notes', enc_key()), 'base64') end)
  returning id into v_id;
  perform write_audit('create_referral', 'referrals', v_id);
  return v_id;
end $$;

create or replace function read_referral(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v referrals%rowtype;
begin
  perform require_role('safeguarding','admin');
  select * into v from referrals where id = p_id;
  if not found then raise exception 'unknown referral'; end if;
  perform write_audit('read_referral', 'referrals', p_id); -- every read is logged (Doc 06 §3.10)
  return to_jsonb(v) - 'notes_encrypted' ||
         jsonb_build_object('notes',
           case when v.notes_encrypted is null then null
                else pgp_sym_decrypt(decode(v.notes_encrypted, 'base64'), enc_key()) end);
end $$;

create or replace function update_referral(p_id uuid, patch jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare v_old text;
begin
  perform require_role('safeguarding','admin');
  select status into v_old from referrals where id = p_id;
  if not found then raise exception 'unknown referral'; end if;
  update referrals set
    status = coalesce(patch->>'status', status),
    outcome_note = coalesce(patch->>'outcome_note', outcome_note),
    assigned_to = coalesce(nullif(patch->>'assigned_to','')::uuid, assigned_to)
  where id = p_id;
  perform write_audit('update_referral', 'referrals', p_id,
                      jsonb_build_object('status', v_old), patch);
end $$;

-- ---------------------------------------------------------------------------
-- Admin RPCs (Doc 06 §5.5). invite_user lives in the app layer (auth.admin API).
-- ---------------------------------------------------------------------------
create or replace function deactivate_user(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform require_role('admin');
  update users set is_active = false where id = p_id;
  perform write_audit('deactivate_user', 'users', p_id);
end $$;

-- ---------------------------------------------------------------------------
-- Execute grants: public gates for everyone, staff gates for authenticated.
-- Function bodies enforce roles; grants narrow the surface further.
-- ---------------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon, authenticated;
-- Policies call jwt_role() with invoker rights, so read roles need it back.
grant execute on function jwt_role() to anon, authenticated;
grant execute on function auth.jwt(), auth.uid() to anon, authenticated;
grant execute on function submit_booking(jsonb), submit_enquiry(jsonb),
  subscribe_newsletter(text, text), confirm_subscription(uuid), unsubscribe(uuid),
  create_referral(jsonb) to anon, authenticated;
grant execute on function save_page_draft(text, jsonb), publish_page(text), save_story(jsonb),
  publish_story(uuid), withdraw_story_consent(uuid), save_menu_item(jsonb),
  reorder_menu_items(text, uuid[]), save_partner(jsonb), update_booking_status(uuid, text, text),
  read_referral(uuid), update_referral(uuid, jsonb), deactivate_user(uuid) to authenticated;
