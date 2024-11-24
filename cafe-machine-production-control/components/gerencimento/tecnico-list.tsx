'use client'

import { useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Usuário master fixo
const MASTER_USER = {
  login: 'master',
  senha: 'Master',
}

export default function GerenciamentoAcessos() {
  const [formData, setFormData] = useState({
    nome: '',
    login: '',
    senha: '',
    tipoAcesso: 'comum'
  })

  const [usuarios, setUsuarios] = useState([
    { nome: 'Master', login: 'master', tipoAcesso: 'master' },
    { nome: 'Pedro', login: 'Pedro', tipoAcesso: 'comum' },
    { nome: '13', login: '13', tipoAcesso: 'administrador' },
    { nome: '12', login: '12', tipoAcesso: 'comum' },
  ])

  // Simula verificação do usuário atual (substitua pela sua lógica de autenticação)
  const isCurrentUserMaster = true // Simula que o usuário atual é master

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.tipoAcesso === 'administrador') {
      const masterCredentials = prompt("Digite as credenciais do master (login:senha):")
      if (masterCredentials !== `${MASTER_USER.login}:${MASTER_USER.senha}`) {
        alert('Credenciais incorretas. Apenas o master pode criar administradores.')
        return
      }
    }
    
    setUsuarios([...usuarios, { ...formData }])
    setFormData({
      nome: '',
      login: '',
      senha: '',
      tipoAcesso: 'comum'
    })
  }

  const handleRemover = (login: string) => {
    const masterCredentials = prompt("Digite as credenciais do master (login:senha):")
    if (masterCredentials === `${MASTER_USER.login}:${MASTER_USER.senha}`) {
      setUsuarios(usuarios.filter(user => user.login !== login))
    } else {
      alert('Credenciais incorretas. Operação não autorizada.')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Acessos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Crie novos acessos para check-in de máquinas
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoAcesso">Tipo de Acesso</Label>
                <Select
                  value={formData.tipoAcesso}
                  onValueChange={(value) => setFormData({ ...formData, tipoAcesso: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comum">Comum</SelectItem>
                    {isCurrentUserMaster && (
                      <SelectItem value="administrador">Administrador</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Criar Novo Acesso
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 font-medium">
              <div>Nome</div>
              <div>Login</div>
              <div>Tipo de Acesso</div>
              <div>Ações</div>
            </div>
            {usuarios.map((usuario) => (
              <div
                key={usuario.login}
                className="grid grid-cols-4 items-center"
              >
                <div>{usuario.nome}</div>
                <div className={usuario.login === MASTER_USER.login ? 'text-amber-500 font-bold' : ''}>
                  {usuario.login}
                </div>
                <div>{usuario.tipoAcesso}</div>
                <div>
                  {usuario.login !== MASTER_USER.login && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemover(usuario.login)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}