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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 弹窗主体 */}
      <div className="relative w-full max-w-[360px] bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-6 sm:pb-8">

        {/* 顶部拖动条 */}
        <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-bold">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 text-lg"
          >
            ×
          </button>
        </div>

        {step === 'input' ? (
          <div className="space-y-3">
            {/* 手机号 */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none">+62</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                placeholder="手机号码"
                maxLength={12}
                className="w-full bg-neutral-800 text-white rounded-xl py-3.5 pl-12 pr-4 text-sm placeholder-neutral-600 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* 昵称 - 仅注册 */}
            {mode === 'register' && (
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="设置昵称（选填）"
                maxLength={20}
                className="w-full bg-neutral-800 text-white rounded-xl py-3.5 px-4 text-sm placeholder-neutral-600 outline-none focus:ring-2 focus:ring-red-500"
              />
            )}

            {/* 获取验证码按钮 */}
            <button
              onClick={handleSendCode}
              disabled={!phone || loading}
              className="w-full bg-red-500 text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40"
            >
              {loading ? '发送中...' : '获取验证码'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 发送提示 */}
            <p className="text-neutral-500 text-xs text-center">
              验证码已发送至 +62 {phone.slice(0,4)}****{phone.slice(-3)}
            </p>

            {/* 验证码输入框 */}
            <div className="flex gap-2">
              {[0,1,2,3].map(i => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
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
                      if (newCode.filter(Boolean).length === 4) {
                        setTimeout(handleSubmit, 100)
                      }
                    }
                  }}
                  className="code-input flex-1 bg-neutral-800 text-white text-center text-2xl rounded-xl py-3.5 outline-none focus:ring-2 focus:ring-red-500"
                />
              ))}
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={code.length < 4 || loading}
              className="w-full bg-red-500 text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40"
            >
              {loading ? '验证中...' : (mode === 'login' ? '登录' : '注册并送50金币')}
            </button>

            {/* 返回修改 */}
            <button
              onClick={() => { setStep('input'); setCode('') }}
              className="w-full text-neutral-500 text-xs text-center py-1"
            >
              返回修改号码
            </button>
          </div>
        )}

        {/* 切换登录/注册 */}
        <p className="text-center text-neutral-500 text-xs mt-4">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setStep('input')
              setCode('')
            }}
            className="text-red-500 ml-1"
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>

        {/* 协议 */}
        <p className="text-center text-neutral-600 text-xs mt-2">
          登录即表示同意
          <span className="text-neutral-500"> 用户协议</span> 和
          <span className="text-neutral-500"> 隐私政策</span>
        </p>
      </div>
    </div>
  )
}
