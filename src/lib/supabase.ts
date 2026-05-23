/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// 支持从环境变量读取，同时保留硬编码值做为备用兜底，确保在任何部署环境下都能正常工作
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eoqwtqludbqufdxljfny.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_blr540zkzbRjHt4aeshzfw_4MBR__-A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
