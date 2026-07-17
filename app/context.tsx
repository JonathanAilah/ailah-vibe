'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Project {
  id: string
  title: string
  description: string
  category: 'App' | 'Game' | 'Site'
  handle: string
  avatar: string
  submittedAt: string
  votes: number
  liveUrl: string
}

export interface User {
  fullName: string
  username: string
  email: string
  age: string
  city: string
  state: string
  xp: number
  level: number
}

export interface AppContextType {
  // Auth
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => boolean
  signup: (data: User & { password: string }) => boolean
  loginWithProfile: (userData: User, password: string) => void
  logout: () => void
  awardXP: (amount: number) => void
  // Cart
  cart: CartItem[]
  addToCart: (id: string, name: string, price: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartTotal: number
  // Votes
  votes: Record<string, number>
  userVotes: Set<string>
  voteOnBuild: (buildId: string, userId: string) => boolean
  userIdentifier: string
  // Projects
  projects: Project[]
  submitProject: (title: string, description: string, category: 'App' | 'Game' | 'Site', liveUrl: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [projects, setProjects] = useState<Project[]>([])

  const [userIdentifier] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('vibeCoden_userId')
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('vibeCoden_userId', id)
      }
      return id
    }
    return `user_${Date.now()}`
  })

  // Load all saved data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedCart = localStorage.getItem('vibeCoden_cart')
      if (savedCart) setCart(JSON.parse(savedCart))

      const savedProjects = localStorage.getItem('vibeCoden_projects')
      if (savedProjects) setProjects(JSON.parse(savedProjects))

      const savedUser = localStorage.getItem('vibeCoden_user')
      if (savedUser) setUser(JSON.parse(savedUser))
    } catch (e) {
      console.error('Failed to load saved data:', e)
    }
  }, [])

  // Persist cart
  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem('vibeCoden_cart', JSON.stringify(cart))
  }, [cart])

  // Persist projects
  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem('vibeCoden_projects', JSON.stringify(projects))
  }, [projects])

  // Persist user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('vibeCoden_user', JSON.stringify(user))
      else localStorage.removeItem('vibeCoden_user')
    }
  }, [user])

  // --- Auth ---
  const signup = (data: User & { password: string }): boolean => {
    try {
      // Save accounts list (keyed by email)
      const accounts = JSON.parse(localStorage.getItem('vibeCoden_accounts') || '{}')
      if (accounts[data.email]) return false // already exists
      const dataWithXP = { ...data, xp: 0, level: 1 }
      accounts[data.email] = { ...dataWithXP }
      localStorage.setItem('vibeCoden_accounts', JSON.stringify(accounts))
      const { password: _p, ...userOnly } = dataWithXP

      // Sync to Supabase in background
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => console.log('Supabase sync failed'))

      setUser(userOnly)
      return true
    } catch {
      return false
    }
  }

  const login = (email: string, password: string): boolean => {
    try {
      const accounts = JSON.parse(localStorage.getItem('vibeCoden_accounts') || '{}')
      const account = accounts[email]
      if (!account || account.password !== password) return false
      const { password: _p, ...userOnly } = account
      setUser(userOnly)
      return true
    } catch {
      return false
    }
  }

  const loginWithProfile = (userData: User, password: string) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('vibeCoden_accounts') || '{}')
      // Preserve existing XP/level if this account already has some saved locally
      const existing = accounts[userData.email]
      const merged = {
        ...userData,
        xp: existing?.xp ?? userData.xp ?? 0,
        level: existing?.level ?? userData.level ?? 1,
        password,
      }
      accounts[userData.email] = merged
      localStorage.setItem('vibeCoden_accounts', JSON.stringify(accounts))
      const { password: _p, ...userOnly } = merged
      setUser(userOnly)
      return
    } catch {
      // ignore
    }
    setUser(userData)
  }

  const awardXP = (amount: number) => {
    setUser((prev) => {
      if (!prev) return prev
      const newXP = (prev.xp || 0) + amount
      const newLevel = Math.floor(newXP / 500) + 1
      const updated = { ...prev, xp: newXP, level: newLevel }
      // Persist to accounts store too
      try {
        const accounts = JSON.parse(localStorage.getItem('vibeCoden_accounts') || '{}')
        if (accounts[prev.email]) {
          accounts[prev.email] = { ...accounts[prev.email], xp: newXP, level: newLevel }
          localStorage.setItem('vibeCoden_accounts', JSON.stringify(accounts))
        }
      } catch {
        // ignore
      }
      return updated
    })
  }

  const logout = () => setUser(null)

  // --- Cart ---
  const addToCart = (id: string, name: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing)
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      return [...prev, { id, name, price, quantity: 1 }]
    })
  }
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => setCart([])
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // --- Votes ---
  const voteOnBuild = (buildId: string, userId: string): boolean => {
    const voteKey = `${buildId}_${userId}`
    if (userVotes.has(voteKey)) return false
    setVotes((prev) => ({ ...prev, [buildId]: (prev[buildId] || 0) + 1 }))
    setUserVotes((prev) => new Set([...prev, voteKey]))
    return true
  }

  // --- Projects ---
  const submitProject = (title: string, description: string, category: 'App' | 'Game' | 'Site', liveUrl: string) => {
    const handle = user ? `@${user.username}` : '@you'
    const avatar = user ? user.fullName.charAt(0).toUpperCase() : 'Y'
    setProjects((prev) => [
      {
        id: `project_${Date.now()}`,
        title,
        description,
        category,
        handle,
        avatar,
        submittedAt: new Date().toISOString(),
        votes: 0,
        liveUrl,
      },
      ...prev,
    ])
  }

  return (
    <AppContext.Provider value={{
      user, isLoggedIn: !!user, login, signup, loginWithProfile, logout, awardXP,
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      votes, userVotes, voteOnBuild, userIdentifier,
      projects, submitProject,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
