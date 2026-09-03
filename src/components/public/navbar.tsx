'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User as UserIcon, LogOut, Shield, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setCurrentUser({
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Cliente',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined,
          isAdmin: fbUser.email === 'admin@makibros.me',
        });
        return;
      }

      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setCurrentUser({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || undefined,
            isAdmin: user.email === 'admin@makibros.me',
          });
        } else {
          try {
            const cached = localStorage.getItem('makibros_customer');
            if (cached) {
              const parsed = JSON.parse(cached);
              setCurrentUser({
                name: parsed.displayName || parsed.email?.split('@')[0] || 'Cliente',
                email: parsed.email || '',
                avatar: parsed.photoURL || undefined,
                isAdmin: parsed.email === 'admin@makibros.me',
              });
              return;
            }
          } catch (e) {}
          setCurrentUser(null);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) {}
    try { const supabase = createClient(); await supabase.auth.signOut(); } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('makibros_customer');
      document.cookie = 'makibros_customer=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setCurrentUser(null);
    setUserDropdownOpen(false);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

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
        'sticky top-0 w-full z-50 transition-all duration-300',
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
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-white border border-[#2a2a2a] px-3 py-1.5 rounded-md hover:bg-[#1a1a1a] transition-colors"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#3a3a3a]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#e53e3e] flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-[#2a2a2a]">
                      <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    </div>

                    {currentUser.isAdmin && (
                      <Link
                        href={ROUTES.ADMIN}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#f6ad55] hover:bg-[#202020] transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Panel de Administración
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#202020] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="flex items-center gap-2 text-sm font-medium text-white border border-[#2a2a2a] px-4 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                Ingresar
              </Link>
            )}
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
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-[#141414] rounded-lg border border-[#2a2a2a]">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#e53e3e] flex items-center justify-center text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  {currentUser.isAdmin && (
                    <Link
                      href={ROUTES.ADMIN}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full text-sm font-medium text-[#f6ad55] border border-[#f6ad55]/30 bg-[#f6ad55]/10 px-4 py-2 rounded-md"
                    >
                      <Shield className="h-4 w-4" />
                      Panel de Administración
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium text-red-400 border border-red-500/30 bg-red-950/20 px-4 py-2 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  className="flex items-center justify-center gap-2 w-full text-sm font-medium text-white border border-[#2a2a2a] px-4 py-2 rounded-md hover:bg-[#1a1a1a]"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  Ingresar
                </Link>
              )}

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
