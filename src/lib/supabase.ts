import { createClient } from '@supabase/supabase-js';

// 注意：Minimax 部署通常不支持环境变量，所以我们在这里直接填写
// 请确保从 Supabase 后台 (Settings -> API) 复制正确的 "anon" "public" 密钥
const supabaseUrl = 'https://eoqwtqludbqufdxljfny.supabase.co';
// 这里的 Key 是您刚刚在 Supabase 控制台拿到的 Publishable Key
const supabaseAnonKey = 'sb_publishable_blr540zkzbRjHt4aeshzfw_4MBR__-A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
