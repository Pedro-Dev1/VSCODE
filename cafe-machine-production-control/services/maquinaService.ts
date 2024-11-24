import prisma from '@/lib/prisma'
import { Maquina, CreateMaquina, UpdateMaquina, FiltroMaquinas } from '@/types'

export const maquinaService = {
  async criarMaquina(data: CreateMaquina): Promise<Maquina> {
    return prisma.maquina.create({ data })
  },

  async obterMaquina(id: string): Promise<Maquina | null> {
    return prisma.maquina.findUnique({ where: { id } })
  },

  async listarMaquinas(filtro?: FiltroMaquinas): Promise<Maquina[]> {
    return prisma.maquina.findMany({
      where: {
        status: filtro?.status,
        clienteId: filtro?.cliente,
        dataInicio: filtro?.dataInicio ? { gte: filtro.dataInicio } : undefined,
        dataConclusao: filtro?.dataConclusao ? { lte: filtro.dataConclusao } : undefined,
      },
      orderBy: { dataInicio: 'desc' },
    })
  },

  async atualizarMaquina(id: string, data: UpdateMaquina): Promise<Maquina> {
    return prisma.maquina.update({
      where: { id },
      data,
    })
  },

  async deletarMaquina(id: string): Promise<void> {
    await prisma.maquina.delete({ where: { id } })
  },

  async atualizarProgresso(id: string, progresso: number): Promise<Maquina> {
    return prisma.maquina.update({
      where: { id },
      data: { progresso },
    })
  },

  async obterEstatisticasProducao(): Promise<{ total: number, emProducao: number, concluidas: number }> {
    const [total, emProducao, concluidas] = await Promise.all([
      prisma.maquina.count(),
      prisma.maquina.count({ where: { status: 'em_producao' } }),
      prisma.maquina.count({ where: { status: 'concluida' } }),
    ])
    return { total, emProducao, concluidas }
  },
}