import { memo, useEffect, useState } from 'react'
import { Heart, Package2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product, useProductBackground = false }) => {
  const [hasError, setHasError] = useState(false)
  const imageSrc = typeof product.image === 'string' ? product.image.trim() : ''
  const [likedProducts, setLikedProducts] = useState(() => {
    const saved = sessionStorage.getItem('liked_products')
    return saved ? JSON.parse(saved) : {}
  })

  const imageSectionStyle = useProductBackground
    ? { backgroundImage: "url('/Product-card-bg.png')" }
    : undefined

  useEffect(() => {
    setHasError(false)
  }, [imageSrc])

  const toggleLike = (id) => {
    setLikedProducts((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      sessionStorage.setItem('liked_products', JSON.stringify(next))
      return next
    })
  }

  return (
    <Link to={`/products/${product._id}`} className="group flex flex-col h-full rounded-2xl p-[10px] bg-white border border-slate-200/50 shadow-sm overflow-hidden dark:bg-[#14181d]/85 dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-md">
      {/* Top Image Section */}
      <div
        className="relative h-60 w-full rounded-xl overflow-hidden bg-black bg-center bg-cover"
        style={imageSectionStyle}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                circle at center,
                rgba(6, 182, 212, 0.12) 0%,
                rgba(6, 182, 212, 0.06) 20%,
                rgba(0, 0, 0, 0) 60%
              )
            `,
          }}
        />
        {!hasError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="absolute inset-0 z-10 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="relative z-10 h-full w-full flex items-center justify-center text-slate-400">
            <Package2 className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow px-2 py-4 pb-3">
        {/* Title & Heart Button */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {product.activeIngredient || product.category}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleLike(product._id)
            }}
            className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              likedProducts[product._id]
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200'
            }`}
          >
            <Heart className="w-4 h-4" fill={likedProducts[product._id] ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[13px] leading-relaxed font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
          {product.description}
        </p>

        {/* Bottom Details & CTA */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Pack Size</p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate mt-1">
              {product.packSize || 'As per label'}
            </p>
          </div>

          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-[12px] font-semibold bg-[#007fb1] text-white hover:bg-[#006a94] transition-colors shadow-sm whitespace-nowrap shrink-0">
            See more
          </span>
        </div>
      </div>
    </Link>
  )
}

export default memo(ProductCard)
