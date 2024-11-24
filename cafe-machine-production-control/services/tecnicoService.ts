import prisma from '@/lib/prisma'
import { Tecnico, WithoutId } from '@/types'
import bcrypt from 'bcrypt'

export const tecnicoService = {
  async criarTecnico(data: WithoutId<Tecnico>): Promise<Tecnico> {
    const hashedSenha = await bcrypt.hash(data.senha, 10)
    return prisma.tecnico.create({
      data: {
        ...data,
        senha: hashedSenha,
      },
    })
  },

  async obterTecnico(id: string): Promise<Tecnico | null> {
    return prisma.tecnico.findUnique({ where: { id } })
  },

  async listarTecnicos(): Promise<Tecnico[]> {
    return prisma.tecnico.findMany()
  },

  async atualizarTecnico(id: string, data: Partial<WithoutId<Tecnico>>): Promise<Tecnico> {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10)
    }
    return prisma.tecnico.update({
      where: { id },
      data,
    })
  },

  async deletarTecnico(id: string): Promise<void> {
    await prisma.tecnico.delete({ where: { id } })
  },

  async autenticarTecnico(login: string, senha: string): Promise<Tecnico | null> {
    const tecnico = await prisma.tecnico.findUnique({ where: { login } })
    if (!tecnico) return null
    const senhaCorreta = await bcrypt.compare(senha, tecnico.senha)
    return senhaCorreta ? tecnico : null
  },

  async atribuirMaquina(tecnicoId: string, maquinaId: string): Promise<void> {
    await prisma.ordemProducao.create({
      data: {
        tecnicoId,
        maquinaId,
        dataInicio: new Date(),
      },
    })
  },
}