'use client'

import Link from 'next/link';
import { CheckCircle2, Home, Receipt, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#09090c] flex items-center justify-center p-4 relative overflow-hidden pt-24">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="max-w-md w-full bg-[#121217]/80 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 rounded-[2rem] text-center space-y-8 relative z-10 shadow-2xl shadow-black/80"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-emerald-400/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">¡Orden Confirmada!</h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Tu pago ha sido procesado con éxito. Ya estamos preparando tus deliciosos makis con el verdadero flow.
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center gap-3 text-emerald-400 font-medium">
            <Utensils className="w-5 h-5" />
            <span>Estado: Preparando en cocina</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-300 font-medium">
            <Receipt className="w-5 h-5 text-neutral-500" />
            <span>Te enviaremos el comprobante por WhatsApp.</span>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/">
            <button className="w-full py-4 bg-white text-black hover:bg-neutral-200 font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <Home className="w-5 h-5" />
              <span>Volver al Inicio</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
