import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.ROQ_SUPABASE_URL || 'https://eqmkdsbwdntagoawjdtf.supabase.co';
const supabaseAnonKey = process.env.ROQ_SUPABASE_ANON_KEY || 'sb_publishable_gHdcSweHTnLgi_eM2mw7lQ_AMcMSgu9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('URL:', JSON.stringify(supabaseUrl));
console.log('KEY:', supabaseAnonKey.length, JSON.stringify(supabaseAnonKey.slice(0, 12)));