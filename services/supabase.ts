
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const SUPABASE_URL = 'https://hrplycehwhtmivelggqu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7OOEIf9eqAaRkOdTQaTvmw_s703Z9R3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
