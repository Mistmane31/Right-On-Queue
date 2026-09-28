import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://eqmkdsbwdntagoawjdtf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_gHdcSweHTnLgi_eM2mw7lQ_AMcMSgu9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
