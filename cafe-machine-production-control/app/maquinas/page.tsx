'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  completionTime: number | null
}

const initialChecklist: ChecklistItem[] = [
  { id: 'atualizacao', label: 'Atualização', completed: false, completionTime: null },
  { id: 'programacao', label: 'Programação da Máquina', completed: false, completionTime: null },
  { id: 'dlm', label: 'DLM', completed: false, completionTime: null },
  { id: 'adesivagem', label: 'Adesivagem', completed: false, completionTime: null },
  { id: 'telemetria', label: 'Teste de Telemetria', completed: false, completionTime: null },
  { id: 'acessorios', label: 'Acessórios', completed: false, completionTime: null },
  { id: 'checklistFinal', label: 'Check List Final', completed: false, completionTime: null },
  { id: 'embalagem', label: 'Embalagem', completed: false, completionTime: null },
  { id: 'expedicao', label: 'Expedição', completed: false, completionTime: null },
]

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
}

export default function MaquinaPage() {
  const router = useRouter()
  const [machine, setMachine] = useState<Machine>({
    id: '',
    clientName: '',
    model: '',
    manufacturer: '',
    serialNumber: '',
    assetNumber: '',
    boxNumber: '',
    registrationTime: 0,
    checklist: initialChecklist,
    completed: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMachine(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newMachine = {
      ...machine,
      id: Date.now().toString(),
      registrationTime: Date.now(),
      checklist: JSON.parse(JSON.stringify(initialChecklist)), // Deep clone to avoid reference issues
      completed: false
    }
    
    // Get existing production machines
    const existingMachines = JSON.parse(localStorage.getItem('production_machines') || '[]')
    
    // Add new machine to the list
    const updatedMachines = [...existingMachines, newMachine]
    
    // Save updated list back to localStorage
    localStorage.setItem('production_machines', JSON.stringify(updatedMachines))
    
    // Redirect to production page
    router.push('/producao')
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registrar Nova Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={machine.clientName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  name="model"
                  value={machine.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={machine.manufacturer}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de Série *</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={machine.serialNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetNumber">Número do Patrimônio</Label>
                <Input
                  id="assetNumber"
                  name="assetNumber"
                  value={machine.assetNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boxNumber">Número do Box</Label>
                <Input
                  id="boxNumber"
                  name="boxNumber"
                  value={machine.boxNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800">
              Registrar Máquina
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}