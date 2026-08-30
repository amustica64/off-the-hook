-- RLS proof per Doc 06 §13 and Doc 07 §16, runnable on the local shim and on a Supabase branch.
-- Each check raises on failure, so a clean exit means every assertion held.

\set ON_ERROR_STOP on

-- Reset transient state so the proof file is re-runnable.
reset role;
delete from rate_limits;

-- Helper to switch identity: set the pg role and the JWT claims like Supabase does.
-- anon: role anon, empty claims. Staff: role authenticated + role claim.

-- 1. Anonymous can read published content
set role anon;
select set_config('request.jwt.claims', '', false);
do $$ begin
  if (select count(*) from journey_steps) <> 7 then raise exception 'anon cannot read journey'; end if;
  if (select count(*) from stories) < 1 then raise exception 'anon cannot read stories'; end if;
  if (select count(*) from menu_items) < 1 then raise exception 'anon cannot read menu'; end if;
end $$;

-- 2. Anonymous cannot read a single sensitive row
do $$ begin
  if (select count(*) from bookings) <> 0 then raise exception 'anon can read bookings'; end if;
exception when insufficient_privilege then null; -- grant-level denial also passes
end $$;
do $$ begin
  if (select count(*) from referrals) <> 0 then raise exception 'anon can read referrals'; end if;
exception when insufficient_privilege then null;
end $$;

-- 3. Anonymous cannot write directly, even to public content
do $$ begin
  insert into stories (slug, title, category, body_mdx) values ('hack', 'x', 'trainee', 'x');
  raise exception 'anon wrote a story directly';
exception when insufficient_privilege then null; end $$;
do $$ begin
  update menu_items set price_pence = 1;
  raise exception 'anon updated menu directly';
exception when insufficient_privilege then null; end $$;

-- 4. Anonymous CAN submit through the public RPC gates
select set_config('app.enc_key', 'dev-only-key', false);
do $$
declare v uuid;
begin
  v := submit_booking(jsonb_build_object(
    'first_name','Priya','last_name','Shah','email','priya@example.com',
    'party_size', 4, 'requested_at', now()::text, 'gdpr_consent', true, 'ip_hash', 'test1'));
  if v is null then raise exception 'booking RPC failed'; end if;
  v := create_referral(jsonb_build_object(
    'referrer_name','Mark','referrer_organisation','St Giles Trust','referrer_email','mark@stgiles.org.uk',
    'candidate_first_name','John','candidate_last_name_initial','d','notes','Sensitive context here','ip_hash','test1'));
  if v is null then raise exception 'referral RPC failed'; end if;
end $$;

-- 5. Bad input is rejected at the gate, not stored
do $$ begin
  perform submit_booking(jsonb_build_object('first_name','x','last_name','y','email','not-an-email',
    'party_size',2,'requested_at',now()::text,'gdpr_consent',true,'ip_hash','test2'));
  raise exception 'invalid email accepted';
exception when others then
  if sqlerrm not like '%email%' then raise; end if;
end $$;

-- 6. Rate limiting trips on a burst
do $$
declare i int; tripped boolean := false;
begin
  for i in 1..7 loop
    begin
      perform submit_enquiry(jsonb_build_object('type','contact','first_name','a','last_name','b',
        'email','burst@example.com','message','hello','ip_hash','burst-test'));
    exception when others then
      if sqlerrm like '%rate limited%' then tripped := true; end if;
    end;
  end loop;
  if not tripped then raise exception 'rate limit never tripped'; end if;
end $$;

-- 7. Editor reads all content but not one referral row
set role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000002","role":"editor","email":"editor@dev"}', false);
do $$ begin
  if (select count(*) from referrals) <> 0 then raise exception 'editor can read referrals'; end if;
  if (select count(*) from bookings) <> 0 then raise exception 'editor can read bookings'; end if;
end $$;

-- 8. Editor cannot publish a story without granted consent (FR-06)
do $$
declare v uuid;
begin
  v := save_story(jsonb_build_object('slug','pending-consent-' || gen_random_uuid(),'title','Pending','category','trainee',
    'body_mdx','x','consent_status','pending'));
  begin
    perform publish_story(v);
    raise exception 'published without consent';
  exception when others then
    if sqlerrm not like '%consent%' then raise; end if;
  end;
end $$;

-- 9. Kitchen role can read published content and touch nothing else
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000009","role":"kitchen","email":"kitchen@dev"}', false);
do $$ begin
  if (select count(*) from menu_items) < 1 then raise exception 'kitchen cannot read menu'; end if;
  if (select count(*) from referrals) <> 0 then raise exception 'kitchen can read referrals'; end if;
  begin
    perform update_booking_status((select id from bookings limit 1), 'confirmed', null);
    raise exception 'kitchen updated a booking';
  exception when others then
    if sqlerrm not like '%not authorised%' and sqlerrm not like '%unknown booking%' then raise; end if;
  end;
end $$;

-- 10. Safeguarding reads a referral, notes decrypt, and the read is audited
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000003","role":"safeguarding","email":"sg@dev"}', false);
select set_config('app.enc_key', 'dev-only-key', false);
do $$
declare r jsonb; audit_before int; audit_after int;
begin
  if (select count(*) from referrals) < 1 then raise exception 'safeguarding cannot read referrals'; end if;
  select count(*) into audit_before from audit_log where action = 'read_referral';
  r := read_referral((select id from referrals limit 1));
  if r->>'notes' <> 'Sensitive context here' then raise exception 'notes did not decrypt'; end if;
  select count(*) into audit_after from audit_log where action = 'read_referral';
  if audit_after <> audit_before + 1 then raise exception 'referral read was not audited'; end if;
end $$;

-- 11. Manager updates a booking and the change is audited
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000004","role":"manager","email":"mgr@dev"}', false);
do $$ begin
  perform update_booking_status((select id from bookings limit 1), 'confirmed', 'window table');
exception when insufficient_privilege then
  raise exception 'manager blocked from booking update';
end $$;

-- Audit verified as superuser: managers rightly cannot read audit_log themselves.
reset role;
do $$ begin
  if (select count(*) from audit_log where action = 'update_booking_status') < 1 then
    raise exception 'booking update was not audited';
  end if;
end $$;

-- 12. Raw referral notes are ciphertext at rest
reset role;
do $$
declare raw text;
begin
  select notes_encrypted into raw from referrals where notes_encrypted is not null limit 1;
  if raw is null or raw like '%Sensitive context%' then
    raise exception 'referral notes are not encrypted at rest';
  end if;
end $$;

select 'ALL RLS PROOFS PASSED' as result;
