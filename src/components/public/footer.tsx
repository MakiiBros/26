'use client';

import { MapPin, Phone, Clock, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SlideUp, FadeIn } from '@/components/ui/motion-wrappers';
import dynamic from 'next/dynamic';
import tiktokAnimation from '@/components/tiktok-lottie.json';

const Lottie = dynamic(() => import('lottie-react').then(mod => mod.Lottie), { ssr: false });

const WA_LINK = 'https://wa.me/51924336957?text=Hola%20MakiBros!%20Quiero%20hacer%20un%20pedido.';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050508] text-slate-400 overflow-hidden border-t border-white/[0.04]">
      {/* Glow de fondo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#e53e3e]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <SlideUp className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Marca y Bio */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/brand/logo.png"
                  alt="MakiBros logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:scale-[1.02] transition-transform">
                Maki<span className="text-[#e53e3e]">Bros</span>
              </span>
            </Link>
            <p className="text-sm italic font-semibold text-[#f59e0b]/80">
              "Una Vez No Basta"
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Makis en banderilla hechos a mano en Comas. Ingredientes frescos, crunch real y el mejor sabor de Lima Norte.
            </p>
            <div className="flex gap-3">
              <a href={WA_LINK} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="WhatsApp MakiBros"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com/@makibros" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FE2C55]/20 hover:border-[#FE2C55]/50 transition-colors relative overflow-hidden"
                aria-label="TikTok MakiBros"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Lottie src={tiktokAnimation} loop={true} className="w-6 h-6" />
                </div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E4405F] transition-colors"
                aria-label="Instagram MakiBros"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Menú</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#inicio" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/#menu" className="hover:text-white transition-colors">Nuestra Carta</Link></li>
              <li><Link href="/#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Pedir por WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto & Ubicación */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Visítanos</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#e53e3e] shrink-0 mt-0.5" />
                <span>
                  <span className="text-white font-semibold">Av. El Retablo 115</span>
                  <br />
                  Comas, Lima — Perú
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#e53e3e] shrink-0 mt-0.5" />
                <a href="https://wa.me/51924336957?text=Hola%20MakiBros!%20Quiero%20hacer%20un%20pedido." target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-[#e53e3e] shrink-0 mt-0.5" />
                <span>
                  <span className="text-white font-semibold">Lun · Mié · Vie · Sáb</span>
                  <br />
                  Desde las 5:30 PM
                  <br />
                  <span className="text-[#f59e0b] text-xs font-semibold">Hasta agotar stock</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Precio estrella & Legal */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#e53e3e]/10 to-[#f59e0b]/5 border border-[#e53e3e]/20 rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Desde</p>
              <p className="text-5xl font-black text-white leading-none tabular-nums">
                S/<span className="text-[#e53e3e]">10</span>
              </p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">c/u · por unidad</p>
            </div>

            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium text-xs">Pagos 100% Seguros</span>
              </li>
            </ul>
          </div>

        </SlideUp>
      </div>

      <FadeIn delay={0.2} className="border-t border-white/[0.04] bg-[#030305]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} MakiBros · Av. El Retablo 115, Comas</p>
          <p className="flex items-center gap-1.5 text-slate-500">
            Hecho con <Heart className="w-3 h-3 text-[#e53e3e] fill-[#e53e3e]" /> por{' '}
            <a href="https://github.com/MakiiBros/26" className="text-slate-400 hover:text-white transition-colors">Angel</a>
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
