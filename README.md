# Final Project

## My project repository

Public repository: [https://github.com/Mistmane31/Right-On-Queue](https://github.com/Mistmane31/Right-On-Queue)

## What it is

Right On Queue is a recipe-keeping app that doesn’t require cooks, whether by-the-book or instinctive, to navigate away 
from it to set a timer for time-gated steps or rearranging steps mid-dish.

## How to run it

## Setup

### Prerequisites
- [Node.js](https://nodejs.org) (LTS, version 18 or newer)
- A free account at [supabase.com](https://supabase.com)

### 1. Unzip or clone the project, then open a terminal in its root folder — the one containing `package.json` — and run:
```
npm install
```
This also installs `@supabase/supabase-js`, already listed as a dependency.

### 2. In the Supabase dashboard, click **New Project**, choose a name and a database password (keep this separate from any other password you use), and wait for it to finish provisioning.

### 3. In Supabase, go to **SQL Editor** and run:
```sql
create table users (
  userid uuid primary key references auth.users (id),
  username text unique not null,
  email text
);

create table recipe (
  recipeid uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) not null,
  name text not null,
  created_at timestamptz default now()
);

create table steps (
  stepid uuid primary key default gen_random_uuid(),
  recipeid uuid references recipe (recipeid) on delete cascade not null,
  step_number int4 not null,
  step_name text not null,
  step_description text default '',
  step_duration int4 default 0
);

create table queue (
  queueid uuid primary key default gen_random_uuid(),
  stepid uuid references steps (stepid) on delete cascade not null,
  queue_order int4 not null,
  time_remaining int4 default 0,
  status text default 'pending'
);
```

### 4. Enable Row Level Security and add policies, by running:
```sql
alter table users enable row level security;
alter table recipe enable row level security;
alter table steps enable row level security;
alter table queue enable row level security;

create policy "public can look up email by username for login"
on users for select
using (true);

create policy "users can insert their own profile"
on users for insert
with check (auth.uid() = userid);

create policy "users manage their own recipes"
on recipe for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage steps on their own recipes"
on steps for all
using (exists (select 1 from recipe where recipe.recipeid = steps.recipeid and recipe.user_id = auth.uid()))
with check (exists (select 1 from recipe where recipe.recipeid = steps.recipeid and recipe.user_id = auth.uid()));

create policy "users manage their own queue"
on queue for all
using (exists (
  select 1 from steps join recipe on recipe.recipeid = steps.recipeid
  where steps.stepid = queue.stepid and recipe.user_id = auth.uid()
))
with check (exists (
  select 1 from steps join recipe on recipe.recipeid = steps.recipeid
  where steps.stepid = queue.stepid and recipe.user_id = auth.uid()
));
```

### 5. Configure Supabase Auth for the login feature:
- **Authentication → Providers**: confirm Email is enabled.
- **Authentication → Settings**: turn **off** "Confirm email." Sign-up generates a placeholder address with no real inbox behind it, so leaving confirmation on would lock every account out.

### 6. In Supabase, go to **Project Settings → API** and copy the Project URL and the publishable (anon) key. In the project's root folder, create a file named `.env` (BUT, if there's an env file already present in the repository, IGNORE this step):
```
REACT_APP_SUPABASE_URL=https://eqmkdsbwdntagoawjdtf.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_gHdcSweHTnLgi_eM2mw7lQ_AMcMSgu9
```

### 7. On the same terminal, run:
```
npm start
```
This will either open your browser automatically or print a link — `http://localhost:3000` — to open yourself. The database starts empty, so use the app's own **"Don't have an account? Sign up here!"** link on the login page to create your account. Fill up the Username (ex. ProCook1) and password, and feel free to finally explore the app's features. 

## Presentation

- Video, Slides, and Square Image (via GDrive): [Link here!](https://drive.google.com/drive/folders/14-8KdnFnMEnHpTnl9wwmOgS9qSHyZaNp?usp=sharing)

## AI usage

Link to the `AI-USAGE.md` in my project repository:
https://github.com/YOUR-USERNAME/YOUR-REPO/blob/main/AI-USAGE.md
