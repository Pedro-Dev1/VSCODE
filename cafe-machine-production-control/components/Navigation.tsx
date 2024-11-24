'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/maquinas"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/maquinas' ? 'text-black' : 'text-muted-foreground'
            }`}
          >
            Máquinas
          </Link>
          <Link
            href="/producao"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/producao' ? 'text-black' : 'text-muted-foreground'
            }`}
          >
            Produção
          </Link>
          <Link
            href="/painel"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/painel' ? 'text-black' : 'text-muted-foreground'
            }`}
          >
            Painel
          </Link>
          <Link
            href="/gerenciamento"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/gerenciamento' ? 'text-black' : 'text-muted-foreground'
            }`}
          >
            Gerenciamento
          </Link>
        </nav>
        <div className="ml-auto">
          <Button variant="ghost" asChild>
            <Link href="/login"></Link>
          </Button>
        </div>
      </div>
    </div>
  )
}