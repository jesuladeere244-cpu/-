import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check, Coins, Package, Plus, Trash2, Settings2, X, Gift, Sparkles } from 'lucide-react';
import { ShopItem } from '../types';
import { cn } from '../lib/utils';

interface ShopProps {
  items: ShopItem[];
  points: number;
  inventory: string[];
  onPurchase: (itemId: string) => void;
  onUseItem: (itemId: string) => void;
  onAddItem: (item: Omit<ShopItem, 'id'>) => void;
  onDeleteItem: (itemId: string) => void;
}

interface ItemCardProps {
  item: ShopItem;
  isOwned: boolean;
  canAfford: boolean;
  isParentMode: boolean;
  onPurchase: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isOwned, canAfford, isParentMode, onPurchase, onDeleteItem }) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white rounded-[2.5rem] border-4 p-6 flex flex-col items-center text-center transition-all relative",
        isOwned ? "border-[#81C784] bg-[#F1F8E9]" : "border-[#D7CCC8] hover:border-[#FF7043]"
      )}
    >
      {isParentMode && (
        <button
          onClick={() => onDeleteItem(item.id)}
          className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors border-2 border-red-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <div className="text-6xl mb-4 filter drop-shadow-md">{item.icon}</div>
      <h3 className="text-xl font-black text-[#5D4037] mb-2">{item.name}</h3>
      <p className="text-sm font-bold text-[#8D6E63] mb-6 flex-1">{item.description}</p>
      
      <div className="w-full">
        {isOwned ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-[#81C784] text-white rounded-2xl font-black border-b-4 border-[#388E3C]">
            <Check className="w-5 h-5" />
            已拥有
          </div>
        ) : (
          <button
            onClick={() => onPurchase(item.id)}
            disabled={!canAfford}
            className={cn(
              "w-full py-3 rounded-2xl font-black transition-all flex items-center justify-center gap-2",
              canAfford 
                ? "bg-[#FF7043] text-white border-b-4 border-[#D84315] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0" 
                : "bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed"
            )}
          >
            <Coins className="w-4 h-4" />
            {item.price} 兑换
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const Shop: React.FC<ShopProps> = ({ items, points, inventory, onPurchase, onUseItem, onAddItem, onDeleteItem }) => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShopItem, 'id'>>({
    name: '',
    price: 100,
    icon: '🎁',
    description: '',
    category: 'pet'
  });

  const petItems = items.filter(i => i.category === 'pet');
  const personalItems = items.filter(i => i.category === 'personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim()) {
      onAddItem(newItem);
      setNewItem({ name: '', price: 100, icon: '🎁', description: '', category: 'pet' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#FF7043] p-3 rounded-2xl border-4 border-[#5D4037] shadow-[4px_4px_0px_#D84315]">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#5D4037] font-hand">奖品商城</h2>
            <p className="text-[#8D6E63] font-bold">用你的努力换取超酷的奖品吧！</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsParentMode(!isParentMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all border-2",
              isParentMode 
                ? "bg-[#5D4037] text-white border-[#5D4037]" 
                : "bg-white text-[#5D4037] border-[#D7CCC8] hover:border-[#5D4037]"
            )}
          >
            <Settings2 className="w-4 h-4" />
            {isParentMode ? "退出家长模式" : "家长管理"}
          </button>
          <div className="bg-white px-6 py-3 rounded-2xl border-4 border-[#FF7043] shadow-[4px_4px_0px_#FF7043] flex items-center gap-3">
            <Coins className="w-6 h-6 text-[#FF7043]" />
            <span className="text-2xl font-black text-[#5D4037]">{points}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isParentMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 p-8 bg-[#FFF3E0] rounded-[3rem] border-4 border-[#FFE0B2] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-[#FF7043]" />
                <h3 className="text-2xl font-black text-[#5D4037] font-hand">添加新奖品</h3>
              </div>
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-[#FF7043] font-black hover:underline">
                {showAddForm ? "取消" : "立即添加"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">奖品名称</label>
                    <input
                      required
                      type="text"
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#FF7043] outline-none font-bold"
                      placeholder="例如：去吃冰淇淋"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">价格 (学习币)</label>
                    <input
                      required
                      type="number"
                      value={newItem.price}
                      onChange={e => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#FF7043] outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">奖品类型</label>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#FF7043] outline-none font-bold"
                    >
                      <option value="pet">宠物道具</option>
                      <option value="personal">家长奖励 (给孩子的礼品)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">描述</label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#FF7043] outline-none font-bold"
                      placeholder="简单介绍一下奖品吧"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-4 bg-[#FF7043] text-white rounded-2xl font-black border-b-4 border-[#D84315] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0 transition-all">
                    确认添加奖品
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-16">
        {/* Pet Items Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-[#FF7043]" />
            <h3 className="text-2xl font-black text-[#5D4037] font-hand">宠物道具</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {petItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isOwned={inventory.includes(item.id)}
                canAfford={points >= item.price}
                isParentMode={isParentMode}
                onPurchase={onPurchase}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </section>

        {/* Personal Rewards Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Gift className="w-6 h-6 text-purple-500" />
            <h3 className="text-2xl font-black text-[#5D4037] font-hand">家长奖励 (给你的礼品)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isOwned={inventory.includes(item.id)}
                canAfford={points >= item.price}
                isParentMode={isParentMode}
                onPurchase={onPurchase}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </section>
      </div>

      {inventory.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-[#5D4037]" />
            <h3 className="text-2xl font-black text-[#5D4037] font-hand">我的背包</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {inventory.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <motion.div 
                  key={`${itemId}-${index}`} 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-3xl border-4 border-[#D7CCC8] flex items-center justify-between gap-6 shadow-sm hover:border-[#FF7043] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-sm">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-black text-[#5D4037] text-lg">{item.name}</span>
                      <span className="text-[10px] font-bold text-[#A1887F]">{item.category === 'pet' ? '宠物道具' : '家长奖励'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUseItem(itemId)}
                    className="px-6 py-2 bg-[#FF7043] text-white rounded-full font-black text-sm border-b-4 border-[#D84315] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0 transition-all shadow-md"
                  >
                    立即使用
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
