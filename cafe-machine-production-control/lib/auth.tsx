'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  nome: string
  login: string
  cargo: 'admin' | 'tecnico'
}

interface AuthContextType {
  user: User | null
  login: (login: string, senha: string) => Promise<boolean>
  logout: () => void
  cadastrar: (nome: string, login: string, senha: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (login: string, senha: string) => {
    const usuariosString = localStorage.getItem('usuarios')
    if (!usuariosString) return false

    const usuarios = JSON.parse(usuariosString)
    const usuario = usuarios.find((u: User & { senha: string }) => u.login === login && u.senha === senha)

    if (usuario) {
      const userData: User = {
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        cargo: usuario.cargo
      }
      setUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const cadastrar = async (nome: string, login: string, senha: string) => {
    try {
      const usuariosString = localStorage.getItem('usuarios')
      const usuarios = usuariosString ? JSON.parse(usuariosString) : []

      // Verifica se já existe um usuário com o mesmo login
      if (usuarios.some((u: User) => u.login === login)) {
        return false
      }

      const novoUsuario = {
        id: crypto.randomUUID(),
        nome,
        login,
        senha,
        cargo: 'tecnico', // Novos usuários são cadastrados como técnicos por padrão
        dataCadastro: new Date().toISOString()
      }

      usuarios.push(novoUsuario)
      localStorage.setItem('usuarios', JSON.stringify(usuarios))

      return true
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, cadastrar, isLoading }}>
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