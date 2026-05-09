'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  phone: string
  nickname: string
  avatar: string
  isVip: boolean
  vipExpireAt?: string
  coinBalance: number
}

interface AuthContextType {
  user: User | null
  login: (phone: string, code: string) => Promise<void>
  register: (phone: string, code: string, nickname: string) => Promise<void>
  logout: () => void
  buyVip: () => Promise<void>
  unlockEpisode: (episodeId: string, dramaId: string) => Promise<boolean>
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shortdrama_user')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [showAuthModal, setShowAuthModal] = useState(false)

  const login = async (phone: string, code: string) => {
    await new Promise(r => setTimeout(r, 800))
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone,
      nickname: `用户${phone.slice(-4)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
      isVip: false,
      coinBalance: 0,
    }
    setUser(newUser)
    localStorage.setItem('shortdrama_user', JSON.stringify(newUser))
  }

  const register = async (phone: string, code: string, nickname: string) => {
    await new Promise(r => setTimeout(r, 800))
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone,
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      isVip: false,
      coinBalance: 50,
    }
    setUser(newUser)
    localStorage.setItem('shortdrama_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('shortdrama_user')
  }

  const buyVip = async () => {
    if (!user) { setShowAuthModal(true); return }
    await new Promise(r => setTimeout(r, 1000))
    const updated = { ...user, isVip: true, vipExpireAt: '2026-12-31' }
    setUser(updated)
    localStorage.setItem('shortdrama_user', JSON.stringify(updated))
  }

  const unlockEpisode = async (episodeId: string, dramaId: string): Promise<boolean> => {
    if (!user) { setShowAuthModal(true); return false }
    if (user.isVip) return true
    if (user.coinBalance >= 10) {
      await new Promise(r => setTimeout(r, 500))
      const updated = { ...user, coinBalance: user.coinBalance - 10 }
      setUser(updated)
      localStorage.setItem('shortdrama_user', JSON.stringify(updated))
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, buyVip,
      unlockEpisode, showAuthModal, setShowAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
