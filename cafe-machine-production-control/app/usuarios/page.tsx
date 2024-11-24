'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import Navigation from '@/components/Navigation'
import { useAuth } from '@/lib/auth'


interface Usuario {
  id: string
  nome: string
  login: string
  senha: string
  cargo: 'admin' | 'tecnico'
  dataCadastro: string
}

export default function GerenciamentoUsuarios() {
  const { user } = useAuth()

  if (user?.cargo !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [novoUsuario, setNovoUsuario] = useState<Partial<Usuario>>({
    cargo: 'tecnico'
  })
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = () => {
    const usuariosArmazenados = localStorage.getItem('usuarios')
    if (usuariosArmazenados) {
      setUsuarios(JSON.parse(usuariosArmazenados))
    }
  }

  const salvarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.login || !novoUsuario.senha) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      })
      return
    }

    const usuarioExistente = usuarios.find(u => u.login === novoUsuario.login)
    if (usuarioExistente && !usuarioEmEdicao) {
      toast({
        title: "Erro",
        description: "Já existe um usuário com este login.",
        variant: "destructive"
      })
      return
    }

    let usuariosAtualizados: Usuario[]

    if (usuarioEmEdicao) {
      usuariosAtualizados = usuarios.map(u =>
        u.id === usuarioEmEdicao.id
          ? {
            ...usuarioEmEdicao,
            ...novoUsuario,
            dataCadastro: usuarioEmEdicao.dataCadastro
          }
          : u
      )
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      })
    } else {
      const novoUsuarioCompleto: Usuario = {
        ...novoUsuario as Usuario,
        id: crypto.randomUUID(),
        dataCadastro: new Date().toISOString(),
        cargo: novoUsuario.cargo || 'tecnico' // Definindo 'tecnico' como padrão se não for especificado
      }
      usuariosAtualizados = [...usuarios, novoUsuarioCompleto]
      toast({
        title: "Sucesso",
        description: "Usuário cadastrado com sucesso!",
      })
    }

    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados))
    setUsuarios(usuariosAtualizados)
    limparFormulario()
  }

  const editarUsuario = (usuario: Usuario) => {
    setUsuarioEmEdicao(usuario)
    setNovoUsuario({
      nome: usuario.nome,
      login: usuario.login,
      senha: usuario.senha,
      cargo: usuario.cargo
    })
    setDialogAberto(true)
  }

  const excluirUsuario = (id: string) => {
    const usuariosAtualizados = usuarios.filter(u => u.id !== id)
    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados))
    setUsuarios(usuariosAtualizados)
    toast({
      title: "Usuário Removido",
      description: "O usuário foi removido com sucesso.",
    })
  }

  const limparFormulario = () => {
    setNovoUsuario({ cargo: 'tecnico' })
    setUsuarioEmEdicao(null)
    setDialogAberto(false)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
        <div className="flex justify-between items-center mb-6">
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{usuarioEmEdicao ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogDescription>
                  Preencha os dados do usuário abaixo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={novoUsuario.nome || ''}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login">Login</Label>
                  <Input
                    id="login"
                    value={novoUsuario.login || ''}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, login: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={novoUsuario.senha || ''}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select
                    value={novoUsuario.cargo}
                    onValueChange={(valor) => setNovoUsuario({ ...novoUsuario, cargo: valor as 'admin' | 'tecnico' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={limparFormulario}>
                  Cancelar
                </Button>
                <Button onClick={salvarUsuario}>
                  {usuarioEmEdicao ? 'Salvar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.login}</TableCell>
                    <TableCell>{usuario.cargo === 'admin' ? 'Administrador' : 'Técnico'}</TableCell>
                    <TableCell>{formatarData(usuario.dataCadastro)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => editarUsuario(usuario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => excluirUsuario(usuario.id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}