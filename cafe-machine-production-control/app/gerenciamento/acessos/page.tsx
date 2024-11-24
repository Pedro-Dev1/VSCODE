'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'comum' | 'administrador'
}

export default function AcessosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<User>({
    id: '',
    nome: '',
    login: '',
    senha: '',
    tipo: 'comum'
  })

  useEffect(() => {
    const storedUsers = localStorage.getItem('sistema_usuarios')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const newUserWithId = {
        ...newUser,
        id: crypto.randomUUID()
      }
      
      const updatedUsers = [...users, newUserWithId]
      setUsers(updatedUsers)
      
      localStorage.setItem('sistema_usuarios', JSON.stringify(updatedUsers))
      
      setNewUser({
        id: '',
        nome: '',
        login: '',
        senha: '',
        tipo: 'comum'
      })
      
      toast({
        title: "Sucesso",
        description: "Credencial criada com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar credencial. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id)
    setUsers(updatedUsers)
    localStorage.setItem('sistema_usuarios', JSON.stringify(updatedUsers))
    toast({
      title: "Sucesso",
      description: "Credencial excluída com sucesso!",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Acessos</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Criar Nova Credencial</CardTitle>
          <CardDescription>
            Adicione uma nova credencial para acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={newUser.nome}
                onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                value={newUser.login}
                onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={newUser.senha}
                onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Acesso</Label>
              <Select
                value={newUser.tipo}
                onValueChange={(value) => setNewUser({ ...newUser, tipo: value as 'comum' | 'administrador' })}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comum">Comum</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Criar Credencial
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais Existentes</CardTitle>
          <CardDescription>
            Lista de todas as credenciais cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>{user.tipo}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Excluir
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