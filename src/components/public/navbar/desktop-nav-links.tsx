import Link from 'next/link'
import { motion } from 'framer-motion'

export function DesktopNavLinks({ navLinks, isLinkActive, handleNavClick }: any) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center">
      <div className="flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.05] shadow-inner backdrop-blur-md">
        {navLinks.map((link: any) => {
          const active = isLinkActive(link)
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out flex items-center gap-2
                ${active 
                  ? 'text-white drop-shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {active && (
                <motion.div
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#e53e3e]/80 to-[#c53030]/80 rounded-full shadow-[0_0_15px_rgba(229,62,62,0.4)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <link.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                {link.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
