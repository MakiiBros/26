import Link from 'next/link'
import Image from 'next/image'

export function BrandLogo() {
  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center gap-2 group" aria-label="MakiBros — Inicio">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-[1.06]">
          <Image
            src="/images/brand/logo.png"
            alt="MakiBros logo"
            fill
            sizes="48px"
            className="object-contain"
            priority
            loading="eager"
          />
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-[1.02]">
          Maki<span className="text-[#e53e3e] drop-shadow-[0_0_10px_rgba(229,62,62,0.7)]">Bros</span>
        </span>
      </Link>
    </div>
  )
}
