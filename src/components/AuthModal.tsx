'use client'
import React, { useState, useRef, useEffect } from 'react'
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
    if (!phone || phone.length < 8) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('verify') }, 800)
  }

  const handleSubmit = async () => {
    if (code.length < 4) return
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(phone, code)
      } else {
        await register(phone, code, nickname)
      }
      setShowAuthModal(false)
      setStep('input'); setPhone(''); setCode(''); setNickname('')
    } finally { setLoading(false) }
  }

  const handleModeSwitch = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setStep('input'); setCode('')
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      onClick={e => e.target === e.currentTarget && setShowAuthModal(false)}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full sm:max-w-[380px] bg-[#111114] rounded-t-3xl sm:rounded-2xl overflow-hidden border border-white/8 shadow-2xl">
        {/* 顶部渐变条 */}
        <div className="h-[3px] bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />

        <div className="px-6 pt-5 pb-8 sm:pb-10">

          {/* 拖动条 */}
          <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-5" />

          {/* 关闭按钮 */}
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-5 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* 品牌区 */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg">
              Reel<span className="text-rose-500">Short</span>
            </span>
          </div>

          {/* 标题 */}
          <h2 className="text-white text-2xl font-bold leading-tight">
            {mode === 'login' ? '欢迎登录' : '注册账号'}
          </h2>
          <p className="text-white/35 text-sm mt-1">
            {mode === 'login'
              ? '登录后享受完整功能'
              : '注册即送 50 金币，新人专属福利'}
          </p>

          {/* 分隔线 */}
          <div className="h-px bg-white/8 my-5" />

          {/* ====== 步骤1：手机号 ====== */}
          {step === 'input' && (
            <div className="space-y-3">
              {/* 手机号输入 */}
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">手机号码</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-rose-500/50 transition-colors">
                  <span className="px-4 py-3.5 text-white/40 text-sm font-medium border-r border-white/8 select-none bg-white/3">+62</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                    placeholder="手机号码"
                    maxLength={12}
                    className="flex-1 bg-transparent text-white text-sm px-4 py-3.5 placeholder:text-white/20 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* 昵称 - 仅注册 */}
              {mode === 'register' && (
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">昵称（选填）</label>
                  <div className="rounded-xl border border-white/10 bg-white/5 focus-within:border-rose-500/50 transition-colors">
                    <input
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="给自己起个名字"
                      maxLength={20}
                      className="w-full bg-transparent text-white text-sm px-4 py-3.5 placeholder:text-white/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 发送验证码 */}
              <button
                onClick={handleSendCode}
                disabled={!phone || phone.length < 8 || loading}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold rounded-xl py-4 disabled:opacity-35 shadow-lg shadow-rose-500/15 mt-1"
              >
                {loading ? '发送中...' : '获取验证码'}
              </button>
            </div>
          )}

          {/* ====== 步骤2：验证码 ====== */}
          {step === 'verify' && (
            <div className="space-y-5">
              <div>
                <p className="text-white/35 text-sm mb-4">
                  验证码已发送至 <span className="text-white font-medium">+62 {phone.slice(0,4)}****{phone.slice(-3)}</span>
                </p>
                {/* 4位验证码 */}
                <div className="flex gap-2.5 justify-center" onPaste={e => {
                  const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,4)
                  setCode(pasted)
                  if (pasted.length === 4) setTimeout(handleSubmit, 100)
                }}>
                  {[0,1,2,3].map(i => (
                    <CodeInput
                      key={i}
                      value={code[i] || ''}
                      onChange={val => {
                        const newCode = code.split('')
                        newCode[i] = val
                        setCode(newCode.join('').slice(0, 4))
                        if (val && i < 3) {
                          const inputs = document.querySelectorAll<HTMLInputElement>('.code-input')
                          inputs[i+1]?.focus()
                        }
                        if (newCode.filter(Boolean).length === 4) setTimeout(handleSubmit, 100)
                      }}
                      onKeyDown={(e, idx) => {
                        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
                          const inputs = document.querySelectorAll<HTMLInputElement>('.code-input')
                          inputs[idx-1]?.focus()
                        }
                      }}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* 提示 */}
              <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                <p className="text-white/30 text-xs leading-relaxed">
                  📱 未收到验证码？可尝试 <span className="text-white/50 font-medium">重新发送</span>，或稍后重试
                </p>
              </div>

              <button
                onClick={() => { setStep('input'); setCode('') }}
                className="w-full text-center text-rose-400 text-sm hover:underline"
              >
                ← 修改手机号码
              </button>
            </div>
          )}

          {/* 底部 */}
          {step === 'input' && (
            <p className="text-center text-white/30 text-xs mt-5 leading-relaxed">
              登录即表示同意
              <span className="text-white/45"> 用户协议</span> 和
              <span className="text-white/45"> 隐私政策</span>
              <br />
              <button onClick={handleModeSwitch} className="text-rose-400 hover:underline mt-1 inline-block">
                {mode === 'login' ? '还没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CodeInput({ value, onChange, onKeyDown, index }: {
  value: string; onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent, idx: number) => void; index: number
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={e => onChange(e.target.value.replace(/\D/g,''))}
      onKeyDown={e => onKeyDown(e, index)}
      className="code-input w-[68px] h-[68px] bg-white/8 border border-white/12 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-rose-500/70 focus:bg-white/12 transition-all"
    />
  )
}
