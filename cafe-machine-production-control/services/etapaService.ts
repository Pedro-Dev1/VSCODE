import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const etapaService = {
  async obterTodasEtapas() {
    return prisma.etapa.findMany()
  },

  async obterEtapaPorId(id: number) {
    return prisma.etapa.findUnique({
      where: { id },
    })
  },

  async criarEtapa(dados: Prisma.EtapaCreateInput) {
    return prisma.etapa.create({
      data: dados,
    })
  },

  async atualizarEtapa(id: number, dados: Prisma.EtapaUpdateInput) {
    return prisma.etapa.update({
      where: { id },
      data: dados,
    })
  },

  async excluirEtapa(id: number) {
    return prisma.etapa.delete({
      where: { id },
    })
  },

  async obterEtapasPorMaquinaId(maquinaId: number) {
    return prisma.etapa.findMany({
      where: { maquinaId },
      orderBy: { ordem: 'asc' },
    })
  },
}

export default etapaService