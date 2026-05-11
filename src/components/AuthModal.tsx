'use client'
import React, { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [loading, setLoading] = useState(false)

  if (!showAuthModal) return null

  const handleSendCode = () => {
    if (!phone) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('verify')
    }, 800)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(phone, code)
      } else {
        await register(phone, code, nickname)
      }
      setShowAuthModal(false)
      setStep('input')
      setPhone(''); setCode(''); setNickname('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 弹窗主体 */}
      <div className="relative w-full max-w-[360px] bg-neutral-900 rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/5 shadow-2xl">

        {/* 顶部渐变条 */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400" />

        <div className="p-6 sm:pb-8">
          {/* 拖动条 */}
          <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold">
                {mode === 'login' ? '欢迎回来' : '创建账号'}
              </h2>
              <p className="text-neutral-500 text-xs mt-0.5">
                {mode === 'login' ? '登录后享受更多精彩内容' : '注册即送50金币'}
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* 步骤1: 输入手机号 */}
          {step === 'input' ? (
            <div className="space-y-3">
              {/* 手机号 */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none font-medium">+62</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                  placeholder="请输入手机号码"
                  maxLength={12}
                  className="w-full bg-neutral-800/80 text-white rounded-xl py-3.5 pl-14 pr-4 text-sm placeholder-neutral-600 outline-none border border-neutral-700/50 focus:border-red-500/50 transition-colors"
                />
              </div>

              {/* 昵称 - 仅注册 */}
              {mode === 'register' && (
                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="设置昵称（选填）"
                    maxLength={20}
                    className="w-full bg-neutral-800/80 text-white rounded-xl py-3.5 px-4 text-sm placeholder-neutral-600 outline-none border border-neutral-700/50 focus:border-red-500/50 transition-colors"
                  />
                </div>
              )}

              {/* 获取验证码 */}
              <button
                onClick={handleSendCode}
                disabled={!phone || loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40 shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    发送中...
                  </span>
                ) : '获取验证码'}
              </button>

              {/* 注册福利提示 */}
              {mode === 'register' && (
                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-base">🎁</span>
                  <p className="text-yellow-400/90 text-xs">新用户注册即送 <strong>50金币</strong>，可免费解锁5部剧集</p>
                </div>
              )}
            </div>
          ) : (
            /* 步骤2: 验证码 */
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-neutral-400 text-sm">
                  验证码已发送至 <span className="text-white font-medium">+62 {phone.slice(0,4)}****{phone.slice(-3)}</span>
                </p>
                <button
                  onClick={() => { setStep('input'); setCode('') }}
                  className="text-red-500 text-xs mt-1.5 hover:underline"
                >
                  修改号码
                </button>
              </div>

              {/* 验证码输入框 */}
              <div className="flex gap-2.5">
                {[0,1,2,3].map(i => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[i] || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g,'')
                      if (val || e.target.value === '') {
                        const newCode = code.split('')
                        newCode[i] = val
                        setCode(newCode.join('').slice(0, 4))
                        if (val && i < 3) {
                          const inputs = document.querySelectorAll<HTMLInputElement>('.code-input')
                          inputs[i+1]?.focus()
                        }
                        if (newCode.filter(Boolean).length === 4) {
                          setTimeout(handleSubmit, 100)
                        }
                      }
                    }}
                    className="code-input flex-1 bg-neutral-800/80 text-white text-center text-2xl font-bold py-3.5 rounded-xl outline-none border border-neutral-700/50 focus:border-red-500/50 transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={code.length < 4 || loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40 shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-[0.99] transition-all"
              >
                {loading ? '验证中...' : (mode === 'login' ? '登录' : '注册并登录')}
              </button>

              {/* 重发提示 */}
              <p className="text-center text-neutral-600 text-xs">
                未收到验证码？<button className="text-red-500 hover:underline">重新发送</button>
              </p>
            </div>
          )}

          {/* 分割线 */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-neutral-600 text-xs">其他方式</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* 其他登录方式 */}
          <div className="flex justify-center gap-4 mb-5">
            {['Google', 'Apple'].map(provider => (
              <button
                key={provider}
                className="flex items-center gap-2 bg-neutral-800/60 text-neutral-300 text-sm px-5 py-2.5 rounded-xl border border-neutral-700/50 hover:bg-neutral-700/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                {provider}
              </button>
            ))}
          </div>

          {/* 切换登录/注册 */}
          <p className="text-center text-neutral-500 text-xs">
            {mode === 'login' ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setStep('input')
                setCode('')
              }}
              className="text-red-500 ml-1 font-medium hover:underline"
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>

          {/* 协议 */}
          <p className="text-center text-neutral-700 text-xs mt-2.5">
            登录即表示同意
            <span className="text-neutral-600"> 用户协议</span> 和
            <span className="text-neutral-600"> 隐私政策</span>
          </p>
        </div>
      </div>
    </div>
  )
}
