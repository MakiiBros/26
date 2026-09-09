'use client';

import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { SlideUp, FadeIn } from '@/components/ui/motion-wrappers';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050508] text-slate-400 overflow-hidden border-t border-white/[0.04]">
      {/* Glow de fondo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#e53e3e]/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <SlideUp className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Marca y Bio */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-[1.02]">
                MakiBr<span className="text-[#e53e3e]">o</span>s
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              La verdadera fusión peruano-japonesa. Rolls taypá y banderillas crocantes preparadas al instante con el flow que nos caracteriza.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1877F2] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E4405F] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Enlaces Rápidos</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#inicio" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/#menu" className="hover:text-white transition-colors">Nuestra Carta</Link></li>
              <li><Link href="/#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto & Ubicación */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Visítanos</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#e53e3e] shrink-0" />
                <span>Lima Norte<br/>Comas, Perú</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#e53e3e] shrink-0" />
                <span>+51 970 725 307</span>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-[#e53e3e] shrink-0" />
                <span>Mar - Dom: 17:30 - 23:00<br/>Lunes: Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Legal */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Legal & Seguridad</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</Link></li>
              <li className="flex items-center gap-2 mt-4 text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium text-xs">Pagos 100% Seguros</span>
              </li>
            </ul>
          </div>

        </SlideUp>
      </div>

      <FadeIn delay={0.2} className="border-t border-white/[0.04] bg-[#030305]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} MakiBros. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5 text-slate-500">
            Hecho con <Heart className="w-3 h-3 text-[#e53e3e] fill-[#e53e3e]" /> por <a href="https://github.com/MakiiBros/26" className="text-slate-400 hover:text-white transition-colors">Angel</a>
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
