-- Dev seed per Doc 06 §6. Idempotent upserts on stable slugs and keys.
-- Real copy in the site voice, no lorem ipsum. Never runs against production.

-- Journey steps: the seven, per Doc 04 §journey and Doc 08 §8.2.
insert into journey_steps ("order", title, subtitle, body, icon_key, outcome_summary) values
(1, 'Prison', 'Where we first meet', 'We meet people in the last six to twelve weeks of their sentence, through prison education teams and probation. No forms at this stage. A conversation, a straight explanation of what the work is, and an honest look at whether it fits.', 'door-closed', 'You know what the programme is and whether you want in.'),
(2, 'Referral', 'Someone opens a door', 'A probation officer, a prison education lead, or a resettlement charity sends a referral through this site. We reply within two working days. Urgent cases get a phone call the same day.', 'letter-hands', 'Your referrer hears back within two working days.'),
(3, 'Induction', 'The first week', 'Induction starts the week after release. Kitchen basics, food safety, the code of conduct, and a paid trial shift. You get your apron, your pin badge, and a named person to call.', 'apron', 'You are on the rota, paid, with a named contact.'),
(4, 'Training', 'Learning on the job', 'Twelve weeks in a working kitchen. Knife work, prep, the pass, front of house if you want it. One day a week is classroom time toward a City and Guilds qualification. All of it paid at the London Living Wage.', 'crossed-tools', 'You are cooking real food for paying diners.'),
(5, 'Service', 'The real thing', 'Service is the test that matters. Lunch and dinner, real orders, real pressure, real customers. The team runs the pass together. Nobody stands alone on a bad night.', 'plate', 'You can hold a station through a full service.'),
(6, 'Qualification', 'Paper that counts', 'Assessment happens in the kitchen, not an exam hall. The qualification is nationally recognised and goes with you whatever you do next. Most people finish with Level 2 Food Safety and a professional cookery credential.', 'certificate', 'You hold a qualification no one can take away.'),
(7, 'Employment', 'The other side', 'We work with employer partners who hire on skill, not record. Interviews are arranged before the programme ends. We stay in touch for a year, and the door here stays open.', 'door-open', 'You leave with a job, a reference, and a place to come back to.')
on conflict ("order") do update set title = excluded.title, subtitle = excluded.subtitle,
  body = excluded.body, icon_key = excluded.icon_key, outcome_summary = excluded.outcome_summary;

-- Impact metrics: current year, six keys per Doc 06 §3.3.
insert into impact_metrics (metric_key, year, value, unit, source_note, "order", is_published) values
('meals_served', 2026, 12400, null, 'Till records, weekly count', 1, true),
('people_trained', 2026, 42, null, 'Programme records', 2, true),
('qualifications_awarded', 2026, 61, null, 'City and Guilds registry', 3, true),
('employment_rate', 2026, 68, '%', 'Six-month follow-up calls, internal tracking', 4, true),
('wages_paid', 2026, 187000, 'GBP', 'Payroll, London Living Wage', 5, true),
('reoffending_rate', 2026, -41, '%', 'Compared with the national average for matched cohorts', 6, true)
on conflict (metric_key, year) do update set value = excluded.value, source_note = excluded.source_note;

-- Stories: two trainees, one kitchen note, one community (Doc 06 §6).
insert into stories (slug, title, strapline, author_name, author_role, category, body_mdx, pull_quote, consent_status, is_published, published_at) values
('danny-makes-bread', 'Danny makes bread', 'Six months ago he had never baked. Now the morning loaves are his.', 'Danny', 'Trainee, 2026', 'trainee',
 E'Danny came to us through a probation referral in February.\n\nHe asked for the kitchen jobs nobody wanted. Pot wash, prep, the six am start. Then the baker went on leave and someone had to do the loaves.\n\n"I never had a job I was proud of. Now I make bread every morning and someone eats it. That''s it. That''s the difference."\n\nDanny sits his Level 2 in September. The loaves sell out most days.',
 'I never had a job I was proud of. Now I make bread every morning and someone eats it.', 'granted', true, now()),
('michelle-runs-the-pass', 'Michelle runs the pass', 'From her first service to calling the orders in four months.', 'Michelle', 'Trainee, 2026', 'trainee',
 E'Michelle joined the third cohort. On her first service she dropped a full tray and nearly walked out.\n\nShe stayed. Four months later she calls the pass on Thursday nights, which is the busiest we have.\n\nShe is interviewing with two employer partners this month. Both asked for her by name.',
 'She stayed. Four months later she calls the pass on Thursday nights.', 'granted', true, now()),
('what-the-kitchen-taught-us', 'What the kitchen taught us this quarter', 'Kitchen notes from Anne.', 'Anne Kiragu', 'Founder', 'kitchen-notes',
 E'Three things we learned this quarter.\n\nMenus that change weekly keep trainees learning and diners returning. Short menus done well beat long menus done adequately. And a quiet Monday service is the best training ground we have.\n\nThe numbers are on the impact page, updated with sources.',
 null, 'granted', true, now()),
('the-tuesday-lunch-club', 'The Tuesday lunch club', 'Forty covers of local regulars, every week.', 'Anne Kiragu', 'Founder', 'community',
 E'The Tuesday lunch club started with six neighbours and a set menu.\n\nIt is now forty covers of regulars who book the same tables every week. Half of them know the trainees by name. That is the point.',
 null, 'granted', true, now())
on conflict (slug) do update set title = excluded.title, body_mdx = excluded.body_mdx;

-- Menu: a tight, honest set across sections (Doc 06 §3.5 sections).
insert into menu_items (name, description, price_pence, section, "order", allergens, is_vegetarian, is_vegan) values
('Sourdough, cultured butter', 'Baked this morning by the trainee bakery.', 450, 'small', 1, '{gluten,milk}', true, false),
('Cured mackerel, pickled rhubarb', 'Cornish mackerel, sharp and clean.', 850, 'small', 2, '{fish}', false, false),
('Roast beetroot, whipped feta, walnuts', null, 750, 'small', 3, '{milk,tree_nuts}', true, false),
('Chicken and leek pie for two', 'Proper pastry. Twenty minutes, worth it.', 2400, 'large', 1, '{gluten,milk,eggs}', false, false),
('Beef shin, mash, greens', 'Braised overnight. The kitchen''s favourite.', 1650, 'large', 2, '{milk,sulphites}', false, false),
('Market fish, brown butter, capers', 'Whatever the boats landed. Ask.', 1750, 'large', 3, '{fish,milk}', false, false),
('Squash and sage risotto', 'Finished at the pass, not before.', 1400, 'large', 4, '{milk}', true, false),
('Chips, kitchen salt', null, 450, 'sides', 1, '{}', true, true),
('Buttered greens', null, 400, 'sides', 2, '{milk}', true, false),
('Winter leaves, house dressing', null, 400, 'sides', 3, '{mustard}', true, true),
('Treacle tart, clotted cream', 'The recipe is a trainee''s grandmother''s.', 700, 'sweet', 1, '{gluten,milk,eggs}', true, false),
('Chocolate and olive oil mousse', null, 650, 'sweet', 2, '{eggs}', true, false),
('Sunday roast, all the trimmings', 'One sitting, book ahead.', 1900, 'set-menu', 1, '{gluten,milk,sulphites,eggs}', false, false)
on conflict do nothing;

-- Partners across categories.
insert into partners (name, category, website_url, short_note, "order") values
('St Giles Trust', 'referral', 'https://www.stgilestrust.org.uk', 'Resettlement referrals across London', 1),
('Bounce Back', 'referral', 'https://www.bouncebackproject.com', 'Training and employment charity', 2),
('City & Guilds', 'supporter', 'https://www.cityandguilds.com', 'Accredited qualifications', 1),
('National Lottery Community Fund', 'funder', 'https://www.tnlcommunityfund.org.uk', 'Programme funding', 1),
('Hawksmoor', 'employer', 'https://thehawksmoor.com', 'Employer partner, London sites', 1),
('Greene King', 'employer', 'https://www.greeneking.co.uk', 'Employer partner, national', 2)
on conflict do nothing;

-- Events.
insert into events (slug, title, starts_at, location, price_pence, capacity, summary, is_published) values
('supper-club-september', 'September supper club', now() + interval '30 days', 'The restaurant', 4500, 40, 'Five courses from the current cohort. One sitting.', true),
('alumni-evening-autumn', 'Alumni evening', now() + interval '45 days', 'The restaurant', null, 60, 'Free for alumni and their families. The door stays open.', true),
('employers-breakfast', 'Employers'' breakfast', now() + interval '21 days', 'The restaurant', null, 25, 'For heads of people who want to see the kitchen at work.', true)
on conflict (slug) do update set starts_at = excluded.starts_at;

-- Staff users (dev). IDs are stable so RLS tests can reference them.
insert into users (id, full_name, role) values
('00000000-0000-0000-0000-000000000001', 'Anne Kiragu', 'admin'),
('00000000-0000-0000-0000-000000000002', 'Dev Editor', 'editor'),
('00000000-0000-0000-0000-000000000003', 'Dev Safeguarding', 'safeguarding'),
('00000000-0000-0000-0000-000000000004', 'Dev Manager', 'manager')
on conflict (id) do update set role = excluded.role;

-- Pages: minimal sections blobs; full copy lands in Phase 5 per Doc 09.
insert into pages (slug, title, sections, is_published, published_at) values
('home', 'Home', '{"hero": {"eyebrow": "Hospitality-led social enterprise", "headline": "Real work. Real qualifications. Real chances."}}', true, now()),
('restaurant', 'The restaurant', '{"hero": {"headline": "Off the Hook, the restaurant"}}', true, now()),
('academy', 'The academy', '{"hero": {"headline": "From referral to a real job. Seven steps."}}', true, now()),
('impact', 'Impact', '{"hero": {"headline": "Impact"}}', true, now()),
('about', 'About', '{"hero": {"headline": "A CIC built around the kitchen we would want to work in."}}', true, now())
on conflict (slug) do update set sections = excluded.sections;
