'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'comum' | 'administrador'
}

export default function CadastroPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nome = formData.get('nome') as string
    const login = formData.get('login') as string
    const senha = formData.get('senha') as string
    const confirmarSenha = formData.get('confirmarSenha') as string

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]') as User[]
    
    // Check if login already exists
    if (users.some(user => user.login === login)) {
      setError('Este login já está em uso')
      return
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      nome,
      login,
      senha,
      tipo: 'comum' // New users are always common users
    }

    // Save user
    localStorage.setItem('sistema_usuarios', JSON.stringify([...users, newUser]))
    
    // Redirect to login
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>Crie sua conta para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input id="login" name="login" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" name="senha" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input id="confirmarSenha" name="confirmarSenha" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">{error}</p>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}