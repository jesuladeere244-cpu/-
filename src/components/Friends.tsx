import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { audioService } from '../services/audioService';
import { 
  Users, UserPlus, Copy, Check, Search, Trash2, 
  Heart, Swords, Home, Sparkles, Smile, Trophy, Target 
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [interactionLog, setInteractionLog] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
    setInviteCode(userId.slice(0, 8).toUpperCase());
  }, [userId]);

  const getSpeciesEmoji = (species: string, level: number = 1): string => {
    if (species === 'slime') {
      if (level <= 20) return '💧';
      if (level <= 35) return '🌫️';
      if (level <= 45) return '🔮';
      if (level <= 55) return '🌋';
      if (level <= 65) return '❄️';
      if (level <= 75) return '🌀';
      if (level <= 85) return '👾';
      if (level <= 95) return '🌸';
      return '🌟';
    }
    const mapping: { [key: string]: string } = {
      slime: '💧',
      dragon: '🐉',
      cat: '🐈',
      robot: '🤖',
      rabbit: '🐇',
      panda: '🐼',
      frog: '🐸',
      pig: '🐷',
      tiger: '🐯',
      elephant: '🐘',
      dinosaur: '🦖',
      fox: '🦊',
      penguin: '🐧',
      lion: '🦁',
      eevee: '🦊',
      vaporeon: '💧',
      jolteon: '⚡',
      flareon: '🔥',
      espeon: '☀️',
      umbreon: '🌙',
      sylveon: '✨',
      leafeon: '🍃',
      glaceon: '❄️',
      bulbasaur: '🍃',
      ivysaur: '🌺',
      venusaur: '🌴',
      charmander: '🔥',
      charmeleon: '🦖',
      charizard: '🐉',
      pichu: '🍼',
      pikachu: '⚡',
      raichu: '⚡',
    };
    return mapping[species] || '🐱';
  };

  const fetchFriends = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // 1. 获取好友 ID
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', userId);

      if (friendshipsError) throw friendshipsError;

      if (!friendshipsData || friendshipsData.length === 0) {
        setFriends([]);
        return;
      }

      const friendIds = friendshipsData.map(f => f.friend_id);

      // 2. 获取好友的 profile 基本信息
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', friendIds);

      if (profilesError) throw profilesError;

      // 3. 获取好友的 pet_states
      const { data: petStatesData, error: petStatesError } = await supabase
        .from('pet_states')
        .select('user_id, content')
        .in('user_id', friendIds);

      // 4. 拼装成拼图好友
      const enrichedFriends = (profilesData || []).map(profile => {
        const petStateRow = petStatesData?.find(ps => ps.user_id === profile.id);
        const petStateContent = petStateRow?.content;
        
        let petInfo = {
          name: '无畏小灵兽',
          species: 'slime',
          level: 1,
          xp: 0,
          points: 0,
        };

        if (petStateContent && petStateContent.activeProfileId && petStateContent.profiles) {
          const activeProf = petStateContent.profiles[petStateContent.activeProfileId];
          if (activeProf && activeProf.pet) {
            petInfo = {
              name: activeProf.pet.name || '小可爱',
              species: activeProf.pet.species || 'slime',
              level: activeProf.pet.level || 1,
              xp: activeProf.pet.xp || 0,
              points: activeProf.pet.points || 0,
            };
          }
        }

        return {
          id: profile.id,
          username: profile.username || '神秘小伙伴',
          avatar_url: profile.avatar_url,
          pet: petInfo,
        };
      });

      setFriends(enrichedFriends);
    } catch (err: any) {
      console.error('Error loading friends details:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async () => {
    if (!supabase || !friendCode) return;
    setLoading(true);
    setMessage(null);
    setInteractionLog(null);

    try {
      // 1. 全局匹配邀请码 (UUID 的前 8 位)
      const { data: allProfiles, error: findError } = await supabase
        .from('profiles')
        .select('id, username');

      if (findError || !allProfiles) throw new Error('查询数据库用户失败');

      const targetUser = allProfiles.find(p => 
        p.id.slice(0, 8).toUpperCase() === friendCode.trim().toUpperCase()
      );

      if (!targetUser) throw new Error('找不到该邀请码对应的用户');
      if (targetUser.id === userId) throw new Error('不能添加自己哦，让别的小伙伴加你吧！');

      // 2. 仅向 friendships 中插入一条自己 -> 好友的连结，完全避开 RLS 与外键问题
      const { error: addError } = await supabase
        .from('friendships')
        .insert([
          { user_id: userId, friend_id: targetUser.id }
        ]);

      if (addError) {
        if (addError.code === '23505') throw new Error('你们已经是好友啦');
        throw addError;
      }

      audioService.play('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMessage(`🎉 成功添加好友 ${targetUser.username}！`);
      setFriendCode('');
      fetchFriends();
    } catch (err: any) {
      setMessage(err.message || '添加好友异常');
    } finally {
      setLoading(false);
    }
  };

  const deleteFriend = async (friendId: string, friendName: string) => {
    if (!supabase) return;
    if (!window.confirm(`确定要解除与 ${friendName} 的好友关系吗？`)) return;

    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId);

      if (error) throw error;
      
      setMessage(`已解除与 ${friendName} 的好友关系。`);
      fetchFriends();
    } catch (err: any) {
      setMessage(err.message || '删除好友失败');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    audioService.play('click');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 1. 互动：拍一拍拍出火花
  const handlePoke = (friend: any) => {
    audioService.play('click');
    confetti({ particleCount: 50, spread: 50, colors: ['#E040FB', '#00E5FF'] });
    setInteractionLog(`👉 你拍了拍 ${friend.username} 的宝贝宠物「${friend.pet.name}」，并朝它挥了挥手！👋 「${friend.pet.name}」开心地对你眨了眨眼睛！✨`);
  };

  // 2. 互动：友情串门
  const handleVisit = (friend: any) => {
    audioService.play('shower');
    confetti({ particleCount: 60, spread: 80, colors: ['#FFEB3B', '#4CAF50'] });
    setInteractionLog(`🏠 串门成功！你带着你的宠物去拜访了 ${friend.username} 的温馨学习屋！跟「${friend.pet.name}」在一起度过了一段难忘的玩耍时光，你们两个宠物的【快乐值】都获得了加满！💖`);
  };

  // 3. 互动：学习力比拼 PK
  const handleBattle = (friend: any) => {
    audioService.play('evolution');
    setInteractionLog(`⚔️ 正在与 ${friend.username} 的宠物「${friend.pet.name}」进行激烈的学习力比拼...`);
    
    setTimeout(() => {
      const luckyFactor = Math.random();
      const win = luckyFactor > 0.45;
      
      confetti({ particleCount: 80, spread: 60, colors: win ? ['#FFD54F', '#4CAF50'] : ['#E0E0E0'] });
      
      if (win) {
        setInteractionLog(`🏆 学习力大捷！在今日的学习效率和专注PK中，你的宠物战胜了「${friend.pet.name}」！获得了 15 点学习币气势奖励！`);
      } else {
        setInteractionLog(`💪 虽败犹荣！在专注值比拼中，你的宠物稍微逊色于「${friend.pet.name}」的强力专注，下次加油学习，争取更上一层楼！`);
      }
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-xl border-4 border-[#FFF9F2] h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#5D4037] flex items-center gap-3 font-hand">
            <Users className="w-8 h-8 text-indigo-500 animate-pulse" />
            联络社群 / 我的好友
          </h2>
          <p className="text-[#8D6E63] font-bold text-sm mt-1">
            加好友查看小伙伴们的真实宠物升级详情，一起见证学术巅峰！
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 rounded-[2rem] flex items-center gap-4 border-2 border-orange-100 shadow-sm self-stretch md:self-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-orange-400 tracking-widest leading-none">我的专属邀请码</span>
            <span className="font-mono font-black text-lg text-orange-700 leading-tight mt-1">{inviteCode}</span>
          </div>
          <button 
            onClick={copyCode}
            className="p-2.5 bg-white hover:bg-orange-100/50 rounded-2xl border-2 border-orange-100 transition-all active:scale-95 shadow-sm"
            title="复制邀请码"
          >
            {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-orange-400" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#8D6E63] opacity-60" />
          <input
            type="text"
            placeholder="输入好友的 8 位邀请码 (例如: 3B063F4A)"
            className="w-full pl-12 pr-4 py-3.5 bg-white/70 border-4 border-[#EFEBE9] rounded-2xl focus:border-indigo-400 outline-none text-[#5D4037] font-bold placeholder-gray-400 shadow-inner text-sm transition-all"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
        </div>
        <button
          onClick={addFriend}
          disabled={loading || !friendCode}
          className="px-8 bg-indigo-600 text-white rounded-2xl font-black shadow-[4px_4px_0px_#3F51B5] hover:bg-indigo-700 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 border-2 border-[#5D4037]"
        >
          <UserPlus className="w-5 h-5" />
          加为好友
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-2xl font-bold flex items-center gap-3 border-2 text-center text-sm ${message.includes('成功') ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]' : 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]'}`}>
          <Smile className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1">{message}</p>
        </div>
      )}

      {interactionLog && (
        <div className="mb-6 p-4 bg-indigo-50 border-2 border-indigo-100 rounded-3xl text-[#3F51B5] font-black text-sm flex items-start gap-3 shadow-inner relative overflow-hidden animate-fade-in animate-pulse">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] bg-indigo-200 uppercase px-1.5 py-0.5 rounded mr-1">互动消息</span>
            {interactionLog}
          </div>
          <button 
            onClick={() => setInteractionLog(null)} 
            className="text-xs hover:text-[#5D4037] font-bold ml-2 self-center bg-white border border-indigo-200 px-2 py-1 rounded-xl transition-all"
          >
            清除
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide max-h-[420px]">
        {loading && friends.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[#FFF9F2]/40 rounded-[2rem] border-4 border-[#EFEBE9] border-dashed">
            <Heart className="w-16 h-16 mb-4 text-rose-300 animate-bounce" />
            <p className="text-lg font-black text-[#5D4037]">这里空空如也，还没有添加好友哦</p>
            <p className="text-xs text-[#8D6E63] mt-2 font-bold max-w-sm text-center leading-relaxed">
              输入上方小伙伴的专属 8 位邀请码。添加成功后，你可以实时查看到对方的宠物详情，以及一键发起好友PK比拼！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((f) => (
              <div 
                key={f.id} 
                className="bg-white p-5 rounded-[2.5rem] border-4 border-[#EFEBE9] shadow-[6px_6px_0px_#EFEBE9] flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#D7CCC8] transition-all relative group overflow-hidden"
              >
                {/* Friend Info & Pet Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-50 border-2 border-indigo-100 rounded-full flex items-center justify-center text-2xl shadow-inner relative">
                    <span className="text-center select-none" role="img" aria-label="avatar">
                      {getSpeciesEmoji(f.pet.species, f.pet.level)}
                    </span>
                    <span className="absolute -bottom-1 -right-1 text-xs bg-[#FFB300] text-white w-5 h-5 rounded-full flex items-center justify-center font-black border border-white">
                      {f.pet.level}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-gray-800 text-base truncate">{f.username}</h4>
                      <span className="text-[10px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded">学神在线</span>
                    </div>
                    
                    <p className="text-xs font-bold text-[#8D6E63] mt-1 flex items-center gap-1">
                      <span>宠物: </span>
                      <span className="text-[#FF7043] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100/50">
                        {getSpeciesEmoji(f.pet.species, f.pet.level)} {f.pet.name}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Friend Stats Display */}
                <div className="grid grid-cols-2 gap-2 bg-[#F9FBE7]/60 p-3 rounded-2xl border-2 border-[#F0F4C3] mb-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>等级: <strong className="text-amber-800">Lv.{f.pet.level}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#8E24AA]" />
                    <span>经验: <strong className="text-[#8E24AA]">{f.pet.xp} XP</strong></span>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#EFEBE9]">
                  <button 
                    onClick={() => handlePoke(f)}
                    className="flex-1 py-2 bg-[#FFF3E0] hover:bg-[#FFE0B2] text-orange-700 rounded-xl text-xs font-black border-2 border-orange-100 shadow-[2px_2px_0px_#FFE0B2] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    拍一拍
                  </button>
                  <button 
                    onClick={() => handleVisit(f)}
                    className="flex-1 py-2 bg-[#E1F5FE] hover:bg-[#B3E5FC] text-sky-700 rounded-xl text-xs font-black border-2 border-sky-100 shadow-[2px_2px_0px_#B3E5FC] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    串门
                  </button>
                  <button 
                    onClick={() => handleBattle(f)}
                    className="flex-1 py-2 bg-[#EDE7F6] hover:bg-[#D1C4E9] text-purple-700 rounded-xl text-xs font-black border-2 border-purple-100 shadow-[2px_2px_0px_#D1C4E9] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    PK比拼
                  </button>
                  
                  <button 
                    onClick={() => deleteFriend(f.id, f.username)}
                    className="p-2 py-2 bg-[#FFEBEE] hover:bg-red-200 text-rose-600 rounded-xl border-2 border-red-100 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                    title="删除好友"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-[#FFF3E0] rounded-[2rem] border-4 border-[#FFE0B2] text-center">
        <p className="text-xs font-semibold text-[#5D4037]">
          💡 <b>小提示：</b> 拥有好友后，这些小伙伴也会带着他们的宠物加入并参与你的 <b>“光荣榜 (排行榜)”</b> 里，你和他们将在每周大比拼一决雌雄！
        </p>
      </div>
    </div>
  );
};
