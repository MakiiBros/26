import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#09090c] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141414] border border-[#2a2a2a] p-8 rounded-3xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white">¡Pago Exitoso!</h1>
        <p className="text-gray-400 text-sm">
          Tu orden ha sido confirmada y ya estamos preparando tus deliciosos makis. 
          Te contactaremos a la brevedad si necesitamos validar algún dato.
        </p>

        <div className="pt-6 border-t border-white/5">
          <Link href="/">
            <button className="w-full py-4 bg-[#e53e3e] hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20">
              <Home className="w-5 h-5" />
              <span>Volver al Inicio</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
