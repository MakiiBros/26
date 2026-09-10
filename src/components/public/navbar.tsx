'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User as UserIcon, LogOut, Shield, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/cart-context';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

export function Navbar() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === '/') {
        if (window.scrollY < 200) {
          setActiveSection('inicio');
          return;
        }

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
          setActiveSection('contacto');
          return;
        }

        const sections = ['contacto', 'nosotros', 'menu'];
        const navOffset = 120;

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= navOffset && rect.bottom > navOffset) {
              setActiveSection(id);
              return;
            }
          }
        }
      }
    };

    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['inicio', 'menu', 'nosotros', 'contacto'].includes(hash)) {
        setActiveSection(hash);
      }
    }

    const handleHashChange = () => {
      if (pathname === '/') {
        const hash = window.location.hash.replace('#', '');
        if (['inicio', 'menu', 'nosotros', 'contacto'].includes(hash)) {
          setActiveSection(hash);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

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
          } catch {
            // Ignorar error de parsing en localStorage
          }
          setCurrentUser(null);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    try { const supabase = createClient(); await supabase.auth.signOut(); } catch {}
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
    { name: 'Inicio', href: '/', id: 'inicio' },
    { name: 'Menú', href: '/#menu', id: 'menu' },
    { name: 'Nosotros', href: '/#nosotros', id: 'nosotros' },
    { name: 'Contacto', href: '/#contacto', id: 'contacto' },
  ];

  const isLinkActive = (link: (typeof navLinks)[0]) => {
    if (pathname === '/') {
      return activeSection === link.id;
    }
    if (link.id === 'inicio') {
      return pathname === '/';
    }
    return pathname === link.href || pathname === `/${link.id}` || pathname?.startsWith(`/${link.id}`);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    if (pathname === '/') {
      if (link.id === 'inicio') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        setActiveSection('inicio');
      } else {
        const targetElement = document.getElementById(link.id);
        if (targetElement) {
          e.preventDefault();
          const navHeight = 75;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          window.history.pushState(null, '', link.href);
          setActiveSection(link.id);
        }
      }
    }
  };

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
        scrolled
          ? 'top-0 md:top-4 md:px-6 lg:px-8 max-w-7xl left-1/2 -translate-x-1/2'
          : 'top-0 px-0 left-0'
      )}
    >
      <div className={cn(
        "transition-all duration-500 mx-auto",
        scrolled
          ? "bg-[#09090c]/85 md:bg-[#09090c]/80 backdrop-blur-2xl border-b md:border border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-none md:rounded-3xl"
          : "bg-[#09090c]/40 backdrop-blur-md border-b border-white/[0.04]"
      )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo real Maki Bros */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group" aria-label="MakiBros — Inicio">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-[1.06]">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="MakiBros logo"
                  fill
                  sizes="48px"
                  className="object-contain rounded-full"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-[1.02]">
                Maki<span className="text-[#e53e3e] drop-shadow-[0_0_10px_rgba(229,62,62,0.7)]">Bros</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 lg:space-x-2 bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-full backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 btn-press',
                      isActive
                        ? 'bg-[#e53e3e] text-white shadow-[0_2px_12px_rgba(229,62,62,0.4)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 text-sm font-medium text-white border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2 rounded-xl transition-all btn-press cursor-pointer"
                >
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#e53e3e] to-[#f59e0b] flex items-center justify-center text-white text-xs font-bold shadow">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate font-medium text-slate-200">{currentUser.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#14141c] border border-white/[0.1] rounded-2xl shadow-2xl py-2 z-50 animate-scale-in backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    {currentUser.isAdmin && (
                      <Link
                        href={ROUTES.ADMIN}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#f59e0b] hover:bg-white/[0.06] transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Panel de Administración
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2.5 rounded-xl transition-all btn-press"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                Ingresar
              </Link>
            )}

            <Link
              href={ROUTES.CHECKOUT}
              className="relative flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#e53e3e] to-[#dc2626] hover:from-[#f87171] hover:to-[#e53e3e] px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_18px_rgba(229,62,62,0.35)] btn-press"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Pedido</span>
              {totalItems > 0 && (
                <span className="bg-black/40 text-white font-extrabold px-2 py-0.5 rounded-full text-xs ml-1 tabular-nums border border-white/20">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href={ROUTES.CHECKOUT}
              className="relative text-white p-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl btn-press"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#e53e3e] rounded-full shadow-lg tabular-nums">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.08] focus:outline-none cursor-pointer btn-press"
              aria-label="Abrir menú de navegación"
            >
              {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#09090c]/95 backdrop-blur-2xl border-b border-white/[0.08] animate-slide-down">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors',
                    isActive
                      ? 'text-white bg-[#e53e3e] shadow-[0_2px_12px_rgba(229,62,62,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  )}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setIsOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                    {currentUser.avatar ? (
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#e53e3e] to-[#f59e0b] flex items-center justify-center text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  {currentUser.isAdmin && (
                    <Link
                      href={ROUTES.ADMIN}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full text-sm font-bold text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-2.5 rounded-xl btn-press"
                    >
                      <Shield className="h-4 w-4" />
                      Panel de Administración
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-red-400 border border-red-500/20 bg-red-950/20 px-4 py-2.5 rounded-xl btn-press cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 rounded-xl hover:bg-white/[0.08] btn-press"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  Ingresar
                </Link>
              )}

              <Link
                href={ROUTES.MENU}
                className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white bg-gradient-to-r from-[#e53e3e] to-[#dc2626] px-4 py-3 rounded-xl shadow-[0_4px_16px_rgba(229,62,62,0.35)] btn-press"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Explorar Nuestra Carta
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

