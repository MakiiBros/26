'use client';

import { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './navbar/brand-logo'
import { DesktopCheckoutButton } from './navbar/desktop-checkout-button'
import { DesktopNavLinks } from './navbar/desktop-nav-links'
import { MobileMenuDrawer } from './navbar/mobile-menu'
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

const SECTION_IDS = ['inicio', 'menu', 'nosotros', 'contacto'] as const;
const SCROLL_SECTIONS = ['contacto', 'nosotros', 'menu'] as const;

function getActiveSectionFromScroll(): string | null {
  if (window.scrollY < 200) return 'inicio';

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
    return 'contacto';
  }

  const navOffset = 120;
  return SCROLL_SECTIONS.find((id) => {
    const element = document.getElementById(id);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top <= navOffset && rect.bottom > navOffset;
  }) || null;
}

function getActiveSectionFromHash(): string | null {
  const hash = window.location.hash.replace('#', '');
  return SECTION_IDS.includes(hash as (typeof SECTION_IDS)[number]) ? hash : null;
}

function useNavbarScroll(pathname: string) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (pathname !== '/') return;
      const section = getActiveSectionFromScroll();
      if (section) setActiveSection(section);
    };

    const handleHashChange = () => {
      if (pathname !== '/') return;
      const section = getActiveSectionFromHash();
      if (section) setActiveSection(section);
    };

    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  return { scrolled, activeSection, setActiveSection };
}

function mapFirebaseUser(fbUser: any): UserProfile {
  return {
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Cliente',
    email: fbUser.email || '',
    avatar: fbUser.photoURL || undefined,
    isAdmin: fbUser.email === 'admin@makibros.me',
  };
}

function mapSupabaseUser(user: any): UserProfile {
  return {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || undefined,
    isAdmin: user.email === 'admin@makibros.me',
  };
}

function getLocalUser(): UserProfile | null {
  try {
    const cached = localStorage.getItem('makibros_customer');
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return {
      name: parsed.displayName || parsed.email?.split('@')[0] || 'Cliente',
      email: parsed.email || '',
      avatar: parsed.photoURL || undefined,
      isAdmin: parsed.email === 'admin@makibros.me',
    };
  } catch {
    return null;
  }
}

function useNavbarAuth() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setCurrentUser(mapFirebaseUser(fbUser));
        return;
      }

      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setCurrentUser(mapSupabaseUser(user));
          return;
        }
        setCurrentUser(getLocalUser());
      });
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, setCurrentUser };
}

function DesktopUserActions({ currentUser, userDropdownOpen, setUserDropdownOpen, handleLogout, dropdownRef }: any) {
  if (!currentUser) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2.5 rounded-xl transition-all btn-press"
      >
        <UserIcon className="h-4 w-4 text-slate-400" />
        Ingresar
      </Link>
    );
  }

  return (
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
  );
}


function MobileMenuButtons({ totalItems, isOpen, setIsOpen }: any) {
  return (
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
  );
}

const navLinks = [
  { name: 'Inicio', href: '/', id: 'inicio' },
  { name: 'Menú', href: '/#menu', id: 'menu' },
  { name: 'Nosotros', href: '/#nosotros', id: 'nosotros' },
  { name: 'Contacto', href: '/#contacto', id: 'contacto' },
];

function useNavbarActions(
  pathname: string,
  activeSection: string,
  setActiveSection: (s: string) => void,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  setUserDropdownOpen: (v: boolean) => void,
  setCurrentUser: (v: UserProfile | null) => void,
  setIsOpen: (v: boolean) => void,
  router: any
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, setUserDropdownOpen]);

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

  const isLinkActive = (link: (typeof navLinks)[0]) => {
    if (pathname === '/') return activeSection === link.id;
    if (link.id === 'inicio') return pathname === '/';
    return pathname === link.href || pathname === `/${link.id}` || pathname?.startsWith(`/${link.id}`);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    if (pathname !== '/') return;

    if (link.id === 'inicio') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setActiveSection('inicio');
      return;
    }

    const targetElement = document.getElementById(link.id);
    if (!targetElement) return;

    e.preventDefault();
    const navHeight = 75;
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navHeight;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    window.history.pushState(null, '', link.href);
    setActiveSection(link.id);
  };

  return { handleLogout, isLinkActive, handleNavClick };
}

export function Navbar() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrolled, activeSection, setActiveSection } = useNavbarScroll(pathname);
  const { currentUser, setCurrentUser } = useNavbarAuth();

  const { handleLogout, isLinkActive, handleNavClick } = useNavbarActions(
    pathname,
    activeSection,
    setActiveSection,
    dropdownRef,
    setUserDropdownOpen,
    setCurrentUser,
    setIsOpen,
    router
  );

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
          <BrandLogo />
          <DesktopNavLinks navLinks={navLinks} isLinkActive={isLinkActive} handleNavClick={handleNavClick} />
          <div className="hidden md:flex items-center space-x-3">
            <DesktopUserActions 
              currentUser={currentUser} 
              userDropdownOpen={userDropdownOpen} 
              setUserDropdownOpen={setUserDropdownOpen} 
              handleLogout={handleLogout} 
              dropdownRef={dropdownRef} 
            />
            <DesktopCheckoutButton totalItems={totalItems} />
          </div>
          <MobileMenuButtons totalItems={totalItems} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      </div>

      <MobileMenuDrawer 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navLinks={navLinks}
        isLinkActive={isLinkActive}
        handleNavClick={handleNavClick}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
    </nav>
  );
}

