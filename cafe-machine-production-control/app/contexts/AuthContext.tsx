'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

interface User {
  id: string
  nome: string
  login: string
  tipo: 'comum' | 'administrador'
}

interface AuthContextType {
  user: User | null
  login: (login: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Define o usuário padrão diretamente
    const defaultUser = {
      id: '1',
      nome: 'Usuário Padrão',
      login: 'padrao',
      tipo: 'comum' as const
    }
    setUser(defaultUser)
  }, [])

  const login = async (login: string, senha: string) => {
    const users = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]')
    const foundUser = users.find((u: any) => u.login === login && u.senha === senha)
    
    if (foundUser) {
      const { senha: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}