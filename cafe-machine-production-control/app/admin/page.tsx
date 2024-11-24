'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  nome: string
  login: string
}

export default function GerenciamentoAcessos() {
  const [users, setUsers] = useState<User[]>([])
  const [nome, setNome] = useState('')
  const [login, setLogin] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const saveUsers = (newUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(newUsers))
    setUsers(newUsers)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!nome || !login) {
      setMessage('Por favor, preencha todos os campos.')
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      nome,
      login
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    setNome('')
    setLogin('')
    setMessage('Usuário criado com sucesso!')
  }

  const handleDelete = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id)
    saveUsers(updatedUsers)
    setMessage('Usuário removido com sucesso!')
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gerenciamento de Acessos</CardTitle>
          <CardDescription>Crie novos acessos para check-in de máquinas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input 
                  id="nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input 
                  id="login" 
                  value={login} 
                  onChange={(e) => setLogin(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Criar Novo Acesso
            </Button>
          </form>
          {message && (
            <p className="mt-4 text-sm text-green-600">
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}