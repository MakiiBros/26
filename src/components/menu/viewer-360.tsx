'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { 
  RotateCw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Eye, 
  Disc3,
  Sparkles,
  RefreshCw
} from 'lucide-react'

interface Viewer360Props {
  videoUrl: string
  posterUrl?: string | null
  dishName?: string
  className?: string
  autoPlay?: boolean
}

export function Viewer360({
  videoUrl,
  posterUrl,
  dishName = 'Plato',
  className = '',
  autoPlay = true,
}: Viewer360Props) {
  // Detect if it's a YouTube link
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeId = getYouTubeId(videoUrl)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isLoading, setIsLoading] = useState(() => !youtubeId)
  const [viewMode, setViewMode] = useState<'sphere' | 'turntable'>('sphere')
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)

  const autoRotateRef = useRef(autoRotate)
  useEffect(() => {
    autoRotateRef.current = autoRotate
  }, [autoRotate])

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const textureRef = useRef<THREE.VideoTexture | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Camera angles
  const lonRef = useRef(0)
  const latRef = useRef(0)
  const isDraggingRef = useRef(false)
  const onPointerDownPointerXRef = useRef(0)
  const onPointerDownPointerYRef = useRef(0)
  const onPointerDownLonRef = useRef(0)
  const onPointerDownLatRef = useRef(0)

  // Turntable drag
  const turntableLastXRef = useRef(0)

  // Initialize Three.js 360 Video Sphere
  useEffect(() => {
    if (youtubeId) {
      return
    }

    const container = containerRef.current
    if (!container) return

    // Video element setup
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = autoPlay
    videoRef.current = video

    video.addEventListener('loadeddata', () => {
      setIsLoading(false)
      setVideoDuration(video.duration || 0)
    })

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100)
      }
    })

    video.play().catch(() => {
      // Autoplay with sound might be blocked, ensure muted
      video.muted = true
      video.play().catch(() => {})
    })

    // Three.js scene setup
    const width = container.clientWidth || 640
    const height = container.clientHeight || 400

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1200)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Texture from video
    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBAFormat
    textureRef.current = texture

    // Sphere Geometry (inverted so camera inside sees video on interior wall)
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mount canvas
    container.appendChild(renderer.domElement)

    // Animation Loop
    let lastTime = performance.now()

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate)

      const delta = (time - lastTime) / 1000
      lastTime = time

      if (autoRotateRef.current && !isDraggingRef.current && viewMode === 'sphere') {
        lonRef.current += delta * 12
      }

      // Constrain latitude
      latRef.current = Math.max(-85, Math.min(85, latRef.current))

      const phi = THREE.MathUtils.degToRad(90 - latRef.current)
      const theta = THREE.MathUtils.degToRad(lonRef.current)

      const targetX = 500 * Math.sin(phi) * Math.cos(theta)
      const targetY = 500 * Math.cos(phi)
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta)

      camera.lookAt(targetX, targetY, targetZ)

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate(performance.now())

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      video.pause()
      video.src = ''
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [videoUrl, youtubeId, autoPlay, viewMode])

  // Mouse & Touch Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    setHasInteracted(true)
    onPointerDownPointerXRef.current = e.clientX
    onPointerDownPointerYRef.current = e.clientY
    onPointerDownLonRef.current = lonRef.current
    onPointerDownLatRef.current = latRef.current
    turntableLastXRef.current = e.clientX

    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    if (viewMode === 'sphere') {
      const deltaX = e.clientX - onPointerDownPointerXRef.current
      const deltaY = e.clientY - onPointerDownPointerYRef.current

      lonRef.current = onPointerDownLonRef.current - deltaX * 0.15
      latRef.current = onPointerDownLatRef.current + deltaY * 0.15
    } else {
      // Turntable mode: scrub video forwards / backwards with drag!
      const deltaX = e.clientX - turntableLastXRef.current
      turntableLastXRef.current = e.clientX
      if (videoRef.current && videoDuration > 0) {
        const scrubStep = (deltaX / 300) * 2 // seconds
        videoRef.current.currentTime = Math.max(
          0,
          Math.min(videoDuration, videoRef.current.currentTime + scrubStep)
        )
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false
    const target = e.currentTarget as HTMLElement
    try {
      target.releasePointerCapture(e.pointerId)
    } catch {}
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode === 'sphere' && cameraRef.current) {
      e.preventDefault()
      const newFov = cameraRef.current.fov + e.deltaY * 0.05
      cameraRef.current.fov = Math.max(35, Math.min(100, newFov))
      cameraRef.current.updateProjectionMatrix()
    }
  }

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }, [])

  const resetView = useCallback(() => {
    lonRef.current = 0
    latRef.current = 0
    if (cameraRef.current) {
      cameraRef.current.fov = 75
      cameraRef.current.updateProjectionMatrix()
    }
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full overflow-hidden select-none bg-black cursor-grab active:cursor-grabbing rounded-xl group ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* If YouTube 360 link */}
      {youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&controls=1`}
          title={`Video 360 ${dishName}`}
          className="w-full h-full min-h-[320px] border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking"
          allowFullScreen
        />
      ) : null}

      {/* Fallback turntable raw video element when user selects turntable mode */}
      {viewMode === 'turntable' && !youtubeId && (
        <video
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay={isPlaying}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain pointer-events-none"
        />
      )}

      {/* Loading Overlay */}
      {isLoading && !youtubeId && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
          <div className="w-12 h-12 border-3 border-[#e53e3e] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white text-sm font-semibold tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Cargando experiencia 3D 360°...
          </p>
          <span className="text-xs text-gray-400 mt-1">Preparando renderizado esférico</span>
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <RotateCw className="w-3.5 h-3.5 text-[#e53e3e] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-black tracking-wider uppercase text-amber-300">
            3D 360°
          </span>
        </div>

        {/* View mode switcher */}
        {!youtubeId && (
          <div className="pointer-events-auto flex items-center bg-black/70 backdrop-blur-md border border-white/10 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('sphere')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'sphere'
                  ? 'bg-[#e53e3e] text-white shadow'
                  : 'text-gray-300 hover:text-white'
              }`}
              title="Vista esférica 360° panorámica"
            >
              <Eye className="w-3 h-3" />
              Esfera 360°
            </button>
            <button
              type="button"
              onClick={() => setViewMode('turntable')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'turntable'
                  ? 'bg-[#e53e3e] text-white shadow'
                  : 'text-gray-300 hover:text-white'
              }`}
              title="Giro de plato con arrastre"
            >
              <Disc3 className="w-3 h-3" />
              Turntable
            </button>
          </div>
        )}
      </div>

      {/* Floating Gesture Hint (Disappears after first interaction) */}
      {!hasInteracted && !isLoading && !youtubeId && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-black/75 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl flex items-center gap-3 text-white shadow-2xl animate-pulse">
            <Compass className="w-6 h-6 text-[#e53e3e]" />
            <div>
              <p className="text-xs font-bold text-white">
                {viewMode === 'sphere' ? 'Arrastra en cualquier dirección' : 'Arrastra horizontalmente'}
              </p>
              <p className="text-[11px] text-gray-300">
                {viewMode === 'sphere' ? 'Explora el plato y entorno en 360°' : 'Gira el plato a tu ritmo'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress line */}
      {!youtubeId && videoDuration > 0 && (
        <div className="absolute bottom-14 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden z-20 pointer-events-none">
          <div
            className="h-full bg-[#e53e3e] transition-all duration-100"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      )}

      {/* Bottom Control Bar */}
      {!youtubeId && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>

            {viewMode === 'sphere' && (
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                  autoRotate ? 'bg-white/15 text-amber-300 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
                title="Giro automático continuo"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                <span className="hidden sm:inline">Auto-rotar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {viewMode === 'sphere' && (
              <button
                type="button"
                onClick={resetView}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                title="Centrar vista 360°"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
