'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Download, Trash2, BarChart, Users, Clock, CheckSquare, AlertTriangle } from 'lucide-react'

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

interface PainelStats {
  maquinasConcluidas: number
  maquinasHoje: number
  maquinasSemana: number
  tempoMedioGasto: string
  checkinMaisDemorado: string
}

interface User {
  id: string
  nome: string
  login: string
  senha: string
  tipo: 'master' | 'administrador' | 'comum'
}

export default function PainelPage() {
  const [completedMachines, setCompletedMachines] = useState<Machine[]>([])
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [currentMachineId, setCurrentMachineId] = useState<string | null>(null)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [authCredentials, setAuthCredentials] = useState({ login: '', senha: '' })
  const [authError, setAuthError] = useState('')
  const [stats, setStats] = useState<PainelStats>({
    maquinasConcluidas: 0,
    maquinasHoje: 0,
    maquinasSemana: 0,
    tempoMedioGasto: "0h 0min",
    checkinMaisDemorado: "N/A"
  })

  useEffect(() => {
    loadCompletedMachines()
  }, [])

  const loadCompletedMachines = () => {
    try {
      const machines: Machine[] = JSON.parse(localStorage.getItem('completed_machines') || '[]')
      setCompletedMachines(machines)
      calculateStats(machines)
    } catch (error) {
      console.error('Erro ao carregar máquinas:', error)
    }
  }

  const calculateStats = (machines: Machine[]) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime()

    const maquinasConcluidas = machines.length
    const maquinasHoje = machines.filter(m => m.completionTime && m.completionTime >= startOfDay).length
    const maquinasSemana = machines.filter(m => m.completionTime && m.completionTime >= startOfWeek).length

    const temposTotais = machines
      .filter(m => m.completionTime)
      .map(m => m.completionTime! - m.registrationTime)
    
    const mediaTempos = temposTotais.length > 0
      ? Math.floor(temposTotais.reduce((a, b) => a + b, 0) / temposTotais.length)
      : 0

    const hours = Math.floor(mediaTempos / 3600000)
    const minutes = Math.floor((mediaTempos % 3600000) / 60000)
    const tempoMedioGasto = `${hours}h ${minutes}min`

    // Calcula o checkin mais demorado
    const checkinTimes: { [key: string]: number[] } = {}
    machines.forEach(machine => {
      machine.checklist.forEach(item => {
        if (item.completionTime) {
          const time = item.completionTime - machine.registrationTime
          if (!checkinTimes[item.label]) {
            checkinTimes[item.label] = []
          }
          checkinTimes[item.label].push(time)
        }
      })
    })

    let checkinMaisDemorado = "N/A"
    let maxAverageTime = 0

    Object.entries(checkinTimes).forEach(([label, times]) => {
      const average = times.reduce((a, b) => a + b, 0) / times.length
      if (average > maxAverageTime) {
        maxAverageTime = average
        checkinMaisDemorado = label
      }
    })

    setStats({
      maquinasConcluidas,
      maquinasHoje,
      maquinasSemana,
      tempoMedioGasto,
      checkinMaisDemorado
    })
  }

  const handleDeleteMachine = (machineId: string) => {
    setCurrentMachineId(machineId)
    setIsAuthDialogOpen(true)
  }

  const confirmAuth = () => {
    const users: User[] = JSON.parse(localStorage.getItem('sistema_usuarios') || '[]')
    const user = users.find(u => u.login === authCredentials.login && u.senha === authCredentials.senha)
    
    if (user && (user.tipo === 'administrador' || user.tipo === 'master')) {
      setIsAuthDialogOpen(false)
      setIsDeleteConfirmOpen(true)
      setAuthCredentials({ login: '', senha: '' })
      setAuthError('')
    } else {
      setAuthError('Credenciais inválidas ou usuário sem permissão')
    }
  }

  const confirmDelete = () => {
    if (currentMachineId) {
      const updatedMachines = completedMachines.filter(m => m.id !== currentMachineId)
      setCompletedMachines(updatedMachines)
      localStorage.setItem('completed_machines', JSON.stringify(updatedMachines))
      setIsDeleteConfirmOpen(false)
      setCurrentMachineId(null)
      calculateStats(updatedMachines)
    }
  }

  const calculateElapsedTime = (startTime: number, endTime: number | null) => {
    const elapsed = (endTime || Date.now()) - startTime
    const hours = Math.floor(elapsed / 3600000)
    const minutes = Math.floor((elapsed % 3600000) / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const exportToExcel = () => {
    if (completedMachines.length === 0) {
      alert('Não há máquinas concluídas para exportar.')
      return
    }

    const headers = [
      'Cliente',
      'Modelo',
      'Fabricante',
      'Número de Série',
      'Número de Patrimônio',
      'Número do Box',
    ]

    const checklistLabels = [
      'Atualização',
      'Programação da Máquina',
      'DLM',
      'Adesivagem',
      'Teste de Telemetria',
      'Acessórios',
      'Check List Final',
      'Embalagem',
      'Expedição'
    ]

    const allHeaders = [
      ...headers,
      ...checklistLabels.flatMap(label => [`Tempo ${label}`, `Login ${label}`])
    ]

    const rows = completedMachines.map(machine => {
      const baseData = [
        machine.clientName,
        machine.model,
        machine.manufacturer,
        machine.serialNumber,
        machine.assetNumber,
        machine.boxNumber,
      ]

      const checklistData = machine.checklist.flatMap(item => [
        item.completionTime 
          ? calculateElapsedTime(machine.registrationTime, item.completionTime)
          : 'Não realizado',
        item.completedBy || 'N/A'
      ])

      return [...baseData, ...checklistData]
    })

    const csvContent = 
      '\uFEFF' +
      allHeaders.join(';') +
      '\n' +
      rows.map(row => row.join(';')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio_maquinas_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Painel de Controle</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Concluídas</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maquinasConcluidas}</div>
            <p className="text-xs text-muted-foreground">máquinas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maquinasHoje}</div>
            <p className="text-xs text-muted-foreground">máquinas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas na Semana</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maquinasSemana}</div>
            <p className="text-xs text-muted-foreground">máquinas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tempoMedioGasto}</div>
            <p className="text-xs text-muted-foreground">por máquina</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checkin Mais Demorado</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkinMaisDemorado}</div>
            <p className="text-xs text-muted-foreground">em média</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticação Necessária</DialogTitle>
            <DialogDescription>
              Por favor, insira suas credenciais de administrador ou master para excluir a máquina.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="authLogin">Login</Label>
              <Input
                id="authLogin"
                value={authCredentials.login}
                onChange={(e) => setAuthCredentials(prev => ({ ...prev, login: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authSenha">Senha</Label>
              <Input
                id="authSenha"
                type="password"
                value={authCredentials.senha}
                onChange={(e) => setAuthCredentials(prev => ({ ...prev, senha: e.target.value }))}
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuthDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAuth}>
              Confirmar
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button 
              variant={!showDetailedReport ? "default" : "outline"}
              onClick={() => setShowDetailedReport(false)}
            >
              Lista de Máquinas
            </Button>
            <Button 
              variant={showDetailedReport ? "default" : "outline"}
              onClick={() => setShowDetailedReport(true)}
            >
              Relatório Detalhado
            </Button>
          </div>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {!showDetailedReport ? (
          <Card>
            <CardHeader>
              <CardTitle>Máquinas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Número de Série</TableHead>
                    <TableHead>Tempo Total</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhuma máquina concluída
                      </TableCell>
                    </TableRow>
                  ) : (
                    completedMachines.map(machine => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.clientName}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>{machine.serialNumber}</TableCell>
                        <TableCell>
                          {calculateElapsedTime(machine.registrationTime, machine.completionTime)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMachine(machine.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              {completedMachines.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Nenhuma máquina concluída para exibir no relatório.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Número de Série</TableHead>
                      {completedMachines[0]?.checklist.map((item, index) => (
                        <TableHead key={index}>
                          Checkin {item.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedMachines.map(machine => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.clientName}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>{machine.serialNumber}</TableCell>
                        {machine.checklist.map((item, index) => (
                          <TableCell key={index}>
                            {item.completionTime ? (
                              <>
                                <div>{calculateElapsedTime(machine.registrationTime, item.completionTime)}</div>
                                <div className="text-xs text-muted-foreground">Login: {item.completedBy || 'N/A'}</div>
                              </>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}