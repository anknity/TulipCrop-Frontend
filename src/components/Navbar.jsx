import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="TulipCrop Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold tracking-tighter text-white">
              TulipCrop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-brand-lime transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-brand-lime transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/about#about-overview" className="hidden md:flex px-6 py-2.5 bg-brand-lime text-brand-dark font-semibold text-sm rounded-full hover:bg-brand-volt transition-all duration-300 hover:scale-105 items-center gap-2">
              Get IN Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="md:hidden p-2 text-slate-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 px-4 pt-2 rounded-2xl border border-white/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[50px] animate-fade-in-up">
            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={toggleTheme}
                className="w-fit px-4 py-2 rounded-full glass text-sm font-medium text-slate-700 dark:text-gray-200 flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-medium text-slate-700 dark:text-gray-300 hover:text-brand-lime transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/about#about-overview" className="mt-2 px-6 py-3 bg-brand-lime text-brand-dark font-semibold rounded-full flex justify-center items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                Get IN Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
