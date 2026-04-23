import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, UserPlus, Copy, Check, Search, Trash2, Heart } from 'lucide-react';

interface FriendsProps {
  userId: string;
}

export const Friends: React.FC<FriendsProps> = ({ userId }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [friendCode, setFriendCode] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
    setInviteCode(userId.slice(0, 8).toUpperCase());
  }, [userId]);

  const fetchFriends = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('friendships')
      .select('friend_id, profiles!friendships_friend_id_fkey(username, avatar_url)')
      .eq('user_id', userId);

    if (data && !error) {
      setFriends(data);
    }
  };

  const addFriend = async () => {
    if (!supabase || !friendCode) return;
    setLoading(true);
    setMessage(null);

    try {
      // 通过前8位匹配 ID
      const { data: targetUser, error: findError } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('id', `${friendCode}%`)
        .limit(1)
        .single();

      if (findError || !targetUser) throw new Error('找不到该邀请码对应的用户');
      if (targetUser.id === userId) throw new Error('不能添加自己为好友哦');

      const { error: addError } = await supabase
        .from('friendships')
        .insert([
          { user_id: userId, friend_id: targetUser.id },
          { user_id: targetUser.id, friend_id: userId } // 双向好友
        ]);

      if (addError) {
        if (addError.code === '23505') throw new Error('你们已经是好友啦');
        throw addError;
      }

      setMessage(`成功添加好友：${targetUser.username}！`);
      setFriendCode('');
      fetchFriends();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-indigo-500" />
          我的好友
        </h2>
        <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex items-center gap-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">我的邀请码</span>
          <span className="font-mono font-bold text-indigo-600">{inviteCode}</span>
          <button 
            onClick={copyCode}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="输入好友邀请码"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
        </div>
        <button
          onClick={addFriend}
          disabled={loading || !friendCode}
          className="px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          添加
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm text-center ${message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Heart className="w-12 h-12 mb-3 opacity-20" />
            <p>还没有好友一起玩哦</p>
            <p className="text-xs">快邀请小伙伴加入吧！</p>
          </div>
        ) : (
          friends.map((f, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl shadow-inner">
                  {f.profiles.avatar_url || '🧑‍🚀'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{f.profiles.username}</h4>
                  <p className="text-xs text-gray-400">活跃中</p>
                </div>
              </div>
              <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
