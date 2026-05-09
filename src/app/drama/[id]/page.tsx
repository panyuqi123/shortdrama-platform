'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { mockDramas, formatViewCount, Drama, Episode } from '../../../lib/mockData'
import { useAuth } from '../../../lib/auth'
import Link from 'next/link'

export default function DramaPage() {
  const params = useParams()
  const router = useRouter()
  const drama = mockDramas.find(d => d.id === params.id)

  const [selectedEp, setSelectedEp] = useState<Episode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [currentUnlock, setCurrentUnlock] = useState<Episode | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { user, unlockEpisode, buyVip, setShowAuthModal } = useAuth()

  useEffect(() => {
    if (drama && !selectedEp) {
      setSelectedEp(drama.episodes[0])
    }
  }, [drama])

  if (!drama) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#666]">剧集不存在</p>
      </div>
    )
  }

  const canPlay = (ep: Episode) => {
    if (ep.isFree) return true
    if (!user) { setShowAuthModal(true); return false }
    if (user.isVip) return true
    return false
  }

  const handleSelectEp = async (ep: Episode) => {
    if (!canPlay(ep)) {
      setCurrentUnlock(ep)
      setShowPaywall(true)
      return
    }
    setSelectedEp(ep)
    setPlaying(false)
    setTimeout(() => videoRef.current?.play(), 100)
  }

  const handleUnlock = async () => {
    if (!user) { setShowPaywall(false); setShowAuthModal(true); return }
    if (currentUnlock) {
      const ok = await unlockEpisode(currentUnlock.id, drama.id)
      if (ok) {
        setSelectedEp(currentUnlock)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-6">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-semibold text-base truncate flex-1">{drama.title}</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* 视频播放器 */}
      <div className="relative bg-black aspect-[9/16] max-h-[70vh] mx-auto">
        {selectedEp && (
          <video
            ref={videoRef}
            key={selectedEp.id}
            src={selectedEp.videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay={playing}
            playsInline
            onPlay={() => setPlaying(true)}
            onEnded={() => {
              const idx = drama.episodes.findIndex(e => e.id === selectedEp.id)
              if (idx < drama.episodes.length - 1) {
                handleSelectEp(drama.episodes[idx + 1])
              }
            }}
          />
        )}

        {/* 选集遮罩 */}
        {drama.episodes.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {drama.episodes.findIndex(e => e.id === selectedEp?.id) + 1}/{drama.episodes.length}集
          </div>
        )}
      </div>

      {/* 剧集信息 */}
      <div className="px-4 mt-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">{drama.title}</h1>
            <p className="text-[#999] text-sm mt-1">
              {formatViewCount(drama.viewCount)}播放 · ★ {drama.rating} · {drama.updatedAt} 更新
            </p>
          </div>
          {drama.isVipOnly && (
            <span className="flex-shrink-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-0.5">
              👑 VIP
            </span>
          )}
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {drama.tags.map(tag => (
            <span key={tag} className="bg-[#1a1a1a] text-[#999] text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* 简介 */}
        <details className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
          <summary className="text-white text-sm font-medium cursor-pointer list-none flex items-center justify-between">
            简介
            <svg className="w-4 h-4 text-[#666] transition-transform open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="text-[#999] text-sm mt-2 leading-relaxed">{drama.description}</p>
        </details>

        {/* 选集 */}
        <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
          选集
          <span className="text-[#666] font-normal text-sm">
            {selectedEp ? `正在播放：第${selectedEp.number}集 ${selectedEp.title}` : ''}
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {drama.episodes.map(ep => {
            const unlocked = ep.isFree || (user?.isVip) || (user && user.coinBalance >= 10)
            const isCurrent = ep.id === selectedEp?.id
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEp(ep)}
                className={`relative rounded-xl overflow-hidden aspect-video ${
                  isCurrent ? 'ring-2 ring-[#ff2d55]' : ''
                }`}
              >
                <img
                  src={ep.coverUrl}
                  alt={`第${ep.number}集`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {!ep.isFree && !unlocked && (
                    <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {isCurrent && playing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-sm" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-1">
                  <span className="text-white text-xs font-medium">第{ep.number}集</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* 相关推荐 */}
        <h3 className="text-white font-bold text-base mt-6 mb-3">相关推荐</h3>
        <div className="grid grid-cols-3 gap-2">
          {mockDramas.filter(d => d.id !== drama.id).slice(0, 3).map(d => (
            <Link href={`/drama/${d.id}`} key={d.id} className="block">
              <div className="rounded-xl overflow-hidden aspect-[3/4] relative">
                <img src={d.cover} alt={d.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium line-clamp-2">{d.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 付费弹窗 */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={e => e.target === e.currentTarget && setShowPaywall(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl p-6 pb-8">
            <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-4" />
            <h3 className="text-white text-lg font-bold text-center mb-1">
              解锁第{currentUnlock?.number}集
            </h3>
            <p className="text-[#999] text-sm text-center mb-5">
              本集为付费内容，请选择解锁方式
            </p>

            {/* 试看提示 */}
            <div className="bg-[#0a0a0a] rounded-xl p-3 mb-4 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-[#999] text-xs">开通 VIP 会员可免费观看全部内容，无限制畅看</p>
            </div>

            {/* 解锁选项 */}
            <div className="space-y-3">
              {/* VIP 会员 */}
              <button onClick={handleVip} className="w-full bg-gradient-to-r from-[#ff2d55] to-[#ff6600] rounded-xl p-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">👑 VIP 会员</p>
                    <p className="text-white/70 text-xs mt-0.5">全站免费看 + 无广告</p>
                  </div>
                  <span className="text-white font-bold">立即开通</span>
                </div>
              </button>

              {/* 金币解锁 */}
              <button onClick={handleUnlock} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">🪙 金币解锁</p>
                    <p className="text-[#999] text-xs mt-0.5">仅需 10 金币解锁本集</p>
                  </div>
                  <span className="text-[#FFD700] font-bold">余额：{user?.coinBalance ?? 0}</span>
                </div>
              </button>

              {(!user || user.coinBalance < 10) && (
                <p className="text-[#ff2d55] text-xs text-center -mt-1">
                  金币不足？完成任务获取更多金币
                </p>
              )}
            </div>

            <button onClick={() => setShowPaywall(false)} className="w-full text-[#666] text-sm py-3 mt-2">
              稍后再试
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
