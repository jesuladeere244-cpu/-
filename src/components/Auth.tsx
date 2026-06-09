import React, { useState } from 'react';
import { supabase, getSupabaseDiagnostics } from '../lib/supabase';
import { LogIn, UserPlus, X, Mail, Lock, User, Copy, Check } from 'lucide-react';

interface AuthProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const TABLE_SQL_SCRIPT = `-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT
);

-- 2. Create pet_states table
CREATE TABLE IF NOT EXISTS public.pet_states (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TEXT
);

-- 3. Create friendships table
CREATE TABLE IF NOT EXISTS public.friendships (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, friend_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Security Policies
DROP POLICY IF EXISTS "Allow authenticated selects on profiles" ON public.profiles;
CREATE POLICY "Allow authenticated selects on profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual inserts/updates on profiles" ON public.profiles;
CREATE POLICY "Allow individual inserts/updates on profiles" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated selects on pet_states" ON public.pet_states;
CREATE POLICY "Allow authenticated selects on pet_states" ON public.pet_states FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual inserts/updates on pet_states" ON public.pet_states;
CREATE POLICY "Allow individual inserts/updates on pet_states" ON public.pet_states FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage competitive friendships" ON public.friendships;
CREATE POLICY "Allow users to manage competitive friendships" ON public.friendships FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to view relationships" ON public.friendships;
CREATE POLICY "Allow users to view relationships" ON public.friendships FOR SELECT TO authenticated USING (auth.uid() = friend_id);`;

export const Auth: React.FC<AuthProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const diagnostics = getSupabaseDiagnostics();

  const handleCopySql = () => {
    navigator.clipboard.writeText(TABLE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const getFriendlyError = (errStr: string) => {
    const lower = errStr.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
      return {
        title: '🔑 账号尚未在您的数据库中注册！',
        desc: '系统成功连上了您的 Supabase 数据库！但在高空数据库内没有检索到此邮箱与密码账户。',
        guide: '📢 您需要点击最底部的“还没有账号？点此注册”，注册一个全新的账号，注册完后数据库内就会自动生成该项账户！即可瞬间完成登录同步游玩！'
      };
    }
    if (lower.includes('email not confirmed') || lower.includes('email confirmation')) {
      return {
        title: '📧 注册邮箱需要等待激活验证',
        desc: '检测到注册服务通过了，但因 Supabase 库默认开启了极其严格的“邮箱强制确认”（Confirm Email）功能而无法进入系统。',
        guide: '📢 1秒免邮箱秒开方案：请在您的 Supabase 官网后台点击中间偏左侧的【Authentication】菜单 -> 点击下属子项目【Sign In / Providers】。在右侧看板中找到并点击【Email】进行展开，找到「Confirm email」配置开关并将其关闭，最后点击右下角的【Save】保存按钮。完成后重新点击注册就能即刻登入！'
      };
    }
    if (lower.includes('profiles') || lower.includes('relation') || lower.includes('table') || lower.includes('does not exist')) {
      return {
        title: '🗄️ 数据库中缺少必要的表（Table）',
        desc: '您的 Supabase 已经成功建立会话，但是高空数据库是一张白纸，没有我们记录角色及宠物数据所必须要用的 profiles / pet_states 的数据结构。',
        guide: '📢 解决方案：请在您的 Supabase 用户后台，点击左侧导航栏的【SQL Editor】，进入后点击【New Query】，在主输入区域贴入本面板下方的『一键建表 SQL 代码』，并点击右下角的【Run】按钮。看到反馈“Success”后，重新过来进行注册或登录操作便大功告成！'
      };
    }
    if (lower.includes('fetch') || lower.includes('network') || lower.includes('cors') || lower.includes('load failed')) {
      return {
        title: '🌐 云端数据库 API 连接请求受阻',
        desc: '在解析或发起连接时发生了网络阻断，多为提供的连接端点 URL 在后台拼写写错了（例如漏写了字母等），或者网络不畅和拦截。',
        guide: '📢 解决方案：请前往网页右上角 Settings 重新配置您的秘密 Secrets，确认 VITE_SUPABASE_URL 有无打错。'
      };
    }
    return {
      title: '⚠️ 操作请求未能执行成功',
      desc: `网卡原始报告: ${errStr}`,
      guide: '📢 调试建议：1. 确保您的邮箱尚未在别人或该库中被占用；2. 如果这是您的全新库，请务必先点击最下面的【点此注册】来建立新账号，之后便能支持一键记住登录！在注册前，点击下方复制建表 SQL，到控制台的 SQL Editor 运行一下。'
    };
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('数据库连接未建立，请检查 src/lib/supabase.ts 中的配置。');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess(data.user);
      } else {
        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        if (data.user) {
          // 创建初始 profile
          const { error: profileError } = await supabase!
            .from('profiles')
            .insert([{ id: data.user.id, username }]);
          if (profileError) console.error('Error creating profile:', profileError);
          onSuccess(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const friendlyError = error ? getFriendlyError(error) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? '欢迎回来' : '开启养宠之旅'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? '登录以同步你的宠物数据' : '注册并与好友一同竞技'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="起个好听的名字"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="邮箱地址"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="密码 (至少6位)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && friendlyError && (
              <div className="p-5 bg-amber-50/90 rounded-2xl border-2 border-amber-200 text-amber-900 text-sm overflow-hidden flex flex-col gap-3.5 max-h-[380px] overflow-y-auto">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-800 text-xs">
                  <span className="text-base">🛠️</span> 
                  {friendlyError.title}
                </div>
                
                <p className="text-[11px] text-amber-700 leading-relaxed font-sans text-left">
                  {friendlyError.desc}
                </p>
                
                <div className="whitespace-pre-wrap p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[10px] text-indigo-950 font-medium leading-relaxed font-sans text-left">
                  {friendlyError.guide}
                </div>

                {/* 智能复制建表 SQL，协助小白一键部署 */}
                <div className="bg-white border border-amber-200/80 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                      📁 一键复制建表 SQL 代码 (去 SQL Editor 运行)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 px-2   py-1 rounded-md transition-colors whitespace-nowrap"
                    >
                      {copiedSql ? (
                        <><Check className="w-3 h-3 text-emerald-600" /> 已复制</>
                      ) : (
                        <><Copy className="w-3 h-3" /> 点击复制</>
                      )}
                    </button>
                  </div>
                  <pre className="text-[9px] text-zinc-500 font-mono bg-zinc-50 p-2 rounded-lg max-h-[100px] overflow-auto border border-zinc-100 text-left select-all">
                    {TABLE_SQL_SCRIPT}
                  </pre>
                </div>

                <div className="p-3 bg-white/95 rounded-xl border border-amber-200/60 text-[11px] text-zinc-700 flex flex-col gap-1.5 leading-relaxed text-left">
                  <span className="font-extrabold text-indigo-700 block text-xs">🛠️ 数据库连接信息诊断：</span>
                  <div className="grid grid-cols-[65px_1fr] gap-x-1.5 gap-y-1 font-mono text-[10px] text-left">
                    <span className="text-zinc-500 font-sans">实际URL:</span>
                    <span className="break-all text-zinc-950 bg-zinc-50 p-1 rounded font-extrabold text-[9px] select-all">{diagnostics.activeUrl}</span>
                    
                    <span className="text-zinc-500 font-sans">实际Key:</span>
                    <span className="break-all text-zinc-950 bg-zinc-50 p-1 rounded font-extrabold text-[9px] select-all">{diagnostics.activeKeyMasked}</span>
                  </div>
                  {diagnostics.rawUrl !== diagnostics.activeUrl && diagnostics.rawUrl !== '未配置' && (
                    <span className="text-emerald-700 text-[10px] font-bold block mt-1">
                      ✨ [自愈助手] 已为您自动修复 URL 的格式及尾部斜杠！
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heavy rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all text-xs"
                  >
                    🚀 跳过登录，用「本地沙箱模式」直接开玩
                  </button>
                  
                  <div className="p-3 bg-white/80 rounded-xl text-[11px] text-zinc-600 border border-amber-100 flex flex-col gap-1 leading-relaxed text-left">
                    <span className="font-extrabold text-indigo-700 block text-xs">🎯 如何配置/修改您的数据库 Secrets：</span>
                    <span className="block">1. 请点击右上角 <b>Settings</b> 按钮。</span>
                    <span className="block">2. 在 <b>Secrets (秘密)</b> 配置中设置您的值：</span>
                    <code className="block bg-zinc-100 p-1.5 rounded text-[10px] font-mono break-all text-zinc-800 leading-normal text-left">
                      VITE_SUPABASE_URL = {diagnostics.rawUrl === '未配置' ? 'https://rhfsoewqdxdeyujudybw.supabase.co' : diagnostics.rawUrl}<br/>
                      VITE_SUPABASE_ANON_KEY = [在此粘贴您项目的 Anon 公开密钥]
                    </code>
                  </div>
                </div>

                <div className="text-[9px] text-amber-500 font-mono mt-1 pt-1 border-t border-amber-200/40 break-all text-left">
                  底层详细报错: {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? '处理中...' : isLogin ? <><LogIn className="w-5 h-5" /> 登录</> : <><UserPlus className="w-5 h-5" /> 注册账号</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isLogin ? '还没有账号？点此注册' : '已有账号？立即登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
