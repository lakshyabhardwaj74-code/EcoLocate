import React, { useEffect, useState } from 'react';
import {
  Award,
  Sparkles,
  Gift,
  Trophy,
  History,
  CheckCircle2,
  AlertCircle,
  TreePine,
  ShoppingBag,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RewardCatalogItem, RewardTransaction, LeaderboardUser } from '../types';

const CONVERSION_RULES = [
  { item: 'Laptop Computer', points: 250, badge: 'High Reward' },
  { item: 'Desktop & Monitor', points: 150, badge: 'Popular' },
  { item: 'Printer & Scanner', points: 120, badge: 'Standard' },
  { item: 'Smartphone / Tablet', points: 100, badge: 'Popular' },
  { item: 'Battery (Li-Ion Pack)', points: 50, badge: 'Hazardous Bonus' },
  { item: 'Keyboard & Mouse', points: 40, badge: 'Small Tech' },
  { item: 'Charger & Cables', points: 25, badge: 'Accessories' },
];

export const Rewards: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const [redemptionSuccess, setRedemptionSuccess] = useState<{
    title: string;
    code: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRewardsData = async () => {
    try {
      const [catRes, leadRes] = await Promise.all([api.getRewardCatalog(), api.getLeaderboard()]);
      if (catRes.success) setCatalog(catRes.data);
      if (leadRes.success) setLeaderboard(leadRes.data);

      if (user) {
        const userRewRes = await api.getUserRewards();
        if (userRewRes.success) {
          setTransactions(userRewRes.data.transactions);
        }
      }
    } catch (err) {
      console.error('Error loading rewards page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewardsData();
  }, [user]);

  const handleRedeem = async (item: RewardCatalogItem) => {
    if (!user) {
      setError('Please sign in to redeem rewards from your points balance.');
      return;
    }

    if (user.rewardPoints < item.pointsRequired) {
      setError(`Insufficient points. You need ${item.pointsRequired - user.rewardPoints} more points for this voucher.`);
      return;
    }

    setRedeemingId(item.id);
    setError(null);

    try {
      const res = await api.redeemReward(item.id);
      if (res.success) {
        setRedemptionSuccess({
          title: item.title,
          code: res.data.code,
        });
        await refreshUser();
        loadRewardsData();
      } else {
        setError(res.message || 'Redemption failed.');
      }
    } catch (err) {
      console.error('Redeem error:', err);
      setError('Network error processing redemption.');
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Banner */}
      <div className="bg-[#071A21] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card border border-[#16A6A0]/25 tech-grid relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38D9E8]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 border border-[#16A6A0]/35 text-[#38D9E8] text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-[#38D9E8]" />
            <span>Eco-Citizenship Reward Store</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            Your Eco Rewards & Redemptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Turn responsible e-waste recycling into shopping vouchers, discounts, and native tree plantings.
          </p>
        </div>

        {/* Current Points Balance Box */}
        <div className="bg-[#051419]/90 border border-[#16A6A0]/25 rounded-xl p-4 sm:p-5 text-center min-w-[200px] shrink-0 shadow-sm relative z-10">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Your Current Balance</span>
          <span className="text-3xl sm:text-4xl font-black text-[#38D9E8] font-['Outfit']">
            {user?.rewardPoints || 0}
          </span>
          <span className="block text-[10px] text-[#D8F36A] font-bold mt-0.5">Verified Eco Points</span>
        </div>
      </div>

      {redemptionSuccess && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#071A21] text-sm sm:text-base">Voucher Redeemed Successfully!</h3>
          <p className="text-xs text-[#5e777f]">
            You have unlocked: <strong>{redemptionSuccess.title}</strong>
          </p>
          <div className="inline-block bg-white border border-[#D1DEDF] px-4 py-1.5 rounded-lg font-mono font-bold text-xs text-[#071A21]">
            Code: {redemptionSuccess.code}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-COLUMN LAYOUT (CATALOG + CONVERSION RULES & LEADERBOARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Reward Voucher Catalog */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-[#D1DEDF] pb-3">
            <h2 className="font-bold text-lg text-[#071A21] font-['Outfit']">
              Available Reward Vouchers
            </h2>
            <span className="text-xs text-[#5e777f] font-semibold">{catalog.length} Vouchers Listed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {catalog.map((item) => {
              const canAfford = (user?.rewardPoints || 0) >= item.pointsRequired;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 border border-[#D1DEDF] shadow-card flex flex-col justify-between space-y-4 hover:border-[#16A6A0] hover:shadow-lg transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#071A21]">{item.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#D8F36A]/15 text-[#071A21] border border-[#D8F36A]/35 shrink-0">
                        {item.pointsRequired} Pts
                      </span>
                    </div>
                    <p className="text-xs text-[#5e777f] leading-relaxed">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford || redeemingId === item.id}
                    className={`btn-press w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${canAfford
                        ? 'bg-[#071A21] hover:bg-[#16A6A0] text-white shadow-sm'
                        : 'bg-[#F5F7F4] text-slate-400 border border-[#D1DEDF] cursor-not-allowed'
                      }`}
                  >
                    {redeemingId === item.id ? (
                      <span>Redeeming...</span>
                    ) : canAfford ? (
                      <span>Claim Voucher</span>
                    ) : (
                      <span>Need {item.pointsRequired - (user?.rewardPoints || 0)} More Pts</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Points Rules & Leaderboard */}
        <div className="lg:col-span-4 space-y-6">

          {/* E-Waste Points Value Guide */}
          <div className="bg-white rounded-2xl p-5 border border-[#D1DEDF] shadow-card space-y-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#071A21] flex items-center gap-1.5 font-['Outfit']">
              <Zap className="w-4 h-4 text-[#16A6A0]" />
              Points Value by Scrap Item
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              {CONVERSION_RULES.map((rule) => (
                <div key={rule.item} className="flex items-center justify-between pt-1.5">
                  <span className="font-medium text-slate-700">{rule.item}</span>
                  <span className="font-extrabold text-[#16A6A0] bg-[#16A6A0]/10 px-2 py-0.5 rounded border border-[#16A6A0]/20">
                    +{rule.points} Pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* National Recycling Leaderboard */}
          <div className="bg-white rounded-2xl p-5 border border-[#D1DEDF] shadow-card space-y-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#071A21] flex items-center gap-1.5 font-['Outfit']">
              <Trophy className="w-4 h-4 text-amber-500" />
              National Green Citizens
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              {leaderboard.slice(0, 5).map((l, index) => (
                <div key={l.id} className="flex items-center justify-between pt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-bold text-[#5e777f]">#{index + 1}</span>
                    <span className="font-bold text-[#071A21]">{l.name}</span>
                  </div>
                  <span className="font-extrabold text-[#16A6A0] bg-[#16A6A0]/5 px-2 py-0.5 rounded">+{l.points} Pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
