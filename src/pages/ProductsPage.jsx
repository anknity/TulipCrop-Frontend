import { useState, useEffect, useMemo, useRef } from 'react'
import { ChevronDown, Filter, Loader2, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products`)
        setProducts(data)
        const cats = ['All', ...new Set(data.map((p) => p.category))]
        setCategories(cats)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category')
    if (!categoryFromQuery || categories.length === 0) return
    if (!categories.includes(categoryFromQuery)) return
    if (categoryFromQuery !== selectedCategory) {
      setSelectedCategory(categoryFromQuery)
    }
  }, [categories, searchParams, selectedCategory])

  useEffect(() => {
    const currentCategory = searchParams.get('category') || 'All'
    if (currentCategory === selectedCategory) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    if (selectedCategory === 'All') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', selectedCategory)
    }

    setSearchParams(nextParams, { replace: true })
  }, [selectedCategory, searchParams, setSearchParams])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    const filteredByCategory = selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

    if (!normalizedQuery) return filteredByCategory

    return filteredByCategory.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    )
  }, [products, selectedCategory, normalizedQuery])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-brand-lime uppercase mb-3">Catalog</p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mt-2 leading-none tracking-tighter uppercase relative">
              <span className="text-slate-900 dark:text-white block relative z-10">Premium</span>
              <span className="text-slate-300 dark:text-white/15 block -mt-2 sm:-mt-4 relative z-0">Products</span>
            </h1>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Filter by: {selectedCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14181d] shadow-xl z-20 max-h-72 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-brand-lime/20 text-slate-900 dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative min-w-[220px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full glass text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:border-brand-lime"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-slate-400 dark:text-slate-500">No products found</p>
            <p className="text-sm text-slate-400 dark:text-slate-600 mt-2">Products will appear once added by the admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} useProductBackground />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage