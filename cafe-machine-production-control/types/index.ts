// Enums
export enum StatusMaquina {
    EM_PRODUCAO = 'em_producao',
    CONCLUIDA = 'concluida',
    ENTREGUE = 'entregue',
    MANUTENCAO = 'manutencao'
  }
  
  export enum ModeloNegocio {
    VENDA = 'venda',
    LOCACAO = 'locacao',
    COMODATO = 'comodato'
  }
  
  // Interfaces
  export interface Maquina {
    id: string;
    modelo: string;
    fabricante: string;
    numeroSerie: string;
    patrimonio: string;
    status: StatusMaquina;
    progresso: number;
    clienteId: string;
    modeloNegocio: ModeloNegocio;
    dataInicio: Date;
    dataConclusao?: Date;
    numeroBox?: string;
    numeroGabinete?: string;
  }
  
  export interface Cliente {
    id: string;
    nome: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
  }
  
  export interface Tecnico {
    id: string;
    nome: string;
    login: string;
    senha: string;
    email: string;
    telefone: string;
    especialidade: string[];
  }
  
  export interface Usuario {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    permissoes: string[];
  }
  
  export interface Componente {
    id: string;
    nome: string;
    descricao: string;
    quantidade: number;
    fornecedor: string;
  }
  
  export interface OrdemProducao {
    id: string;
    maquinaId: string;
    tecnicoId: string;
    dataInicio: Date;
    dataPrevisaoTermino: Date;
    dataConclusao?: Date;
    observacoes: string;
  }
  
  export interface Relatorio {
    id: string;
    tipo: 'producao' | 'manutencao' | 'financeiro';
    dataGeracao: Date;
    conteudo: string;
    geradoPor: string;
  }
  
  // Types
  export type FiltroMaquinas = {
    status?: StatusMaquina;
    cliente?: string;
    dataInicio?: Date;
    dataConclusao?: Date;
  }
  
  export type DadosProducao = {
    totalMaquinas: number;
    emProducao: number;
    concluidas: number;
    taxaConclusao: number;
  }
  
  export type ConfiguracaoSistema = {
    tempoMedioProducao: number;
    alertaEstoqueBaixo: number;
    diasParaManutencaoPreventiva: number;
  }
  
  // Prop Types
  export type PainelCompletoProps = {
    dadosProducao: DadosProducao;
    ultimasMaquinas: Maquina[];
    producaoMensal: { mes: string; quantidade: number }[];
  }
  
  export type MaquinaListProps = {
    maquinas: Maquina[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }
  
  export type TecnicoFormProps = {
    tecnico?: Tecnico;
    onSubmit: (tecnico: Omit<Tecnico, 'id'>) => void;
  }
  
  export type RelatorioGeneratorProps = {
    onGenerateReport: (tipo: Relatorio['tipo'], dataInicio: Date, dataFim: Date) => void;
  }
  
  // Utility Types
  export type WithId<T> = T & { id: string };
  export type WithoutId<T> = Omit<T, 'id'>;
  export type UpdateMaquina = Partial<WithoutId<Maquina>>;
  export type CreateMaquina = WithoutId<Maquina>;