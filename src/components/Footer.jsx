import { Instagram, Twitter, Facebook, Youtube, ArrowRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Herbicide', href: '/products?category=Herbicide' },
        { name: 'Fungicide', href: '/products?category=Fungicide' },
        { name: 'Insecticide', href: '/products?category=Insecticide' },
        { name: 'PGR', href: '/products?category=PGR' },
        { name: 'Bio Products', href: '/products?category=Bio%20Products' },
        { name: 'Fertilizers', href: '/products?category=Fertilizers' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/about#our-story' },
        { name: 'Mission & Vision', href: '/about#mission-vision' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/contact?topic=help-center' },
        { name: 'Distributorship', href: '/contact?topic=distributorship' },
        { name: 'Technical Support', href: '/contact?topic=technical-support' },
        { name: 'Admin Login', href: '/admin/login' },
      ],
    },
  ]

  return (
    <footer className="relative pt-32 pb-8 overflow-hidden bg-[#0f1115] text-slate-50">
      {/* Large Background Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <span className="bg-text text-white block translate-y-1/3">TULIPCROP</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* CTA Section */}
        <div className="rounded-[2.3rem] p-10 lg:p-14 mb-20 border border-white/10 bg-gradient-to-r from-[#15171c] via-[#1a1d24] to-[#14171d] shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-none">
              <span className="text-white">READY TO </span>
              <span className="text-[#8cc63f]">HARVEST?</span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Looking for the right crop-protection strategy for your region? Our team can help you
              identify suitable categories and technical direction for your farm requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-[#8cc63f] text-black font-bold rounded-full hover:bg-[#7cc715] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get In Touch
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 border border-white/15 text-white font-bold rounded-full hover:border-brand-lime hover:text-brand-lime transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Categories
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="TulipCrop Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold tracking-tighter text-white">
                TulipCrop
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-4 max-w-xs">
              TulipCrop (India) Pvt. Ltd.<br/>
              An ISO 9001:2015 Certified Company.<br/>
              Technology backed by Israel.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-brand-lime hover:border-brand-lime/50 hover:bg-white/10 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-white mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-500 hover:text-brand-lime transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} TulipCrop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact?topic=privacy-policy" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Privacy Policy</Link>
            <Link to="/contact?topic=terms-of-service" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
