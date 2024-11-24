'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.replace('/')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Painel de Controle</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Máquinas</h2>
            <p className="text-gray-600 mb-4">Gerencie o cadastro de máquinas de café.</p>
            <Link href="/maquinas">
              <Button className="w-full">Gerenciar Máquinas</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Produção</h2>
            <p className="text-gray-600 mb-4">Registre e acompanhe a produção.</p>
            <Link href="/producao">
              <Button className="w-full">Controle de Produção</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Check-ins</h2>
            <p className="text-gray-600 mb-4">Faça check-ins das máquinas.</p>
            <Link href="/checkins">
              <Button className="w-full">Realizar Check-in</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}