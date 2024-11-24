'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Maquina {
  nomeCliente: string;
  modelo: string;
  fabricante: string;
  numeroSerie: string;
  numeroPatrimonio: string;
  numeroBox: string;
}

const camposMaquina: (keyof Maquina)[] = ['nomeCliente', 'modelo', 'fabricante', 'numeroSerie', 'numeroPatrimonio', 'numeroBox'];

const maquinaInicial: Maquina = {
  nomeCliente: '',
  modelo: '',
  fabricante: '',
  numeroSerie: '',
  numeroPatrimonio: '',
  numeroBox: ''
};

export default function AbastecimentoPage() {
  const [novaMaquina, setNovaMaquina] = useState<Maquina>(maquinaInicial);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovaMaquina(prev => ({ ...prev, [name]: value }));
  };

  const adicionarMaquina = () => {
    if (camposMaquina.every(campo => novaMaquina[campo] !== '')) {
      setMaquinas(prev => [...prev, novaMaquina]);
      setNovaMaquina(maquinaInicial);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {camposMaquina.map((campo) => (
              <div key={campo} className="grid gap-2">
                <Label htmlFor={campo}>
                  {campo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <Input
                  id={campo}
                  name={campo}
                  value={novaMaquina[campo]}
                  onChange={handleInputChange}
                  placeholder={`Digite o ${campo.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                />
              </div>
            ))}
            <Button onClick={adicionarMaquina}>Adicionar Máquina</Button>
          </div>

          {maquinas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Máquinas Cadastradas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    {camposMaquina.map(campo => (
                      <TableHead key={campo}>
                        {campo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maquinas.map((maquina, index) => (
                    <TableRow key={index}>
                      {camposMaquina.map(campo => (
                        <TableCell key={campo}>{maquina[campo]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}