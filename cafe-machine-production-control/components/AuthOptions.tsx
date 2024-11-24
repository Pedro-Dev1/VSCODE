'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Simulating a database of users
const users = [
  { username: 'admin', password: 'admin123' }
]

export function AuthOptions() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isLogin) {
        // Login logic
        const user = users.find(u => u.username === username && u.password === password)
        if (user) {
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify(user))
          
          toast({
            title: "Login realizado",
            description: "Bem-vindo de volta!",
          })
          
          // Use router.push instead of replace for better navigation
          router.push('/dashboard')
        } else {
          toast({
            title: "Erro",
            description: "Credenciais inválidas. Tente novamente.",
            variant: "destructive",
          })
        }
      } else {
        // Register logic
        if (users.some(u => u.username === username)) {
          toast({
            title: "Erro",
            description: "Nome de usuário já existe. Escolha outro.",
            variant: "destructive",
          })
        } else {
          // Add new user
          const newUser = { username, password }
          users.push(newUser)
          
          // Automatically log in the new user
          localStorage.setItem('user', JSON.stringify(newUser))
          
          toast({
            title: "Conta criada",
            description: "Cadastro realizado com sucesso! Redirecionando para o dashboard...",
          })
          
          router.push('/dashboard')
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Criar Conta"}</CardTitle>
        <CardDescription>
          {isLogin ? "Acesse sua conta" : "Cadastre-se para acessar o sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleSubmit}>
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
        </Button>
      </CardFooter>
    </Card>
  )
}