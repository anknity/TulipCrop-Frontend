import { useState, useEffect } from 'react'
import { ArrowRight, Heart, Loader2, Package2, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const FEATURED_COUNT = 3

const pickRandomProducts = (items, count) => {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [likedProducts, setLikedProducts] = useState(() => {
    const saved = sessionStorage.getItem('liked_products')
    return saved ? JSON.parse(saved) : {}
  })

  const toggleLike = (id) => {
    setLikedProducts((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      sessionStorage.setItem('liked_products', JSON.stringify(next))
      return next
    })
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const fallbackCopyToClipboard = (value) => {
    const textArea = document.createElement('textarea')
    textArea.value = value
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textArea)
    return ok
  }

  const handleShare = async (product) => {
    const shareUrl = `${window.location.origin}/products/${product._id}`
    const payload = {
      title: `${product.name} | TulipCrop`,
      text: `${product.name} - ${product.activeIngredient || product.category}`,
      url: shareUrl,
    }

    try {
      if (navigator.share && window.innerWidth < 768) {
        await navigator.share(payload)
        return
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          showToast('Product link copied!')
          return
        } catch {
          // Continue with fallback if clipboard API is blocked.
        }
      }

      const copied = fallbackCopyToClipboard(shareUrl)
      if (copied) {
        showToast('Product link copied!')
      } else {
        window.prompt('Copy this product link:', shareUrl)
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products`)
        setProducts(pickRandomProducts(data, FEATURED_COUNT))
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-24 px-6 lg:px-8" id="products">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-brand-lime uppercase mb-2">Latest Additions</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-lime text-brand-dark font-semibold text-sm rounded-full hover:bg-brand-volt transition-all duration-300 hover:scale-105 shrink-0"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="w-7 h-7 text-brand-lime animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
            {products.map((product) => {
              const imageSrc = typeof product.image === 'string' ? product.image.trim() : ''

              return (
                <article
                  key={product._id}
                  className="rounded-[32px] border border-[#c7d9c7] bg-[#edf4ed] p-2 shadow-[0_8px_18px_rgba(23,34,23,0.16)]"
                >
                  <div className="rounded-[24px] border border-[#c7d9c7] bg-[#f8fcf8] p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <img src="/logo.png" alt="TulipCrop" className="w-10 h-10 object-contain" />
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                            likedProducts[product._id]
                              ? 'border-red-200 bg-red-50 text-red-500'
                              : 'border-[#b5d4b5] bg-[#e9f3e9] text-[#4a8c4a]'
                          }`}
                          aria-label="Save product"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleLike(product._id)
                          }}
                        >
                          <Heart className="w-3.5 h-3.5" fill={likedProducts[product._id] ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-[#b5d4b5] bg-[#e9f3e9] text-[#4a8c4a] flex items-center justify-center"
                          aria-label="Share product"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleShare(product)
                          }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.15fr_0.85fr] gap-3 items-center">
                      <div className="space-y-1 text-[12px] text-[#4f4a55]">
                        <p><span className="font-semibold text-[#2d2734]">Name:</span> {product.name}</p>
                        <p><span className="font-semibold text-[#2d2734]">Category:</span> {product.category}</p>
                        <p><span className="font-semibold text-[#2d2734]">Formula:</span> {product.formulation || 'N/A'}</p>
                        <p><span className="font-semibold text-[#2d2734]">Pack:</span> {product.packSize || 'As per label'}</p>
                        <p><span className="font-semibold text-[#2d2734]">Stock:</span> {imageSrc ? 'Available' : 'Limited'}</p>
                        <p><span className="font-semibold text-[#2d2734]">Dose:</span> {product.dosage || 'As directed'}</p>
                      </div>

                      <div className="relative h-56 overflow-visible flex items-end justify-center">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="h-[120%] w-[120%] object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.34)]"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[#9f8c9f]">
                            <Package2 className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#4a9c4a] text-white text-xs font-semibold hover:bg-[#3a7c3a] transition-colors"
                      >
                        Know More
                      </Link>
                      <Link
                        to="/contact"
                        className="px-3 py-1.5 rounded-lg bg-[#6ab86a] text-white text-xs font-semibold hover:bg-[#4a9c4a] transition-colors"
                      >
                        Enquire
                      </Link>
                    </div>

                    <div className="mt-4">
                      <p className="text-[12px] font-semibold text-[#2d2734] mb-1">Description</p>
                      <p className="text-[12px] leading-relaxed text-[#4f4a55] line-clamp-3">{product.description}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4a9c4a]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b5d4b5]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b5d4b5]" />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-up font-medium shadow-lg border border-slate-700">
          {toastMessage}
        </div>
      )}
    </section>
  )
}

export default FeaturedProducts
