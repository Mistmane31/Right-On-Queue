import { supabase } from './supabaseClient';

const PREVIEW = process.env.REACT_APP_UI_PREVIEW === 'true';

const emailFor = (username) => `${username.trim().toLowerCase()}@rightonqueue.local`;

export async function signUp(username, password) {
  const trimmed = username.trim();
  if (!trimmed) throw new Error('Username is required.');

  const { data: existing } = await supabase
    .from('users')
    .select('userid')
    .eq('username', trimmed)
    .maybeSingle();
  if (existing) throw new Error('That username is already been thought of, be more creative.');

  const email = emailFor(trimmed);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user) {
    const { error: profileErr } = await supabase
      .from('users')
      .insert({ userid: data.user.id, username: trimmed, email });
    if (profileErr) throw profileErr;
  }
  return data.session;
}

export async function logIn(username, password) {
  const { data: profile } = await supabase
    .from('users')
    .select('email')
    .eq('username', username.trim())
    .maybeSingle();

  if (!profile) throw new Error('Incorrect username or password.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });
  if (error) throw new Error('Incorrect username or password.');
  return data.session;
}

export async function logOut() {
  if (PREVIEW) return;
  await supabase.auth.signOut();
}

export async function getUsername(userId) {
  if (PREVIEW) return 'Guest Chef';
  const { data } = await supabase.from('users').select('username').eq('userid', userId).maybeSingle();
  return data?.username ?? '';
}
