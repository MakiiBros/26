import React from 'react';
import Link from 'next/link';
import { logout } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Utensils, Globe, LogOut, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden w-64 bg-[#111111] border-r border-[#222222] md:flex md:flex-col shrink-0">
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-wider text-white">
              MakiiBr<span className="text-[#e53e3e]">o</span>s
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-[#f6ad55]/20 text-[#f6ad55] px-2 py-0.5 rounded border border-[#f6ad55]/30">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Menú Principal
          </div>
          
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-gray-400" />
            Dashboard
          </Link>

          <Link 
            href="/admin/dishes" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <Utensils className="w-4 h-4 text-gray-400" />
            Platos del Menú
          </Link>

          <div className="pt-4 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Acceso Rápido
          </div>

          <Link 
            href="/" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-400" />
            Ver Tienda Online
          </Link>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-[#222222] bg-[#0d0d0d]">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-[#e53e3e]/20 border border-[#e53e3e]/40 flex items-center justify-center text-[#e53e3e] font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Administrador</p>
              <p className="text-[10px] text-gray-400 truncate">admin@makibros.me</p>
            </div>
          </div>

          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 w-full text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar para móviles */}
        <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#111111] border-b border-[#222222]">
          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-white">
              MakiiBr<span className="text-[#e53e3e]">o</span>s
            </span>
            <span className="text-[9px] uppercase font-bold bg-[#f6ad55]/20 text-[#f6ad55] px-1.5 py-0.5 rounded">
              Admin
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link 
              href="/admin/dishes"
              className="text-xs text-gray-300 hover:text-white px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]"
            >
              Platos
            </Link>
            <form action={logout}>
              <Button type="submit" variant="destructive" size="sm" className="h-8 text-xs px-2.5">
                Salir
              </Button>
            </form>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
