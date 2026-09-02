import React from 'react';
import Link from 'next/link';
import { logout } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden w-64 bg-white dark:bg-gray-800 shadow-md md:flex md:flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Makisbros Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Dashboard
          </Link>
          <Link href="/admin/dishes" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Platos (Dishes)
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form action={logout}>
            <Button type="submit" variant="destructive" className="w-full">
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Topbar para móviles */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Makisbros Admin</h2>
          {/* Aquí se podría agregar un menú hamburguesa real para móvil */}
          <form action={logout}>
            <Button type="submit" variant="destructive" size="sm">
              Salir
            </Button>
          </form>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
