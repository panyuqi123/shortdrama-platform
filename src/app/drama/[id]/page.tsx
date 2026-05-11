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

  const startY = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 60) {
      if (diff > 0 && selectedIdx < (drama?.episodes.length ?? 1) - 1) {
        handleSelect(selectedIdx + 1); window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (diff < 0 && selectedIdx > 0) {
        handleSelect(selectedIdx - 1); window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    if (drama && drama.episodes[selectedIdx]) {
      const id = `${drama.id}-${selectedIdx}`
      const saved = localStorage.getItem(`progress_${id}`)
      if (saved && videoRef.current) videoRef.current.currentTime = parseFloat(saved)
    }
  }, [drama?.id, selectedIdx])

  const handleTimeUpdate = () => {
    if (videoRef.current && drama) {
      const id = `${drama.id}-${selectedIdx}`
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setPlayProgress(pct)
      if (pct > 5) localStorage.setItem(`progress_${id}`, String(videoRef.current.currentTime))
    }
  }

  if (!drama) return (
    <div className="min-h-dvh bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🎬</div>
        <p className="text-neutral-500">剧集不存在</p>
        <button onClick={() => router.back()} className="mt-4 text-red-500 text-sm">返回</button>
      </div>
    </div>
  )

  const ep = drama.episodes[selectedIdx]
  const canPlay = (i: number) => drama.episodes[i].isFree || user?.isVip

  const handleSelect = (i: number) => {
    if (!canPlay(i)) { setCurrentUnlock(i); setShowPaywall(true) }
    else { setSelectedIdx(i); setPlayProgress(0); setTimeout(() => videoRef.current?.play(), 100) }
  }

  const handleUnlock = async () => {
    if (!user) { setShowPaywall(false); setShowAuthModal(true); return }
    if (currentUnlock !== null) {
      const ok = await unlockEpisode(drama.episodes[currentUnlock].id, drama.id)
      if (ok) { setSelectedIdx(currentUnlock); setShowPaywall(false); setTimeout(() => videoRef.current?.play(), 100) }
    }
  }

  const handleVip = () => {
    if (!user) { setShowPaywall(false); setShowAuthModal(true); return }
    buyVip(); setShowPaywall(false)
  }

  const handleNext = () => { if (selectedIdx < drama.episodes.length - 1) handleSelect(selectedIdx + 1) }

  return (
    <div className="min-h-dvh bg-black no-select" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent"
           style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-2.5 px-4 pt-3 pb-3">
          <button onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 transition-colors active:scale-95">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-sm truncate">{drama.title}</h1>
            <p className="text-white/40 text-xs">{formatViewCount(drama.viewCount)} · ★ {drama.rating}</p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
        </div>
        <div className="px-4 pb-2.5">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all" style={{ width: `${playProgress}%` }} />
          </div>
        </div>
      </div>

      {/* 视频播放器 */}
      <div className="relative w-full bg-black">
        <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: '92dvh', margin: '0 auto' }}>
          <video
            ref={videoRef} key={ep.id} src={ep.videoUrl}
            className="w-full h-full object-contain"
            controls playsInline onTimeUpdate={handleTimeUpdate} onEnded={handleNext}
          />
          <div className="absolute bottom-16 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/10">
            {selectedIdx + 1}/{drama.episodes.length}
          </div>
          {selectedIdx < drama.episodes.length - 1 && (
            <div className="absolute bottom-16 left-4 bg-black/60 backdrop-blur-sm text-white/50 text-xs px-2.5 py-1 rounded-full">
              ↑ 上滑看下集
            </div>
          )}
        </div>
      </div>

      {/* 剧集信息 */}
      <div className="px-4 py-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-white font-bold text-base">{drama.title}</h1>
              {drama.isVipOnly && (
                <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">👑 VIP</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <span>{formatViewCount(drama.viewCount)}</span>
              <div className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="text-yellow-400">★ {drama.rating}</span>
              <div className="w-1 h-1 rounded-full bg-neutral-700" />
              <span>更新 {drama.updatedAt}</span>
            </div>
          </div>
          <button onClick={() => setShowDesc(!showDesc)}
            className="flex items-center gap-1 text-red-500 text-xs font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 hover:bg-red-500/15 transition-colors flex-shrink-0">
            {showDesc ? '收起' : '详情'}
            <svg className={`w-3 h-3 transition-transform ${showDesc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {drama.tags.map(tag => (
            <span key={tag} className="bg-neutral-800 text-neutral-400 text-xs px-2.5 py-1 rounded-full border border-neutral-700/50">#{tag}</span>
          ))}
        </div>

        {showDesc && (
          <div className="bg-neutral-900/80 rounded-xl p-4 mb-4 border border-white/5">
            <p className="text-neutral-400 text-sm leading-relaxed">{drama.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">选集<span className="text-neutral-600 font-normal text-xs ml-2">共 {drama.episodes.length} 集</span></h3>
          <span className="text-neutral-600 text-xs">上下滑动切换</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {drama.episodes.map((episode, i) => {
            const unlocked = episode.isFree || user?.isVip
            const isCurrent = i === selectedIdx
            return (
              <button key={episode.id} onClick={() => handleSelect(i)}
                className={`relative rounded-xl overflow-hidden aspect-video transition-all ${
                  isCurrent ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : 'hover:ring-1 hover:ring-white/20'
                }`}>
                <img src={episode.coverUrl} alt={`第${i+1}集`} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 flex items-center justify-center ${!unlocked ? 'bg-black/60' : isCurrent ? 'bg-black/20' : 'bg-black/30'}`}>
                  {!unlocked && (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  )}
                  {unlocked && isCurrent && (
                    <div className="w-5 h-5 rounded-sm bg-red-500 flex items-center justify-center shadow-md">
                      <svg className="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  )}
                  {unlocked && !isCurrent && <div className="w-2 h-2 rounded-full bg-white/60" />}
                </div>
                {episode.isFree && !isCurrent && (
                  <div className="absolute top-1 left-1 bg-emerald-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">免费</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                  <span className="text-white text-xs font-medium">{episode.number}集</span>
                </div>
              </button>
            )
          })}
        </div>

        <h3 className="text-white font-bold text-sm mb-3">相关推荐</h3>
        <div className="grid grid-cols-3 gap-2">
          {mockDramas.filter(d => d.id !== drama.id).slice(0, 3).map(d => (
            <button key={d.id} onClick={() => window.location.href = `/drama/${d.id}`} className="block rounded-xl overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img src={d.cover} alt={d.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{d.title}</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded border border-white/10">{d.episodes.length}集</div>
                {d.isVipOnly && (
                  <div className="absolute top-2 left-2"><span className="text-[10px] bg-yellow-400/90 text-black font-bold px-1.5 py-0.5 rounded">VIP</span></div>
                )}
              </div>
            </button>
          ))}
        </div>
        <div style={{ height: 'max(16px, env(safe-area-inset-bottom))' }} />
      </div>

      {/* 付费弹窗 */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
             onClick={e => e.target === e.currentTarget && setShowPaywall(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPaywall(false)} />
          <div className="relative w-full max-w-sm bg-neutral-900 rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
               style={{ maxHeight: '90dvh', marginBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="h-[3px] bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400" />
            <div className="p-6 pb-8 overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(90dvh - 60px)' }}>
              <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-5" />

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-22 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 flex-shrink-0">
                  <img src={drama.episodes[currentUnlock ?? 0]?.coverUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">解锁内容</p>
                  <h3 className="text-white font-bold text-base leading-tight mb-1">{drama.title} · 第{currentUnlock !== null ? drama.episodes[currentUnlock].number : ''}集</h3>
                  <p className="text-neutral-500 text-xs">{currentUnlock !== null ? drama.episodes[currentUnlock].title : ''}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-3.5 mb-5 border border-red-500/15">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">💡</span>
                  <p className="text-neutral-400 text-xs leading-relaxed">开通 VIP 全站免费看，无需额外购买，无限制畅享所有内容</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button onClick={handleVip}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-xl py-3.5 font-bold text-white text-sm shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                  <span>👑</span>开通 VIP 会员 · 首月仅需 ¥6.9
                </button>
                <button onClick={handleUnlock}
                  className="w-full bg-neutral-800 rounded-xl py-3.5 text-left px-4 flex items-center justify-between hover:bg-neutral-700/70 transition-colors">
                  <div>
                    <p className="text-white font-bold text-sm flex items-center gap-1.5">🪙 金币解锁<span className="text-neutral-500 font-normal text-xs">第{currentUnlock !== null ? drama.episodes[currentUnlock].number : ''}集</span></p>
                    <p className="text-neutral-500 text-xs mt-0.5">10金币 / 单集购买</p>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-400 text-sm font-bold">{user?.coinBalance ?? 0}</span>
                    <p className="text-neutral-600 text-xs">余额</p>
                  </div>
                </button>
              </div>

              <button onClick={() => setShowPaywall(false)} className="w-full text-neutral-600 text-sm py-2 mt-3 hover:text-neutral-400 transition-colors">稍后再说</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
