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
}

export interface User {
  fullName: string
  username: string
  email: string
  age: string
  city: string
  state: string
}

export interface AppContextType {
  // Auth
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => boolean
  signup: (data: User & { password: string }) => boolean
  logout: () => void
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
  submitProject: (title: string, description: string, category: 'App' | 'Game' | 'Site') => void
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
      accounts[data.email] = { ...data }
      localStorage.setItem('vibeCoden_accounts', JSON.stringify(accounts))
      const { password: _p, ...userOnly } = data
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
  const submitProject = (title: string, description: string, category: 'App' | 'Game' | 'Site') => {
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
      },
      ...prev,
    ])
  }

  return (
    <AppContext.Provider value={{
      user, isLoggedIn: !!user, login, signup, logout,
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
