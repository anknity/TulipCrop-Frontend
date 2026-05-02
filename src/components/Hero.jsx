import { useEffect, useState } from 'react'
import { ArrowDown, Play } from 'lucide-react'

const HERO_STATS = [
  { value: 100, label: 'Products' },
  { value: 4, label: 'States' },
  { value: 200, label: 'Distributors' },
  { value: 6, label: 'Categories' },
]

const Hero = () => {
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [counts, setCounts] = useState(() => HERO_STATS.map(() => 0))

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPlayVideo(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let start = null
    const duration = 1200

    const tick = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const nextCounts = HERO_STATS.map((stat) => Math.floor(stat.value * progress))
      setCounts(nextCounts)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    const rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920"
          alt="Agriculture field"
          className={`w-full h-full object-cover transition-opacity duration-700 ${shouldPlayVideo ? 'opacity-20' : 'opacity-40'}`}
        />

        {shouldPlayVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-70' : 'opacity-0'}`}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark" />
      </div>

      {/* Architectural Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <span className="bg-text text-white">
          TULIPCROP
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-brand-volt rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">Premium Agriculture Products</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-tight mb-6">
            <span className="block animate-fade-in-up">Innovating Crop</span>
            <span className="block text-[#4cda71] animate-fade-in-up delay-100">Protection & Growth</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200">
            We bridge the gap between advanced bio-chemistry and sustainable farming practices.
            Our mission is to deliver next-generation crop protection solutions that maximize yield
            while preserving the environment for future generations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <a
              href="#products"
              className="group px-6 py-3 bg-[#8cc63f] text-black font-bold text-base rounded-full hover:bg-brand-volt transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Explore Products
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>
            <button className="px-6 py-3 bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-base rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Video
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-400">
            {HERO_STATS.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#587a14]">
                  {counts[index]}+
                </div>
                <div className="text-sm font-medium text-slate-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-20" />
    </section>
  )
}

export default Hero
