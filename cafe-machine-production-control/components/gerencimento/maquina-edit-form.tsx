import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

type Maquina = {
  id: number
  modelo: string
  fabricante: string
  serial: string
  patrimonio: string
}

type MaquinaEditFormProps = {
  maquina: Maquina
  onSave: (maquina: Maquina) => void
}

export function MaquinaEditForm({ maquina, onSave }: MaquinaEditFormProps) {
  const [editedMaquina, setEditedMaquina] = useState(maquina)
  const [error, setError] = useState('')

  useEffect(() => {
    setEditedMaquina(maquina)
  }, [maquina])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedMaquina(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedMaquina.modelo && editedMaquina.fabricante && editedMaquina.serial && editedMaquina.patrimonio) {
      onSave(editedMaquina)
      setError('')
    } else {
      setError('Por favor, preencha todos os campos.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Máquina</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input
              id="modelo"
              name="modelo"
              value={editedMaquina.modelo}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fabricante">Fabricante</Label>
            <Input
              id="fabricante"
              name="fabricante"
              value={editedMaquina.fabricante}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serial">Número de Série</Label>
            <Input
              id="serial"
              name="serial"
              value={editedMaquina.serial}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patrimonio">Número de Patrimônio</Label>
            <Input
              id="patrimonio"
              name="patrimonio"
              value={editedMaquina.patrimonio}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  )
}