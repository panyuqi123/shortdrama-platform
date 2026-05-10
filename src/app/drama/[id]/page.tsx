'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { mockDramas, formatViewCount } from '../../../lib/mockData'
import { useAuth } from '../../../lib/auth'

export default function DramaPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const drama = mockDramas.find(d => d.id === params.id)

  // 读取 URL 中的 ep 参数（从首页跳转来）
  const [selectedIdx, setSelectedIdx] = useState(() => {
    const epParam = searchParams.get('ep')
    return epParam ? Math.min(parseInt(epParam), (drama?.episodes.length ?? 1) - 1) : 0
  })

  const [showPaywall, setShowPaywall] = useState(false)
  const [currentUnlock, setCurrentUnlock] = useState<number | null>(null)
  const [showDesc, setShowDesc] = useState(false)
  const [playProgress, setPlayProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { user, unlockEpisode, buyVip, setShowAuthModal } = useAuth()

  // 滑动手势（切集）
  const startY = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 60) {
      if (diff > 0 && selectedIdx < (drama?.episodes.length ?? 1) - 1) {
        // 上滑 → 下一集
        handleSelect(selectedIdx + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (diff < 0 && selectedIdx > 0) {
        // 下滑 → 上一集
        handleSelect(selectedIdx - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // 保存播放进度
  useEffect(() => {
    if (drama && drama.episodes[selectedIdx]) {
      const id = `${drama.id}-${selectedIdx}`
      const saved = localStorage.getItem(`progress_${id}`)
      if (saved && videoRef.current) {
        videoRef.current.currentTime = parseFloat(saved)
      }
    }
  }, [drama?.id, selectedIdx])

  const handleTimeUpdate = () => {
    if (videoRef.current && drama) {
      const id = `${drama.id}-${selectedIdx}`
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setPlayProgress(pct)
      if (pct > 5) {
        localStorage.setItem(`progress_${id}`, String(videoRef.current.currentTime))
      }
    }
  }

  if (!drama) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-neutral-500">剧集不存在</p>
    </div>
  )

  const ep = drama.episodes[selectedIdx]
  const canPlay = (i: number) => drama.episodes[i].isFree || user?.isVip

  const handleSelect = (i: number) => {
    if (!canPlay(i)) {
      setCurrentUnlock(i)
      setShowPaywall(true)
    } else {
      setSelectedIdx(i)
      setPlayProgress(0)
      setTimeout(() => videoRef.current?.play(), 100)
    }
  }

  const handleUnlock = async () => {
    if (!user) { setShowPaywall(false); setShowAuthModal(true); return }
    if (currentUnlock !== null) {
      const ok = await unlockEpisode(drama.episodes[currentUnlock].id, drama.id)
      if (ok) {
        setSelectedIdx(currentUnlock)
        setShowPaywall(false)
        setTimeout(() => videoRef.current?.play(), 100)
      }
    }
  }

  const handleVip = () => {
    if (!user) { setShowPaywall(false); setShowAuthModal(true); return }
    buyVip()
    setShowPaywall(false)
  }

  const handleNext = () => {
    if (selectedIdx < drama.episodes.length - 1) handleSelect(selectedIdx + 1)
  }

  return (
    <div
      className="min-h-screen bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 返回 + 标题 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white font-semibold text-sm truncate flex-1">{drama.title}</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
        </div>
        {/* 进度条 */}
        <div className="mt-2">
          <div className="h-0.5 bg-white/20 rounded-full">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${playProgress}%` }} />
          </div>
        </div>
      </div>

      {/* 视频播放器 */}
      <div className="relative w-full bg-black">
        <div className="relative w-full aspect-[9/16] max-h-[90vh] mx-auto bg-neutral-900">
          <video
            ref={videoRef}
            key={ep.id}
            src={ep.videoUrl}
            className="w-full h-full object-contain"
            controls
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
          />
          {/* 集数指示 */}
          <div className="absolute bottom-16 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {selectedIdx + 1}/{drama.episodes.length}
          </div>
          {selectedIdx < drama.episodes.length - 1 && (
            <div className="absolute bottom-16 left-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm opacity-60">
              ↑ 上滑切下集
            </div>
          )}
        </div>
      </div>

      {/* 剧集信息 */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-white font-bold text-base">{drama.title}</h1>
              {drama.isVipOnly && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-sm">VIP</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <span>{formatViewCount(drama.viewCount)} 播放</span>
              <span>★ {drama.rating}</span>
              <span>{drama.updatedAt} 更新</span>
            </div>
          </div>
          <button onClick={() => setShowDesc(!showDesc)} className="text-red-500 text-xs font-medium flex items-center gap-1">
            {showDesc ? '收起' : '详情'}
            <svg className={`w-3 h-3 transition-transform ${showDesc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        {showDesc && (
          <div className="bg-neutral-900 rounded-xl p-4 mb-4">
            <p className="text-neutral-400 text-sm leading-relaxed">{drama.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {drama.tags.map(tag => (
                <span key={tag} className="bg-neutral-800 text-neutral-500 text-xs px-2.5 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {!showDesc && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {drama.tags.map(tag => (
              <span key={tag} className="bg-neutral-800 text-neutral-500 text-xs px-2.5 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">选集</h3>
          <span className="text-neutral-500 text-xs">共 {drama.episodes.length} 集 · 上下滑动切换</span>
        </div>

        {/* 选集网格 */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {drama.episodes.map((episode, i) => {
            const unlocked = episode.isFree || user?.isVip
            const isCurrent = i === selectedIdx
            return (
              <button
                key={episode.id}
                onClick={() => handleSelect(i)}
                className={`relative rounded-lg overflow-hidden aspect-video ${isCurrent ? 'ring-2 ring-red-500' : ''}`}
              >
                <img src={episode.coverUrl} alt={`第${i+1}集`} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 flex items-center justify-center ${!unlocked ? 'bg-black/50' : isCurrent ? 'bg-black/30' : 'bg-black/20'}`}>
                  {!unlocked && (
                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {unlocked && !isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                  {isCurrent && <div className="w-3 h-3 rounded-sm bg-red-500" />}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-0.5">
                  <span className="text-white text-xs font-medium">{episode.number}集</span>
                </div>
                {/* 播放进度指示 */}
                {(() => {
                  const saved = typeof window !== 'undefined' ? localStorage.getItem(`progress_${drama.id}-${i}`) : null
                  if (saved && !isCurrent && unlocked) {
                    const dur = drama.episodes[i] ? 1 : 0
                    return <div className="absolute bottom-0 left-0 h-0.5 bg-red-500" style={{width: '60%'}} />
                  }
                  return null
                })()}
              </button>
            )
          })}
        </div>

        {/* 相关推荐 */}
        <h3 className="text-white font-bold text-sm mb-3">相关推荐</h3>
        <div className="grid grid-cols-3 gap-2">
          {mockDramas.filter(d => d.id !== drama.id).slice(0, 3).map(d => (
            <button key={d.id} onClick={() => window.location.href = `/drama/${d.id}`} className="block">
              <div className="rounded-lg overflow-hidden aspect-[3/4] relative">
                <img src={d.cover} alt={d.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <p className="text-white text-xs font-medium line-clamp-2">{d.title}</p>
                </div>
                <div className="absolute top-1.5 right-1.5 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {d.episodes.length}集
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 付费弹窗 */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={e => e.target === e.currentTarget && setShowPaywall(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPaywall(false)} />
          <div className="relative w-full max-w-sm bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-6 pb-8">
            <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />
            <h3 className="text-white text-lg font-bold text-center mb-1">
              解锁第{currentUnlock !== null ? drama.episodes[currentUnlock].number : ''}集
            </h3>
            <p className="text-neutral-500 text-sm text-center mb-4">本集为付费内容</p>

            <div className="bg-neutral-800 rounded-xl p-3 mb-4 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-neutral-400 text-xs">开通 VIP 全站免费看，无限制畅享所有内容</p>
            </div>

            <div className="space-y-2">
              <button onClick={handleVip} className="w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-xl py-3.5 font-bold text-white text-sm">
                👑 开通 VIP 会员
              </button>
              <button onClick={handleUnlock} className="w-full bg-neutral-800 rounded-xl py-3.5 text-left px-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">🪙 金币解锁</p>
                  <p className="text-neutral-500 text-xs">10金币解锁本集</p>
                </div>
                <span className="text-yellow-400 text-sm font-bold">余额：{user?.coinBalance ?? 0}</span>
              </button>
            </div>

            <button onClick={() => setShowPaywall(false)} className="w-full text-neutral-500 text-sm py-2 mt-2">稍后再说</button>
          </div>
        </div>
      )}
    </div>
  )
}
