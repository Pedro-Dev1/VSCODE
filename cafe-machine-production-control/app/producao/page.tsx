'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Trash2, CheckSquare, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  completionTime: number | null
  completedBy: string | null
}

interface Machine {
  id: string
  clientName: string
  model: string
  manufacturer: string
  serialNumber: string
  assetNumber: string
  boxNumber: string
  registrationTime: number
  checklist: ChecklistItem[]
  completed: boolean
  completionTime?: number
}

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'comum' | 'administrador' | 'master'
}

export default function ProducaoPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [currentMachineId, setCurrentMachineId] = useState<string | null>(null)
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ login: '', senha: '' })
  const [loginError, setLoginError] = useState('')
  const [isAdminAction, setIsAdminAction] = useState(false)
  const [masterCredentials, setMasterCredentials] = useState({ login: '', senha: '' })
  const [isMasterAuthDialogOpen, setIsMasterAuthDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadMachines()
    const interval = setInterval(loadMachines, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadMachines = () => {
    try {
      const productionMachines: Machine[] = JSON.parse(localStorage.getItem('production_machines') || '[]')
      setMachines(productionMachines)
    } catch (error) {
      console.error('Error loading machines:', error)
    }
  }

  const handleChecklistItemToggle = (machineId: string, itemId: string) => {
    setCurrentMachineId(machineId)
    setCurrentItemId(itemId)
    setIsAdminAction(false)
    setIsLoginOpen(true)
  }

  const handleDeleteMachine = (machineId: string) => {
    setCurrentMachineId(machineId)
    setIsMasterAuthDialogOpen(true)
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const users: User[] = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]')
    const user = users.find(u => u.login === loginForm.login && u.senha === loginForm.senha)
    
    if (user) {
      setIsLoginOpen(false)
      setLoginError('')
      
      if (isAdminAction) {
        if (user.tipo === 'administrador') {
          setIsDeleteConfirmOpen(true)
        } else {
          alert('Apenas administradores podem excluir máquinas.')
        }
      } else if (currentMachineId && currentItemId) {
        const updatedMachines = machines.map(machine => {
          if (machine.id === currentMachineId) {
            const updatedChecklist = machine.checklist.map(item => 
              item.id === currentItemId ? { ...item, completed: true, completionTime: Date.now(), completedBy: loginForm.login } : item
            )
            return {
              ...machine,
              checklist: updatedChecklist,
            }
          }
          return machine
        })

        setMachines(updatedMachines)
        localStorage.setItem('production_machines', JSON.stringify(updatedMachines))
      }
      
      setLoginForm({ login: '', senha: '' })
    } else {
      setLoginError('Credenciais inválidas')
    }
  }

  const handleCompleteMachine = (machineId: string) => {
    const updatedMachines = machines.map(machine => {
      if (machine.id === machineId) {
        return { ...machine, completed: true, completionTime: Date.now() }
      }
      return machine
    })

    const completedMachine = updatedMachines.find(m => m.id === machineId)
    if (completedMachine) {
      const completedMachines = JSON.parse(localStorage.getItem('completed_machines') || '[]')
      localStorage.setItem('completed_machines', JSON.stringify([...completedMachines, completedMachine]))
    }

    const productionMachines = updatedMachines.filter(m => !m.completed)
    localStorage.setItem('production_machines', JSON.stringify(productionMachines))

    setMachines(productionMachines)
    router.push('/painel')
  }

  const confirmDelete = () => {
    const users: User[] = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]')
    const masterUser = users.find(user => user.tipo === 'master')
    
    if (masterUser && 
        masterUser.login === masterCredentials.login && 
        masterUser.senha === masterCredentials.senha) {
      if (!currentMachineId) return

      const updatedMachines = machines.filter(m => m.id !== currentMachineId)
      setMachines(updatedMachines)
      localStorage.setItem('production_machines', JSON.stringify(updatedMachines))
      setIsMasterAuthDialogOpen(false)
      setCurrentMachineId(null)
      setMasterCredentials({ login: '', senha: '' })
    } else {
      setError('Credenciais master inválidas')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Produção</h1>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticação Necessária</DialogTitle>
            <DialogDescription>
              Por favor, faça login para {isAdminAction ? 'excluir a máquina' : 'registrar esta etapa'}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                value={loginForm.login}
                onChange={(e) => setLoginForm(prev => ({ ...prev, login: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={loginForm.senha}
                onChange={(e) => setLoginForm(prev => ({ ...prev, senha: e.target.value }))}
                required
              />
            </div>
            {loginError && <p className="text-red-500">{loginError}</p>}
            <Button type="submit">Confirmar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isMasterAuthDialogOpen} onOpenChange={setIsMasterAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticação Master Necessária</DialogTitle>
            <DialogDescription>
              Por favor, insira as credenciais do usuário master para confirmar a exclusão da máquina.
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
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta máquina? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 mb-6">
        <h2 className="text-2xl font-semibold">Máquinas em Produção</h2>
        {machines.length === 0 ? (
          <Card>
            <CardContent className="py-4">
              <p className="text-center text-muted-foreground">Nenhuma máquina em produção</p>
            </CardContent>
          </Card>
        ) : (
          machines.map(machine => (
            <Card key={machine.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{machine.clientName} - {machine.model}</span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteMachine(machine.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir máquina</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Fabricante:</strong> {machine.manufacturer}</p>
                    <p><strong>Número de Série:</strong> {machine.serialNumber}</p>
                    <p><strong>Número do Patrimônio:</strong> {machine.assetNumber}</p>
                  </div>
                  <div>
                    <p><strong>Número do Box:</strong> {machine.boxNumber}</p>
                    <p><strong>Data de Registro:</strong> {new Date(machine.registrationTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {machine.checklist?.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center text-center p-2"
                      onClick={() => handleChecklistItemToggle(machine.id, item.id)}
                      disabled={item.completed}
                    >
                      {item.completed ? (
                        <CheckSquare className="h-6 w-6 text-green-500" />
                      ) : (
                        <Square className="h-6 w-6" />
                      )}
                      <span className="mt-2 text-xs">{item.label}</span>
                    </Button>
                  ))}
                </div>

                {machine.checklist?.every(item => item.completed) && (
                  <Button
                    onClick={() => handleCompleteMachine(machine.id)}
                    className="w-full"
                  >
                    Concluir Máquina
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}