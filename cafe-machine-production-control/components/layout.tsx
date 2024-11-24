'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-16 gap-4">
            <Link 
              href="/painel"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/painel' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Painel
            </Link>
            <Link
              href="/producao"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/producao' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Produção
            </Link>
            <Link
              href="/gerenciamento"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/gerenciamento' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Gerenciamento
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}