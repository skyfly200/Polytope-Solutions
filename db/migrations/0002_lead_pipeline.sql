-- Lead intake: clients double as leads. The /start form creates a client row
-- with status 'new' and the fields the visitor filled in. Statuses follow the
-- sales pipeline: new -> discovery -> quoted -> won / lost.

alter table clients
  add column status              text not null default 'new'
                                 check (status in ('new', 'discovery', 'quoted', 'won', 'lost')),
  add column source              text,
  add column solution_area       text,
  add column project_description text,
  add column timeline            text,
  add column budget              text,
  add column referral_source     text,
  add column submitter_hash      text;

-- Rate limiting on /start counts recent submissions per hashed IP.
create index clients_submitter_recent_idx on clients (submitter_hash, created_at)
  where submitter_hash is not null;

create index clients_status_idx on clients (status);
