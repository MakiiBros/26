import Link from 'next/link'
import { LogOut, MapPin, ChefHat, Info, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileMenuDrawer({ isOpen, setIsOpen, navLinks, isLinkActive, handleNavClick, currentUser, handleLogout }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#09090c]/95 backdrop-blur-xl border-l border-white/10 z-50 md:hidden shadow-2xl flex flex-col"
          >
            <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 mb-4">Menú</p>
                {navLinks.map((link: any) => {
                  const active = isLinkActive(link)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link)
                        setIsOpen(false)
                      }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                        active 
                          ? 'bg-[#e53e3e]/10 text-[#e53e3e] border border-[#e53e3e]/20' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${active ? 'bg-[#e53e3e]/20' : 'bg-white/5'}`}>
                        <link.icon className={`w-5 h-5 ${active ? 'text-[#e53e3e]' : 'text-slate-400'}`} />
                      </div>
                      {link.name}
                    </Link>
                  )
                })}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Cuenta</p>
                {currentUser ? (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#e53e3e] to-[#f59e0b] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    {currentUser.role === 'admin' && (
                      <Link 
                        href="/admin/orders"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full py-2 px-3 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20"
                      >
                        <ChefHat className="w-4 h-4" />
                        Panel Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 text-slate-300 hover:bg-red-500/10 hover:text-red-400 text-sm font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/5"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-[#09090c]">
              <p className="text-xs text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Comas, Lima Norte
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
