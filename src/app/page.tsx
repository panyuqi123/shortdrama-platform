'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { mockDramas, categories, formatViewCount } from '../lib/mockData'
import { useAuth } from '../lib/auth'

// 模拟评论数据
const mockComments = [
  { id: 1, user: '追剧达人小美', avatar: '?seed=user1', text: '这个剧情也太上头了吧！', likes: 234 },
  { id: 2, user: '霸道总裁迷', avatar: '?seed=user2', text: '男主太帅了，根本停不下来', likes: 189 },
  { id: 3, user: '短剧爱好者', avatar: '?seed=user3', text: '追完一季才发现自己通宵了😂', likes: 156 },
  { id: 4, user: '追剧小透明', avatar: '?seed=user4', text: '每集结尾都卡在关键点，太会了', likes: 98 },
  { id: 5, user: '糖分超标', avatar: '?seed=user5', text: '这种甜剧给我再来100部！', likes: 312 },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'me'>('home')
  const { user } = useAuth()

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(324000)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(mockComments)
  const [commentText, setCommentText] = useState('')

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikeCount(prev => prev + (liked ? -1 : 1))
  }

  const handleSendComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: Date.now(),
      user: '我',
      avatar: '?seed=me',
      text: commentText.trim(),
      likes: 0,
    }
    setComments(prev => [newComment, ...prev])
    setCommentText('')
  }

  const [activeCategory, setActiveCategory] = useState('全部')
  const filteredDramas = activeCategory === '全部'
    ? mockDramas
    : mockDramas.filter(d => d.category === activeCategory)

  const [currentIdx, setCurrentIdx] = useState(0)
  const startY = useRef(0)
  const startX = useRef(0)
  const isDragging = useRef(false)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentIdx(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    startX.current = e.touches[0].clientX
    isDragging.current = true
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const endY = e.changedTouches[0].clientY
    const endX = e.changedTouches[0].clientX
    const diffY = startY.current - endY
    const diffX = endX - startX.current

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIdx < filteredDramas.length - 1) {
        setCurrentIdx(prev => prev + 1)
      } else if (diffY < 0 && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1)
      }
    }
  }

  const [progress, setProgress] = useState<Record<string, number>>({})
  useEffect(() => {
    const saved = localStorage.getItem('shortdrama_progress')
    if (saved) setProgress(JSON.parse(saved))
  }, [])
  const saveProgress = (dramaId: string, idx: number) => {
    const updated = { ...progress, [dramaId]: idx }
    setProgress(updated)
    localStorage.setItem('shortdrama_progress', JSON.stringify(updated))
  }
  const savedIdx = progress[filteredDramas[currentIdx]?.id] ?? 0

  const currentDrama = filteredDramas[currentIdx]

  if (activeTab === 'me') {
    return (
      <div className="min-h-screen bg-neutral-950">
        <MeTab onBack={() => setActiveTab('home')} />
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-black select-none relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 全屏剧集卡片 */}
      {currentDrama && (
        <div className="absolute inset-0">
          {/* 封面图 */}
          <img
            src={currentDrama.cover}
            alt={currentDrama.title}
            className="w-full h-full object-cover"
          />

          {/* 多层渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* 左下角 - 剧名和简介 */}
          <div className="absolute bottom-36 left-4 right-20">
            <div className="flex items-center gap-2 mb-2.5">
              {currentDrama.isVipOnly && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  VIP
                </span>
              )}
              <span className="bg-white/15 backdrop-blur-md text-white/90 text-xs px-2.5 py-1 rounded-full border border-white/10">
                {currentDrama.category}
              </span>
            </div>
            <h2 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-sm">{currentDrama.title}</h2>
            <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{currentDrama.description}</p>
            <div className="flex items-center gap-4 mt-2.5 text-white/40 text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd"/>
                </svg>
                {formatViewCount(currentDrama.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {currentDrama.rating}
              </span>
            </div>
          </div>

          {/* 右侧浮动操作栏 - 优化版 */}
          <div className="absolute bottom-32 right-3 flex flex-col items-center gap-5">
            {/* 头像 */}
            <div className="flex flex-col items-center">
              <div className="w-13 h-13 rounded-full overflow-hidden border-[2.5px] border-white shadow-lg ring-2 ring-white/20">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentDrama.id}`} className="w-full h-full object-cover" />
              </div>
              <div className="w-5 h-5 bg-red-500 rounded-full -mt-2.5 flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white">
                +
              </div>
            </div>

            {/* 点赞 */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleLike}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg ${
                  liked
                    ? 'bg-red-500 shadow-red-500/30'
                    : 'bg-white/10 backdrop-blur-md border border-white/10'
                }`}
              >
                <svg
                  className={`w-6 h-6 transition-all ${liked ? 'text-white scale-110' : 'text-white'}`}
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <span className="text-white/70 text-xs mt-1 font-medium">{formatViewCount(likeCount)}</span>
            </div>

            {/* 评论 */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowComments(true)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90 shadow-lg"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
              <span className="text-white/70 text-xs mt-1 font-medium">{formatViewCount(comments.reduce((a, c) => a + c.likes, 0) + comments.length * 12)}</span>
            </div>

            {/* 分享 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
              <span className="text-white/70 text-xs mt-1 font-medium">分享</span>
            </div>
          </div>

          {/* 右下角播放按钮 */}
          <Link href={`/drama/${currentDrama.id}?ep=${savedIdx}`} className="absolute bottom-36 right-3">
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl shadow-red-500/30 ring-2 ring-white/20 active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </Link>

          {/* 右侧进度指示点 - 改为左侧 */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col gap-2 z-10">
            {filteredDramas.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIdx
                    ? 'w-1.5 h-6 bg-white shadow-sm'
                    : 'w-1 h-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* 剧名滚动提示 */}
          <div className="absolute bottom-4 left-4 right-20">
            <div className="flex items-center gap-2 opacity-40">
              <span className="text-white text-xs">{currentDrama.title}</span>
            </div>
          </div>
        </div>
      )}

      {/* 评论弹窗 */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-900" style={{ height: '100vh' }}>
          {/* 顶部导航 */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-800/50">
            <button
              onClick={() => setShowComments(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-sm">评论</h2>
              <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
            </div>
            <div className="w-10" />
          </div>

          {/* 评论列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg/${comment.avatar}`}
                  className="w-10 h-10 rounded-full flex-shrink-0 ring-1 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white/80 text-xs font-semibold">{comment.user}</p>
                    <div className="h-1 w-1 rounded-full bg-neutral-600" />
                    <p className="text-neutral-600 text-xs">刚刚</p>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-neutral-500 hover:text-red-400 transition-colors text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-neutral-500 hover:text-white transition-colors text-xs">回复</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="px-4 py-3 border-t border-neutral-800/50 bg-neutral-900/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                placeholder="说点什么吧..."
                className="flex-1 bg-neutral-800/80 text-white text-sm px-4 py-3 rounded-full outline-none placeholder:text-neutral-500 border border-neutral-700/50 focus:border-red-500/50 transition-colors"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim()}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold px-5 py-3 rounded-full disabled:opacity-30 transition-opacity hover:brightness-110 active:scale-95"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部区域 */}
      <div className="absolute top-0 left-0 right-0 pt-8 pb-3 px-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-20">
        <div className="flex items-center justify-between mb-3.5">
          {/* 品牌 Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              Reel<span className="text-red-500">Short</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 搜索按钮 */}
            <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            {/* 用户头像 */}
            <button
              onClick={() => setActiveTab('me')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-md transition-all active:scale-95"
            >
              {user ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 分类标签栏 - 优化版 */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scroll-smooth">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white/8 backdrop-blur-md text-white/55 border border-white/10 hover:text-white hover:bg-white/12'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 细进度条 */}
        <div className="mt-3">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: filteredDramas.length > 0 ? `${((currentIdx + 1) / filteredDramas.length) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between mt-1 px-0.5">
            <span className="text-white/30 text-xs font-medium">{currentIdx + 1}/{filteredDramas.length}</span>
            <span className="text-white/30 text-xs font-medium truncate ml-4">{currentDrama?.title}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MeTab({ onBack }: { onBack: () => void }) {
  const { user, logout, buyVip } = useAuth()
  const { setShowAuthModal } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* 装饰背景 */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />

        <div className="w-22 h-22 rounded-full bg-neutral-800/80 flex items-center justify-center text-5xl mb-6 shadow-xl ring-1 ring-white/10">
          <svg className="w-11 h-11 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold mb-2">登录后解锁全部功能</h2>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">开通VIP · 追剧记录 · 专属内容</p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-red-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          登录 / 注册
        </button>
        <button onClick={onBack} className="text-neutral-600 text-sm mt-5 hover:text-white transition-colors">
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-10 pb-8">
      {/* 顶部背景装饰 */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-red-500/8 to-transparent pointer-events-none" />

      <button onClick={onBack} className="flex items-center gap-2 text-white/50 text-sm px-4 mb-4 hover:text-white transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        返回首页
      </button>

      {/* 用户信息卡片 */}
      <div className="bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 mx-4 mb-4 border border-white/5 shadow-xl">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className={`relative ${user.isVip ? 'vip-pulse' : ''}`}>
            <img src={user.avatar} className="w-15 h-15 rounded-full ring-2 ring-white/10" />
            {user.isVip && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[10px]">👑</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-bold text-base">{user.nickname}</span>
              {user.isVip && (
                <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  VIP
                </span>
              )}
            </div>
            <p className="text-neutral-500 text-xs">+62 {user.phone?.slice(0,4)}****{user.phone?.slice(-3) || '****'}</p>
          </div>

          <button
            onClick={logout}
            className="text-neutral-500 text-xs px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/50 hover:bg-neutral-700 transition-colors"
          >
            退出
          </button>
        </div>

        {!user.isVip && (
          <button
            onClick={buyVip}
            className="mt-4 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl py-3.5 text-sm font-bold shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            开通 VIP · 全站免费看
          </button>
        )}

        {/* 数据统计 */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label:'金币', value: user.coinBalance, color:'text-yellow-400', icon: '🪙' },
            { label:'收藏', value: 0, color:'text-white', icon: '❤️' },
            { label:'追剧', value: 0, color:'text-white', icon: '📺' },
            { label:'历史', value: 0, color:'text-white', icon: '🕐' },
          ].map(s => (
            <div key={s.label} className="text-center py-2 rounded-xl bg-neutral-800/50">
              <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
              <p className="text-neutral-600 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="bg-neutral-900/80 backdrop-blur-md rounded-2xl mx-4 overflow-hidden border border-white/5 shadow-xl">
        {[
          { icon: '👑', label:'VIP 中心', sub: user.isVip ? '有效期至 2026-12-31' : '开通享特权', highlight: !user.isVip },
          { icon: '❤️', label:'我的收藏', sub:'0 部短剧' },
          { icon: '📜', label:'观看历史', sub:'最近观看' },
          { icon: '🎁', label:'任务中心', sub:'做任务赚金币' },
          { icon: '💬', label:'意见反馈', sub:'帮助与支持' },
          { icon: '⚙️', label:'设置', sub:'账号与隐私' },
        ].map((item, i) => (
          <button
            key={item.label}
            className={`w-full flex items-center justify-between px-4 py-4 hover:bg-white/[0.03] transition-colors ${i < 5 ? 'border-b border-white/[0.05]' : ''}`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-lg w-6 text-center">{item.icon}</span>
              <div className="text-left">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className={`text-xs mt-0.5 ${item.highlight ? 'text-red-400' : 'text-neutral-600'}`}>{item.sub}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
