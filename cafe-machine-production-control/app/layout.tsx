export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Sistema de Controle de Produção',
  description: 'Sistema para gerenciamento de máquinas e produção',
}