'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Menú', href: ROUTES.MENU },
    { name: 'Promociones', href: '/#promociones' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold tracking-tighter text-white">
                MakiiBr<span className="text-[#e53e3e]">o</span>s
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                      ? 'text-[#e53e3e]'
                      : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={ROUTES.LOGIN}
              className="flex items-center gap-2 text-sm font-medium text-white border border-[#2a2a2a] px-4 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              <User className="h-4 w-4" />
              Ingresar
            </Link>
            <Link
              href={ROUTES.MENU}
              className="flex items-center gap-2 text-sm font-medium text-white bg-[#e53e3e] px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Ordenar
              <span className="bg-black/20 px-1.5 py-0.5 rounded-full text-xs ml-1">0</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href={ROUTES.CHECKOUT} className="relative text-white p-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#e53e3e] rounded-full">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#1a1a1a] focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-[#2a2a2a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  pathname === link.href
                    ? 'text-[#e53e3e] bg-[#1a1a1a]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex flex-col gap-2 px-3">
              <Link
                href={ROUTES.LOGIN}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-white border border-[#2a2a2a] px-4 py-2 rounded-md hover:bg-[#1a1a1a]"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Ingresar
              </Link>
              <Link
                href={ROUTES.MENU}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-white bg-[#e53e3e] px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setIsOpen(false)}
              >
                Ordenar Ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
