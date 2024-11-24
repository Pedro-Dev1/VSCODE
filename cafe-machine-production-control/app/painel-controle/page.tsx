import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Coffee, Package, Truck } from "lucide-react"

export default function Component() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Controle de Produção de Máquinas de Café</h1>
      <nav className="flex space-x-4">
        <a href="#" className="text-primary">Abastecimento</a>
        <a href="#" className="text-primary">Produção</a>
        <a href="#" className="text-primary">Gerenciamento</a>
      </nav>
      <Card>
        <CardHeader>
          <CardTitle>Painel de Controle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">Total de Máquinas</p>
              <p>150</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">Em Produção</p>
              <p>45</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">Concluídas</p>
              <p>105</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">Taxa de Conclusão</p>
              <p>70%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Últimas Máquinas em Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Café Expresso</TableCell>
                <TableCell>Empresa A</TableCell>
                <TableCell>Em Andamento</TableCell>
                <TableCell>75%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Café Gourmet</TableCell>
                <TableCell>Empresa B</TableCell>
                <TableCell>Concluída</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Multibebidas</TableCell>
                <TableCell>Empresa C</TableCell>
                <TableCell>Em Andamento</TableCell>
                <TableCell>30%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Café Expresso</TableCell>
                <TableCell>Empresa D</TableCell>
                <TableCell>Em Andamento</TableCell>
                <TableCell>50%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Café Gourmet</TableCell>
                <TableCell>Empresa E</TableCell>
                <TableCell>Concluída</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produção Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Número de máquinas produzidas por mês</p>
          <p className="text-red-600">Há 3 máquinas com atraso na produção. Verifique a seção de produção.</p>
        </CardContent>
      </Card>
      <footer className="text-center text-sm text-muted-foreground">
        © 2024 Connet Vending. Todos os direitos reservados.
      </footer>
    </div>
  )
}