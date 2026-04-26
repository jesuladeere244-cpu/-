import { createClient } from '@supabase/supabase-js';

// 注意：Minimax 部署通常不支持环境变量，所以我们在这里直接填写
// 请确保从 Supabase 后台 (Settings -> API) 复制正确的 "anon" "public" 密钥
const supabaseUrl = 'https://eoqwtqludbqufdxljfny.supabase.co';
// 这里的 Key 如果还是以 Alza 开头就是错的！它必须是以 eyJ 开头的长字符串
const supabaseAnonKey = '请在此处填入以eyJ开头的Supabase_Anon_Key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
