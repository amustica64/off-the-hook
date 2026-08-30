-- 0003: a trainee enquiry may arrive without an email address.
--
-- DEVIATION FROM DOC 06 §3.9. Flagged for Abbey's sign-off, not assumed.
--
-- Why this is needed. Doc 04 and Doc 09 §3.16 both specify the /join form as
-- five fields: name or alias, phone, best time to call, referral status, and
-- optional notes. There is no email field, deliberately. Doc 09 calls /join
-- "the most humane page on the site", written for a "mobile-only, low-data
-- audience" who "may be in a hostel or library". Many people leaving prison do
-- not have an email address on day one. They have a phone.
--
-- Doc 06 §3.9 makes enquiries.email NOT NULL, and submit_enquiry validates it
-- against a regex. So the documented form cannot submit to the documented
-- table. That conflict only surfaces when the page is built, which is why it
-- has not been caught before now.
--
-- The alternatives, and why they lose. Adding an email field contradicts two
-- documents and quietly shuts out the audience the page exists for. Writing an
-- empty string keeps the NOT NULL but still fails the regex, and leaves a
-- column that lies about what it holds. Neither is better than relaxing the
-- constraint honestly.
--
-- What this does. email becomes nullable, and a check constraint requires at
-- least one route back to the person: an email or a phone. That is a stronger
-- guarantee than the old NOT NULL, which permitted a row with an email and no
-- other contact route but never checked there was any way to reply at all.
--
-- To roll back: alter table enquiries drop constraint enquiries_reachable;
--               update enquiries set email = '' where email is null;
--               alter table enquiries alter column email set not null;
--               then restore submit_enquiry from 0001.

alter table enquiries alter column email drop not null;

alter table enquiries add constraint enquiries_reachable
  check (coalesce(email, '') <> '' or coalesce(phone, '') <> '');

-- submit_enquiry: validate the email only when one is given, and require a
-- reachable contact route either way. Everything else is unchanged from 0001.
create or replace function submit_enquiry(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform check_rate_limit('enquiry:' || coalesce(payload->>'ip_hash','anon'), 5, interval '1 hour');
  if payload->>'type' not in ('contact','hire','partnership','employer','press','trainee','funder','educator','volunteer','donation') then
    raise exception 'unknown enquiry type';
  end if;
  if coalesce(payload->>'email','') = '' and coalesce(payload->>'phone','') = '' then
    raise exception 'we need either an email address or a phone number to reply';
  end if;
  if coalesce(payload->>'email','') <> ''
     and payload->>'email' !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'email does not look right';
  end if;
  if coalesce(payload->>'message','') = '' then raise exception 'message is required'; end if;
  insert into enquiries (type, first_name, last_name, email, organisation, phone, message, metadata, gdpr_consent, source_page)
  values (payload->>'type', coalesce(payload->>'first_name',''), coalesce(payload->>'last_name',''),
          nullif(payload->>'email',''), payload->>'organisation', payload->>'phone', payload->>'message',
          payload->'metadata', coalesce((payload->>'gdpr_consent')::boolean, false), payload->>'source_page')
  returning id into v_id;
  return v_id;
end $$;
