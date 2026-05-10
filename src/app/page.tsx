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

  // 点赞状态
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(324000)

  // 评论弹窗
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
  // 分类筛选
  const [activeCategory, setActiveCategory] = useState('全部')
  const filteredDramas = activeCategory === '全部'
    ? mockDramas
    : mockDramas.filter(d => d.category === activeCategory)

  // 抖音式全屏浏览状态
  const [currentIdx, setCurrentIdx] = useState(0)
  const startY = useRef(0)
  const startX = useRef(0)
  const isDragging = useRef(false)

  // 分类切换时重置索引
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

    // 上下滑动 > 左右滑动才切换
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIdx < filteredDramas.length - 1) {
        setCurrentIdx(prev => prev + 1)
      } else if (diffY < 0 && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1)
      }
    }
  }

  // 播放进度记忆
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
  // 如果有记忆的进度，恢复到该集
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

          {/* 底部渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* 左下角 - 剧名和简介 */}
          <div className="absolute bottom-32 left-4 right-20">
            <div className="flex items-center gap-2 mb-2">
              {currentDrama.isVipOnly && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5 rounded-sm">
                  👑 VIP
                </span>
              )}
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-sm backdrop-blur-sm">
                {currentDrama.category}
              </span>
            </div>
            <h2 className="text-white font-bold text-base leading-tight mb-1">{currentDrama.title}</h2>
            <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">{currentDrama.description}</p>
            <div className="flex items-center gap-3 mt-2 text-white/50 text-xs">
              <span>{formatViewCount(currentDrama.viewCount)} 播放</span>
              <span>★ {currentDrama.rating}</span>
            </div>
          </div>

          {/* 右侧浮动操作栏 */}
          <div className="absolute bottom-28 right-3 flex flex-col items-center gap-6">
            {/* 头像 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentDrama.id}`} className="w-full h-full object-cover" />
              </div>
              <div className="w-5 h-5 bg-red-500 rounded-full -mt-2 flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>

            {/* 点赞 */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleLike}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90"
              >
                <svg className={`w-6 h-6 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <span className="text-white text-xs mt-1">{formatViewCount(likeCount)}</span>
            </div>

            {/* 评论 */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowComments(true)}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all active:scale-90"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
              <span className="text-white text-xs mt-1">{formatViewCount(comments.reduce((a, c) => a + c.likes, 0) + comments.length * 12)}</span>
            </div>

            {/* 分享 */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
              <span className="text-white text-xs mt-1">分享</span>
            </div>
          </div>

          {/* 右下角播放按钮 */}
          <Link href={`/drama/${currentDrama.id}?ep=${savedIdx}`} className="absolute bottom-32 right-3">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </Link>

          {/* 进度指示点 */}
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1.5">
            {filteredDramas.map((_, i) => (
              <div key={i} className={`w-1.5 rounded-full transition-all ${i === currentIdx ? 'h-5 bg-white' : 'h-1.5 bg-white/40'}`} />
            ))}
          </div>

          {/* 上滑提示 */}
          {currentIdx < filteredDramas.length - 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-60">
              <span className="text-white text-xs">上滑</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 评论弹窗 */}
      {showComments && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-neutral-900"
          style={{ height: '100vh' }}
        >
          {/* 顶部导航 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <button
              onClick={() => setShowComments(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 className="text-white font-bold text-sm">评论</h2>
            <div className="w-9" />
          </div>

          {/* 评论列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg/${comment.avatar}`}
                  className="w-9 h-9 rounded-full flex-shrink-0 bg-neutral-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold mb-0.5">{comment.user}</p>
                  <p className="text-neutral-300 text-sm leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-neutral-500 text-xs">{comment.likes} 赞</span>
                    <span className="text-neutral-500 text-xs">回复</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                placeholder="说点什么吧..."
                className="flex-1 bg-neutral-800 text-white text-sm px-4 py-2.5 rounded-full outline-none placeholder:text-neutral-500"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim()}
                className="bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full disabled:opacity-40"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部毛玻璃状态栏 + 分类 */}
      <div className="absolute top-0 left-0 right-0 pt-8 pb-3 px-4 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-black text-lg">
            Reel<span className="text-red-500">Short</span>
          </span>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
              🔍 搜索
            </div>
            <button
              onClick={() => setActiveTab('me')}
              className="w-9 h-9 rounded-full overflow-hidden border border-white/30"
            >
              {user ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 分类标签栏 */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 进度条 */}
        <div className="mt-3">
          <div className="h-0.5 bg-white/20 rounded-full">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: filteredDramas.length > 0 ? `${((currentIdx + 1) / filteredDramas.length) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/40 text-xs">{currentIdx + 1}/{filteredDramas.length}</span>
            <span className="text-white/40 text-xs">{currentDrama?.title}</span>
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
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl mb-5">
          <svg className="w-10 h-10 text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <h2 className="text-white text-lg font-semibold mb-2">登录后解锁全部功能</h2>
        <p className="text-neutral-500 text-sm mb-6">开通VIP · 追剧记录 · 专属内容</p>
        <button onClick={() => setShowAuthModal(true)} className="bg-red-500 text-white px-10 py-3 rounded-full text-sm font-semibold">
          登录 / 注册
        </button>
        <button onClick={onBack} className="text-neutral-500 text-sm mt-4">返回首页</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-12 pb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 text-sm px-4 mb-4">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        返回
      </button>

      <div className="bg-neutral-900 rounded-2xl p-5 mx-4 mb-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-red-500/50" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-bold text-base">{user.nickname}</span>
              {user.isVip && <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">👑 VIP</span>}
            </div>
            <p className="text-neutral-500 text-xs">+62 {user.phone?.slice(0,4)}****{user.phone?.slice(-3) || '****'}</p>
          </div>
          <button onClick={logout} className="text-neutral-500 text-xs px-3 py-1 rounded-full bg-neutral-800">退出</button>
        </div>

        {!user.isVip && (
          <button onClick={buyVip} className="mt-4 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl py-3.5 text-sm font-bold">
            开通 VIP · 全站免费看
          </button>
        )}

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[{label:'金币', value: user.coinBalance, color:'text-yellow-400'},
            {label:'收藏', value: 0, color:'text-white'},
            {label:'追剧', value: 0, color:'text-white'},
            {label:'历史', value: 0, color:'text-white'}].map(s => (
            <div key={s.label} className="text-center">
              <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 rounded-2xl mx-4 overflow-hidden">
        {[
          {icon:'👑', label:'VIP 中心', sub: user.isVip ? '有效期至 2026-12-31' : '开通享特权'},
          {icon:'❤️', label:'我的收藏', sub:'0 部短剧'},
          {icon:'📜', label:'观看历史', sub:'最近观看'},
          {icon:'🎁', label:'任务中心', sub:'做任务赚金币'},
          {icon:'💬', label:'意见反馈', sub:'帮助与支持'},
          {icon:'⚙️', label:'设置', sub:'账号与隐私'},
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
