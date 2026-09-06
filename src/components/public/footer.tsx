import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-[#070709] pt-20 pb-10 border-t border-white/[0.06] scroll-mt-10 relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#e53e3e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e53e3e] to-[#b91c1c] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#e53e3e]/30">
                巻
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                MakiBr<span className="text-[#e53e3e]">o</span>s
              </span>
            </Link>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              La experiencia definitiva de sushi fusión peruano-japonés en Lima Norte. Crunch artesanal, salsas de autor y rolls bien taypá.
            </p>

            <div className="flex gap-2.5 pt-1">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram de MakiBros"
                className="btn-press text-neutral-400 hover:text-white hover:border-white/20 transition-colors bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-xl hover:bg-white/[0.08]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Facebook de MakiBros"
                className="btn-press text-neutral-400 hover:text-white hover:border-white/20 transition-colors bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-xl hover:bg-white/[0.08]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@makibros.of" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="TikTok oficial de MakiBros"
                className="btn-press text-neutral-400 hover:text-white hover:border-white/20 transition-colors bg-white/[0.03] border border-white/[0.08] p-2.5 rounded-xl hover:bg-white/[0.08]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.1a8.28 8.28 0 005.58 2.15V11.8a4.84 4.84 0 01-3.59-1.52V6.69h3.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs font-mono">Carta Digital</h4>
            <ul className="space-y-2.5 text-neutral-400 text-sm">
              <li><Link href={`${ROUTES.MENU}?category=makis`} className="hover:text-[#e53e3e] transition-colors">Makis Especiales</Link></li>
              <li><Link href={`${ROUTES.MENU}?category=rolls`} className="hover:text-[#e53e3e] transition-colors">Rolls Crocantes</Link></li>
              <li><Link href={`${ROUTES.MENU}?category=ceviches`} className="hover:text-[#e53e3e] transition-colors">Ceviches Clásicos & Mixtos</Link></li>
              <li><Link href={`${ROUTES.MENU}?category=tiraditos`} className="hover:text-[#e53e3e] transition-colors">Tiraditos Ahumados</Link></li>
              <li><Link href={`${ROUTES.MENU}?category=bebidas`} className="hover:text-[#e53e3e] transition-colors">Bebidas & Cervezas</Link></li>
              <li><Link href={`${ROUTES.MENU}?category=postres`} className="hover:text-[#e53e3e] transition-colors">Postres Dulces</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs font-mono">Restaurante</h4>
            <ul className="space-y-2.5 text-neutral-400 text-sm">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Historia & Concepto</Link></li>
              <li><Link href="/#promociones" className="hover:text-white transition-colors">Combos & Promociones</Link></li>
              <li><Link href="/horarios" className="hover:text-white transition-colors">Horarios de Atención</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Políticas & Términos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs font-mono">Atención & Delivery</h4>
            <ul className="space-y-3.5 text-neutral-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#e53e3e] shrink-0" />
                <span>Av. Universitaria con Retablo, Comas, Lima</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span className="font-mono tabular-nums">+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://wa.me/51987654321" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                >
                  <span>WhatsApp Pedidos</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#e53e3e] shrink-0" />
                <a href="mailto:soporte@MakiBros.pe" className="hover:text-white transition-colors">
                  soporte@MakiBros.pe
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-neutral-500 text-xs text-center md:text-left">
            © {currentYear} MakiBros. Todos los derechos reservados. Sabor Nikkei Peruano.
          </p>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-md text-neutral-300 font-semibold tracking-wider">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-md text-neutral-300 font-semibold tracking-wider">
              MC
            </span>
            <span className="px-2.5 py-1 bg-[#742284]/15 border border-[#742284]/30 rounded-md text-[#d946ef] font-bold tracking-wider">
              YAPE
            </span>
            <span className="px-2.5 py-1 bg-[#00c8b3]/15 border border-[#00c8b3]/30 rounded-md text-[#00c8b3] font-bold tracking-wider">
              PLIN
            </span>
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-md text-neutral-400 font-medium tracking-wider">
              EFECTIVO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

