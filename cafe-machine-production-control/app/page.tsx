'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Navigation from '@/components/Navigation'

interface Maquina {
  id: string
  nomeCliente: string
  modelo: string
  fabricante: string
  numeroSerie: string
  numeroPatrimonio: string
  numeroBox: string
  dataRegistro: string
}

export default function Home() {
  const [novaMaquina, setNovaMaquina] = useState<Partial<Maquina>>({})
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!novaMaquina.nomeCliente || !novaMaquina.modelo || !novaMaquina.numeroSerie) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    const maquina: Maquina = {
      ...novaMaquina as Maquina,
      id: crypto.randomUUID(),
      dataRegistro: new Date().toISOString()
    }

    const maquinasAnteriores = JSON.parse(localStorage.getItem('maquinas') || '[]')
    const maquinasAtualizadas = [...maquinasAnteriores, maquina]
    localStorage.setItem('maquinas', JSON.stringify(maquinasAtualizadas))

    toast({
      title: "Sucesso",
      description: "Máquina registrada com sucesso!",
    })

    setNovaMaquina({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nova Máquina</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
                  <Input
                    id="nomeCliente"
                    value={novaMaquina.nomeCliente || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, nomeCliente: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    value={novaMaquina.modelo || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, modelo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fabricante">Fabricante</Label>
                  <Input
                    id="fabricante"
                    value={novaMaquina.fabricante || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, fabricante: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroSerie">Número de Série *</Label>
                  <Input
                    id="numeroSerie"
                    value={novaMaquina.numeroSerie || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, numeroSerie: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroPatrimonio">Número de Patrimônio</Label>
                  <Input
                    id="numeroPatrimonio"
                    value={novaMaquina.numeroPatrimonio || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, numeroPatrimonio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroBox">Número do Box</Label>
                  <Input
                    id="numeroBox"
                    value={novaMaquina.numeroBox || ''}
                    onChange={(e) => setNovaMaquina({ ...novaMaquina, numeroBox: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Registrar Máquina
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}