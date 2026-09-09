import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 text-[#e53e3e] animate-spin" />
      <p className="text-neutral-400 font-mono text-sm">Cargando datos...</p>
    </div>
  );
}
