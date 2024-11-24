import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, AlertCircle } from 'lucide-react'

type RelatorioGeneratorProps = {
  onGenerateReport: (type: string) => void
}

export function RelatorioGenerator({ onGenerateReport }: RelatorioGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState('')
  const [message, setMessage] = useState('')

  const handleGenerateReport = () => {
    if (selectedReport) {
      onGenerateReport(selectedReport)
      setMessage(`Relatório ${selectedReport} gerado com sucesso!`)
    } else {
      setMessage('Por favor, selecione um tipo de relatório.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geração de Relatórios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.includes('sucesso') ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="flex items-center space-x-2">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="producao">Relatório de Produção</SelectItem>
              <SelectItem value="tecnicos">Relatório de Técnicos</SelectItem>
              <SelectItem value="maquinas">Relatório de Máquinas</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport}>
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}