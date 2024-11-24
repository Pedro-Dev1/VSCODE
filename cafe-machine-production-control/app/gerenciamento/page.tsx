'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from '@/app/contexts/AuthContext'

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'master' | 'administrador' | 'comum'
}

export default function GerenciamentoPage() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({
    nome: '',
    login: '',
    senha: '',
    tipo: 'comum' as const
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [masterCredentials, setMasterCredentials] = useState({ login: '', senha: '' })
  const [isMasterAuthDialogOpen, setIsMasterAuthDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<'delete' | 'createAdmin' | null>(null)

  useEffect(() => {
    // Carregar usuários existentes
    const savedUsers = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]')
    
    // Verificar se o usuário master já existe
    const masterExists = savedUsers.some((user: User) => user.tipo === 'master')
    
    if (!masterExists) {
      // Criar usuário master
      const masterUser = {
        id: 'master-1',
        nome: 'Desenvolvedor',
        login: 'Dev',
        senha: '1234',
        tipo: 'master' as const
      }
      const updatedUsers = [...savedUsers, masterUser]
      localStorage.setItem('sistema_usuarios', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    } else {
      setUsers(savedUsers)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!newUser.nome || !newUser.login || !newUser.senha) {
      setError('Todos os campos são obrigatórios')
      return
    }

    // Verificar se login já existe
    if (users.some(user => user.login === newUser.login)) {
      setError('Este login já está em uso')
      return
    }

    if (newUser.tipo === 'administrador') {
      setCurrentAction('createAdmin')
      setIsMasterAuthDialogOpen(true)
      return
    }

    createUser()
  }

  const createUser = () => {
    const newUserComplete = {
      id: Date.now().toString(),
      ...newUser
    }

    const updatedUsers = [...users, newUserComplete]
    localStorage.setItem('sistema_usuarios', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setNewUser({
      nome: '',
      login: '',
      senha: '',
      tipo: 'comum'
    })
    setError('')
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId)
    if (userToDelete?.tipo === 'master') {
      alert('O usuário master não pode ser removido')
      return
    }
    setUserToDelete(userId)
    setCurrentAction('delete')
    setIsMasterAuthDialogOpen(true)
  }

  const confirmMasterAction = () => {
    const masterUser = users.find(user => user.tipo === 'master')
    if (masterUser && 
        masterUser.login === masterCredentials.login && 
        masterUser.senha === masterCredentials.senha) {
      if (currentAction === 'delete' && userToDelete) {
        const updatedUsers = users.filter(user => user.id !== userToDelete)
        localStorage.setItem('sistema_usuarios', JSON.stringify(updatedUsers))
        setUsers(updatedUsers)
      } else if (currentAction === 'createAdmin') {
        createUser()
      }
      setIsMasterAuthDialogOpen(false)
      setMasterCredentials({ login: '', senha: '' })
      setCurrentAction(null)
      setUserToDelete(null)
    } else {
      setError('Credenciais master inválidas')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Acessos</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Criar Novo Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  value={newUser.login}
                  onChange={(e) => setNewUser(prev => ({ ...prev, login: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={newUser.senha}
                  onChange={(e) => setNewUser(prev => ({ ...prev, senha: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Acesso</Label>
                <Select
                  value={newUser.tipo}
                  onValueChange={(value: 'comum' | 'administrador') => 
                    setNewUser(prev => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comum">Comum</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full">
              Criar Novo Acesso
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Login</th>
                  <th className="px-6 py-3">Tipo de Acesso</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="px-6 py-4">{user.nome}</td>
                    <td className="px-6 py-4">
                      <span className={user.tipo === 'master' ? 'text-yellow-600 font-bold' : ''}>
                        {user.login}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1)}
                    </td>
                    <td className="px-6 py-4">
                      {user.tipo !== 'master' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Remover
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isMasterAuthDialogOpen} onOpenChange={setIsMasterAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticação Master Necessária</DialogTitle>
            <DialogDescription>
              Por favor, insira as credenciais do usuário master para confirmar a ação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="masterLogin">Login Master</Label>
              <Input
                id="masterLogin"
                value={masterCredentials.login}
                onChange={(e) => setMasterCredentials(prev => ({ ...prev, login: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="masterSenha">Senha Master</Label>
              <Input
                id="masterSenha"
                type="password"
                value={masterCredentials.senha}
                onChange={(e) => setMasterCredentials(prev => ({ ...prev, senha: e.target.value }))}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMasterAuthDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmMasterAction}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}