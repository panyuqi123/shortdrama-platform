'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { mockDramas, categories, formatViewCount } from '../lib/mockData'
import { useAuth } from '../lib/auth'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'category' | 'me'>('home')
  const [activeCategory, setActiveCategory] = useState('全部')
  const { user } = useAuth()

  const filtered = activeCategory === '全部'
    ? mockDramas
    : mockDramas.filter(d => d.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* 顶部标题栏 */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-white tracking-tight">
            Reel<span className="text-[#ff2d55]">Short</span>
          </h1>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                {user.isVip && <span className="text-xs bg-[#FFD700] text-black font-bold px-1.5 py-0.5 rounded">VIP</span>}
              </div>
            ) : (
              <button onClick={() => import('../lib/auth').then(m => {})}
                className="text-sm text-[#ff2d55] font-medium">登录</button>
            )}
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#ff2d55] text-white'
                  : 'bg-[#1a1a1a] text-[#999]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* 内容区 */}
      {activeTab === 'home' && (
        <main className="px-3 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(drama => (
              <Link href={`/drama/${drama.id}`} key={drama.id} className="block">
                <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a]">
                  {/* 封面图 */}
                  <div className="relative aspect-[3/4]">
                    <img
                      src={drama.cover}
                      alt={drama.title}
                      className="w-full h-full object-cover"
                    />
                    {/* 遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* VIP 标识 */}
                    {drama.isVipOnly && (
                      <div className="absolute top-2 left-2 bg-[#FFD700] text-black text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span>👑</span> VIP
                      </div>
                    )}
                    {/* 集数 */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {drama.episodes.length}集
                    </div>
                    {/* 播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 mb-1">{drama.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[#ccc] text-xs">{formatViewCount(drama.viewCount)}播放</span>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <span>★</span> {drama.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      )}

      {activeTab === 'category' && (
        <main className="px-3 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {mockDramas.map(drama => (
              <Link href={`/drama/${drama.id}`} key={drama.id} className="block">
                <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a]">
                  <div className="relative aspect-[3/4]">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <h3 className="text-white text-sm font-bold leading-tight line-clamp-2">{drama.title}</h3>
                      <p className="text-[#ccc] text-xs mt-1">{formatViewCount(drama.viewCount)}播放 · {drama.category}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      )}

      {activeTab === 'me' && <MeTab />}

      {/* 底部 Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#2a2a2a] tab-bar z-40">
        <div className="flex justify-around py-2">
          {[
            { id: 'home' as const, icon: '🏠', label: '首页' },
            { id: 'category' as const, icon: '📋', label: '分类' },
            { id: 'me' as const, icon: '👤', label: '我的' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1 ${
                activeTab === tab.id ? 'text-[#ff2d55]' : 'text-[#666]'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && <div className="w-4 h-0.5 bg-[#ff2d55] rounded-full mt-0.5" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function MeTab() {
  const { user, logout, buyVip } = useAuth()
  const { setShowAuthModal } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center text-4xl mb-6">
          👤
        </div>
        <h2 className="text-white text-lg font-semibold mb-2">登录后查看你的内容</h2>
        <p className="text-[#666] text-sm mb-6 text-center">登录后享受VIP特权和更多功能</p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-[#ff2d55] text-white px-8 py-3 rounded-full text-base font-semibold"
        >
          立即登录 / 注册
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      {/* 用户信息卡 */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar} className="w-16 h-16 rounded-full border-2 border-[#ff2d55]" alt="avatar" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-bold text-lg">{user.nickname}</span>
              {user.isVip && (
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  👑 VIP
                </span>
              )}
            </div>
            <p className="text-[#666] text-sm">+62 {user.phone.slice(0,4)}****{user.phone.slice(-3)}</p>
          </div>
          <button onClick={logout} className="text-[#666] text-sm">退出</button>
        </div>

        {/* 会员状态 */}
        {!user.isVip && (
          <div className="mt-4 bg-gradient-to-r from-[#ff2d55]/20 to-[#ff6600]/20 rounded-xl p-4 border border-[#ff2d55]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">开通 VIP 会员</p>
                <p className="text-[#999] text-xs mt-0.5">全站免费看 · 无广告 · 抢先看</p>
              </div>
              <button
                onClick={buyVip}
                className="bg-gradient-to-r from-[#ff2d55] to-[#ff6600] text-white text-sm font-bold px-4 py-2 rounded-full"
              >
                立即开通
              </button>
            </div>
          </div>
        )}

        {/* 金币 */}
        <div className="mt-3 flex gap-3">
          <div className="flex-1 bg-[#0a0a0a] rounded-xl p-3 text-center">
            <p className="text-[#FFD700] text-lg font-bold">🪙 {user.coinBalance}</p>
            <p className="text-[#666] text-xs mt-0.5">金币余额</p>
          </div>
          <div className="flex-1 bg-[#0a0a0a] rounded-xl p-3 text-center">
            <p className="text-white text-lg font-bold">0</p>
            <p className="text-[#666] text-xs mt-0.5">我的收藏</p>
          </div>
          <div className="flex-1 bg-[#0a0a0a] rounded-xl p-3 text-center">
            <p className="text-white text-lg font-bold">0</p>
            <p className="text-[#666] text-xs mt-0.5">观看历史</p>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
        {[
          { icon: '💎', label: '我的 VIP', action: user.isVip ? null : buyVip },
          { icon: '❤️', label: '我的收藏', action: null },
          { icon: '📜', label: '观看历史', action: null },
          { icon: '🎁', label: '任务中心', action: null },
          { icon: '⚙️', label: '设置', action: null },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={item.action || undefined}
            className={`w-full flex items-center justify-between px-4 py-4 ${
              i < 4 ? 'border-b border-[#2a2a2a]' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-white text-sm">{item.label}</span>
            </div>
            <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
