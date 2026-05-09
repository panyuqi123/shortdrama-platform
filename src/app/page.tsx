'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { mockDramas, categories, formatViewCount } from '../lib/mockData'
import { useAuth } from '../lib/auth'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'mine' | 'me'>('home')
  const [searchOpen, setSearchOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* 顶部状态栏 */}
      {activeTab === 'home' && (
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl px-4 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-white tracking-wide flex-1">
              Reel<span className="text-red-500">Short</span>
            </h1>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
            >
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {/* 分类标签 */}
          <div className="flex gap-2 overflow-x-auto mt-2 pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${cat === '全部' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70'}`}>
                {cat}
              </button>
            ))}
          </div>
        </header>
      )}

      {/* 首页信息流 */}
      {activeTab === 'home' && (
        <main>
          {mockDramas.map(drama => (
            <Link href={`/drama/${drama.id}`} key={drama.id} className="block px-3 mt-3">
              <div className="relative w-full aspect-[9/16] max-h-[85vh] mx-auto overflow-hidden bg-neutral-900 rounded-2xl shadow-lg">
                <img
                  src={drama.cover}
                  alt={drama.title}
                  className="w-full h-full object-cover"
                />
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* 左下角 - 剧名 */}
                <div className="absolute bottom-0 left-0 right-20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {drama.isVipOnly && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        VIP
                      </span>
                    )}
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-sm">
                      {drama.category}
                    </span>
                  </div>
                  <h2 className="text-white text-base font-bold leading-tight mb-1">{drama.title}</h2>
                  <p className="text-white/60 text-xs line-clamp-1">{drama.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-white/50 text-xs">
                    <span className="ml-0.5">▶ {formatViewCount(drama.viewCount)}</span>
                    <span>★ {drama.rating}</span>
                    <span>{drama.episodes.length} 集</span>
                  </div>
                </div>

                {/* 右侧浮动操作栏 */}
                <div className="absolute bottom-0 right-3 pb-8 flex flex-col items-center gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">2.3w</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">128</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs">Share</span>
                  </div>
                </div>

                {/* 右下角播放指示 */}
                <div className="absolute bottom-0 right-3 pb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </main>
      )}

      {/* 发现页 */}
      {activeTab === 'discover' && (
        <main className="px-4 pt-4">
          <h2 className="text-white text-lg font-bold mb-4">发现更多</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🔥', label: '热门榜单', color: 'from-orange-500 to-red-500' },
              { icon: '✨', label: '最新更新', color: 'from-purple-500 to-pink-500' },
              { icon: '💕', label: '甜宠专区', color: 'from-pink-500 to-rose-500' },
              { icon: '⚔️', label: '战神系列', color: 'from-red-600 to-orange-500' },
            ].map(item => (
              <button key={item.label} className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-left`}>
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <span className="text-white font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <h3 className="text-white font-bold mt-6 mb-3">猜你喜欢</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockDramas.slice(2, 6).map(d => (
              <Link href={`/drama/${d.id}`} key={d.id} className="block">
                <div className="rounded-xl overflow-hidden aspect-[3/4] relative">
                  <img src={d.cover} alt={d.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-2">
                    <p className="text-white text-xs font-medium">{d.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      )}

      {/* 追剧页 */}
      {activeTab === 'mine' && (
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl mb-4">📚</div>
          <h2 className="text-white text-lg font-semibold mb-2">追剧清单</h2>
          <p className="text-neutral-500 text-sm">还没有追任何剧，去首页发现喜欢的吧</p>
        </main>
      )}

      {/* 我的页 */}
      {activeTab === 'me' && <MeTab />}

      {/* 搜索弹窗 */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <div className="flex-1 bg-neutral-800 rounded-full px-4 py-2.5 flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="搜索短剧、演员..."
                className="flex-1 text-white text-sm bg-transparent outline-none placeholder-neutral-500"
                autoFocus
              />
            </div>
            <button onClick={() => setSearchOpen(false)} className="text-white text-sm font-medium">取消</button>
          </div>
          <div className="px-4 pt-4">
            <p className="text-neutral-500 text-xs mb-3">热门搜索</p>
            <div className="flex flex-wrap gap-2">
              {['甜宠', '战神', '霸总', '重生', '豪门', '复仇'].map(tag => (
                <button key={tag} className="bg-neutral-800 text-white/70 text-xs px-3 py-1.5 rounded-full">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部 Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-neutral-800 z-40">
        <div className="flex justify-around py-2 pb-5">
          {[
            { id: 'home' as const, icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: '首页' },
            { id: 'discover' as const, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>, label: '发现' },
            { id: 'mine' as const, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>, label: '追剧' },
            { id: 'me' as const, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>, label: '我的' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-5 py-1 transition-colors ${activeTab === tab.id ? 'text-red-500' : 'text-neutral-500'}`}
            >
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl mb-5">
          <svg className="w-10 h-10 text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <h2 className="text-white text-lg font-semibold mb-2">登录后解锁全部功能</h2>
        <p className="text-neutral-500 text-sm mb-6">开通VIP · 追剧记录 · 专属内容</p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-red-500 text-white px-10 py-3 rounded-full text-sm font-semibold"
        >
          登录 / 注册
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-8">
      {/* 用户信息卡 */}
      <div className="bg-neutral-900 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={user.avatar} className="w-14 h-14 rounded-full" alt="avatar" />
            {user.isVip && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-xs">👑</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-bold text-base">{user.nickname}</span>
              {user.isVip && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">VIP</span>
              )}
            </div>
            <p className="text-neutral-500 text-xs">+62 {user.phone?.slice(0,4)}****{user.phone?.slice(-3) || '****'}</p>
          </div>
          <button onClick={logout} className="text-neutral-500 text-xs px-3 py-1 rounded-full bg-neutral-800">退出</button>
        </div>

        {!user.isVip && (
          <button
            onClick={buyVip}
            className="mt-4 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl py-3.5 text-sm font-bold"
          >
            开通 VIP · 全站免费看
          </button>
        )}

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: '金币', value: user.coinBalance, color: 'text-yellow-400' },
            { label: '收藏', value: 0, color: 'text-white' },
            { label: '追剧', value: 0, color: 'text-white' },
            { label: '历史', value: 0, color: 'text-white' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 菜单 */}
      <div className="bg-neutral-900 rounded-2xl overflow-hidden">
        {[
          { icon: '👑', label: 'VIP 中心', sub: user.isVip ? '有效期至 2026-12-31' : '开通享特权' },
          { icon: '❤️', label: '我的收藏', sub: '0 部短剧' },
          { icon: '📜', label: '观看历史', sub: '最近观看' },
          { icon: '🎁', label: '任务中心', sub: '做任务赚金币' },
          { icon: '💬', label: '意见反馈', sub: '帮助与支持' },
          { icon: '⚙️', label: '设置', sub: '账号与隐私' },
        ].map((item, i) => (
          <button key={item.label} className={`w-full flex items-center justify-between px-4 py-4 ${i < 5 ? 'border-b border-neutral-800' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <div className="text-left">
                <p className="text-white text-sm">{item.label}</p>
                <p className="text-neutral-500 text-xs">{item.sub}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
