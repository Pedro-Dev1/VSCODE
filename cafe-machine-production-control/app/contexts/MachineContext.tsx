'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Etapa {
  nome: string
  concluida: boolean
}

export interface Maquina {
  id: number
  modelo: string
  fabricante: string
  serial: string
  patrimonio: string
  etapas: Etapa[]
}

interface MachineContextType {
  maquinas: Maquina[]
  adicionarMaquina: (novaMaquina: Omit<Maquina, 'id' | 'etapas'>) => void
  atualizarEtapaMaquina: (maquinaId: number, etapaIndex: number) => void
  editarMaquina: (id: number, novosDados: Partial<Maquina>) => void
  excluirMaquina: (id: number) => void
}

const MachineContext = createContext<MachineContextType | undefined>(undefined)

export function MachineProvider({ children }: { children: ReactNode }) {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])

  const etapasIniciais = [
    "Cadastro Inicial",
    "Atualização",
    "Programação da Máquina",
    "DLM",
    "Adesivagem",
    "Teste de Telemetria",
    "Acessórios",
    "Check List Final",
    "Embalagem",
    "Expedição"
  ]

  const adicionarMaquina = (novaMaquina: Omit<Maquina, 'id' | 'etapas'>) => {
    const maquinaCompleta: Maquina = {
      ...novaMaquina,
      id: Date.now(),
      etapas: etapasIniciais.map(nome => ({ nome, concluida: false }))
    }
    setMaquinas(prev => [...prev, maquinaCompleta])
  }

  const atualizarEtapaMaquina = (maquinaId: number, etapaIndex: number) => {
    setMaquinas(prevMaquinas => 
      prevMaquinas.map(maquina => 
        maquina.id === maquinaId 
          ? {
              ...maquina,
              etapas: maquina.etapas.map((etapa, index) => 
                index === etapaIndex ? { ...etapa, concluida: true } : etapa
              )
            }
          : maquina
      )
    )
  }

  const editarMaquina = (id: number, novosDados: Partial<Maquina>) => {
    setMaquinas(prevMaquinas => 
      prevMaquinas.map(m => m.id === id ? { ...m, ...novosDados } : m)
    )
  }

  const excluirMaquina = (id: number) => {
    setMaquinas(prevMaquinas => prevMaquinas.filter(m => m.id !== id))
  }

  return (
    <MachineContext.Provider 
      value={{ 
        maquinas, 
        adicionarMaquina, 
        atualizarEtapaMaquina, 
        editarMaquina, 
        excluirMaquina 
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}

export function useMachineContext() {
  const context = useContext(MachineContext)
  if (!context) {
    throw new Error('useMachineContext deve ser usado dentro de um MachineProvider')
  }
  return context
}