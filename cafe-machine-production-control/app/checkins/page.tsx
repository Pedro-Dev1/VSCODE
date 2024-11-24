'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'comum' | 'administrador'
}

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export default function CheckinsPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'programacao', label: 'Programação da Máquina', checked: false },
    { id: 'dlm', label: 'DLM', checked: false },
    { id: 'adesivagem', label: 'Adesivagem', checked: false },
    { id: 'telemetria', label: 'Teste de Telemetria', checked: false },
    { id: 'acessorios', label: 'Acessórios', checked: false },
    { id: 'checklistFinal', label: 'Check List Final', checked: false },
    { id: 'embalagem', label: 'Embalagem', checked: false },
    { id: 'expedicao', label: 'Expedição', checked: false },
  ])
  const [maquina, setMaquina] = useState('')

  const handleAuthentication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const login = formData.get('usuario') as string
    const senha = formData.get('senha') as string

    console.log('Tentativa de login:', { login, senha }) // Log de debug

    try {
      const usersString = localStorage.getItem('sistema_usuarios')
      console.log('Usuários armazenados:', usersString) // Log de debug
      
      if (!usersString) {
        setError('Nenhum usuário cadastrado. Por favor, cadastre usuários primeiro.')
        return
      }

      const users: User[] = JSON.parse(usersString)
      console.log('Usuários parseados:', users) // Log de debug
      
      const user = users.find(u => u.login === login && u.senha === senha)
      console.log('Usuário encontrado:', user) // Log de debug

      if (user) {
        setIsAuthenticated(true)
        setCurrentUser(user)
        setIsOpen(false)
        setError('')
        console.log('Login bem-sucedido para:', user.nome) // Log de debug
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.')
      }
    } catch (err) {
      console.error('Erro de autenticação:', err)
      setError('Erro ao verificar credenciais. Por favor, tente novamente.')
    }
  }

  const handleChecklistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!maquina) {
      toast({
        title: "Erro",
        description: "Por favor, insira o número da máquina.",
        variant: "destructive",
      })
      return
    }

    const allChecked = checklist.every(item => item.checked)
    if (!allChecked) {
      toast({
        title: "Erro",
        description: "Por favor, complete todos os itens do checklist.",
        variant: "destructive",
      })
      return
    }

    // Aqui você pode adicionar a lógica para salvar o checklist
    const checklistData = {
      maquina,
      items: checklist,
      usuario: currentUser?.nome,
      dataHora: new Date().toISOString(),
    }

    // Salvando no localStorage para exemplo
    const savedChecklists = localStorage.getItem('checklists')
    const checklists = savedChecklists ? JSON.parse(savedChecklists) : []
    checklists.push(checklistData)
    localStorage.setItem('checklists', JSON.stringify(checklists))

    toast({
      title: "Sucesso",
      description: "Checklist enviado com sucesso!",
    })

    // Reset form
    setChecklist(prev => prev.map(item => ({ ...item, checked: false })))
    setMaquina('')
  }

  useEffect(() => {
    const usersString = localStorage.getItem('sistema_usuarios')
    console.log('Usuários armazenados (na montagem):', usersString)
    if (usersString) {
      try {
        const users = JSON.parse(usersString)
        console.log('Usuários parseados (na montagem):', users)
      } catch (error) {
        console.error('Erro ao parsear usuários:', error)
      }
    } else {
      console.log('Nenhum usuário encontrado no localStorage')
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insira suas credenciais</DialogTitle>
            <DialogDescription>
              Por favor, insira seu nome de usuário e senha para realizar o check-in.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuthentication} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <Input id="usuario" name="usuario" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" name="senha" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Confirmar
            </Button>
            {error && (
              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {isAuthenticated && (
        <Card className="p-6">
          <form onSubmit={handleChecklistSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maquina">Número da Máquina</Label>
              <Input
                id="maquina"
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => {
                      setChecklist(prev =>
                        prev.map(i =>
                          i.id === item.id ? { ...i, checked: checked as boolean } : i
                        )
                      )
                    }}
                  />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Enviar Checklist
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}