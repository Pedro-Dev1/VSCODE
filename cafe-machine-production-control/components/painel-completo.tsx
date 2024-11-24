'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Trash2, Edit } from 'lucide-react'
import { useMachineContext, Maquina } from '@/app/contexts/MachineContext'

export default function PainelCompleto() {
  const { maquinas, adicionarMaquina, atualizarEtapaMaquina, editarMaquina, excluirMaquina } = useMachineContext()
  const [currentTab, setCurrentTab] = useState('cadastro')
  const [alertMessage, setAlertMessage] = useState('')
  const [filtroGeral, setFiltroGeral] = useState('')

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

  const maquinasFiltradas = maquinas.filter(maquina => 
    Object.values(maquina).some(value => 
      value && typeof value === 'string' && value.toLowerCase().includes(filtroGeral.toLowerCase())
    )
  )

  const handleAdicionarMaquina = (novaMaquina: Omit<Maquina, 'id' | 'etapas'>) => {
    adicionarMaquina(novaMaquina)
    setAlertMessage('Máquina adicionada com sucesso.')
  }

  const handleAtualizarEtapa = (maquinaId: number, etapaIndex: number) => {
    atualizarEtapaMaquina(maquinaId, etapaIndex)
    setAlertMessage('Etapa atualizada com sucesso.')
  }

  const handleEditarMaquina = (id: number, novosDados: Partial<Maquina>) => {
    editarMaquina(id, novosDados)
    setAlertMessage('Máquina editada com sucesso.')
  }

  const handleExcluirMaquina = (id: number) => {
    excluirMaquina(id)
    setAlertMessage('Máquina excluída com sucesso.')
  }

  const renderCadastro = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Máquinas</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const novaMaquina = {
            modelo: formData.get('modelo') as string,
            fabricante: formData.get('fabricante') as string,
            serial: formData.get('serial') as string,
            patrimonio: formData.get('patrimonio') as string,
          }
          handleAdicionarMaquina(novaMaquina)
          ;(e.target as HTMLFormElement).reset()
        }}>
          <div className="space-y-4">
            <Input name="modelo" placeholder="Modelo" required />
            <Input name="fabricante" placeholder="Fabricante" required />
            <Input name="serial" placeholder="Número de Série" required />
            <Input name="patrimonio" placeholder="Número de Patrimônio" required />
            <Button type="submit">Adicionar Máquina</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderProducao = () => (
    <Card>
      <CardHeader>
        <CardTitle>Produção</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Filtrar máquinas..."
          value={filtroGeral}
          onChange={(e) => setFiltroGeral(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maquinasFiltradas.map((maquina) => (
              <TableRow key={maquina.id}>
                <TableCell>{maquina.serial}</TableCell>
                <TableCell>{maquina.modelo}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {maquina.etapas.every(e => e.concluida) ? 'Concluída' : 'Em Andamento'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Ver Etapas</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Etapas da Máquina {maquina.serial}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {maquina.etapas.map((etapa, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>{etapa.nome}</span>
                            {etapa.concluida ? (
                              <CheckCircle2 className="text-green-500" />
                            ) : (
                              <Button onClick={() => handleAtualizarEtapa(maquina.id, index)}>
                                Concluir
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderGerenciamento = () => (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Máquinas</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Filtrar máquinas..."
          value={filtroGeral}
          onChange={(e) => setFiltroGeral(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maquinasFiltradas.map((maquina) => (
              <TableRow key={maquina.id}>
                <TableCell>{maquina.serial}</TableCell>
                <TableCell>{maquina.modelo}</TableCell>
                <TableCell>{maquina.fabricante}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Máquina</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.target as HTMLFormElement)
                          const dadosAtualizados = {
                            modelo: formData.get('modelo') as string,
                            fabricante: formData.get('fabricante') as string,
                            serial: formData.get('serial') as string,
                            patrimonio: formData.get('patrimonio') as string,
                          }
                          handleEditarMaquina(maquina.id, dadosAtualizados)
                        }}>
                          <div className="space-y-4">
                            <Input name="modelo" defaultValue={maquina.modelo} required />
                            <Input name="fabricante" defaultValue={maquina.fabricante} required />
                            <Input name="serial" defaultValue={maquina.serial} required />
                            <Input name="patrimonio" defaultValue={maquina.patrimonio} required />
                            <Button type="submit">Salvar</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleExcluirMaquina(maquina.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          <TabsTrigger value="producao">Produção</TabsTrigger>
          <TabsTrigger value="gerenciamento">Gerenciamento</TabsTrigger>
        </TabsList>
        <TabsContent value="cadastro">{renderCadastro()}</TabsContent>
        <TabsContent value="producao">{renderProducao()}</TabsContent>
        <TabsContent value="gerenciamento">{renderGerenciamento()}</TabsContent>
      </Tabs>
      {alertMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          {alertMessage}
        </div>
      )}
    </div>
  )
}