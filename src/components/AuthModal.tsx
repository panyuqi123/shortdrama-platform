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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl p-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button onClick={() => setShowAuthModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-[#999] text-lg">×</button>
        </div>

        {step === 'input' ? (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-sm">+62</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                placeholder="手机号码"
                maxLength={12}
                className="w-full bg-[#2a2a2a] text-white rounded-xl py-3.5 pl-14 pr-4 text-base placeholder-[#666]"
              />
            </div>
            {mode === 'register' && (
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="设置昵称"
                maxLength={20}
                className="w-full bg-[#2a2a2a] text-white rounded-xl py-3.5 px-4 text-base placeholder-[#666]"
              />
            )}
            <button
              onClick={handleSendCode}
              disabled={!phone || loading}
              className="w-full bg-[#ff2d55] text-white rounded-xl py-3.5 text-base font-medium disabled:opacity-50"
            >
              {loading ? '发送中...' : '获取验证码'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[#999] text-sm text-center">验证码已发送至 +62 {phone.slice(0,4)}****{phone.slice(-3)}</p>
            <div className="flex gap-2">
              {[0,1,2,3].map(i => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g,'')
                    if (val) {
                      const newCode = code.split('')
                      newCode[i] = val
                      setCode(newCode.join(''))
                      if (i < 3) {
                        const inputs = document.querySelectorAll<HTMLInputElement>('.code-input')
                        inputs[i+1]?.focus()
                      }
                    }
                  }}
                  className="code-input flex-1 bg-[#2a2a2a] text-white text-center text-2xl rounded-xl py-4 placeholder-[#666]"
                  placeholder="•"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={code.length < 4 || loading}
              className="w-full bg-[#ff2d55] text-white rounded-xl py-3.5 text-base font-medium disabled:opacity-50"
            >
              {loading ? '验证中...' : (mode === 'login' ? '登录' : '注册并送50金币')}
            </button>
            <button onClick={() => { setStep('input'); setCode('') }}
              className="w-full text-[#999] text-sm py-2">
              返回修改号码
            </button>
          </div>
        )}

        <p className="text-center text-[#666] text-xs mt-4">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStep('input'); setCode('') }}
            className="text-[#ff2d55] ml-1">
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>

        <p className="text-center text-[#444] text-xs mt-3">
          登录即表示同意 <span className="text-[#666]">用户协议</span> 和 <span className="text-[#666]">隐私政策</span>
        </p>
      </div>
    </div>
  )
}
