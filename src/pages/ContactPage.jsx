import { useState } from 'react'
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

const inquiryTypes = ['General', 'Product Enquiry', 'Distributorship', 'Technical Support']

const contactCards = [
  {
    title: 'Call Us',
    value: '+91 XXXXX XXXXX',
    helper: 'Mon-Sat, 9:00 AM to 6:00 PM',
    href: 'tel:+91XXXXXXXXXX',
    icon: Phone,
  },
  {
    title: 'Email Us',
    value: 'info@tulipcrop.com',
    helper: 'We reply within one business day',
    href: 'mailto:info@tulipcrop.com',
    icon: Mail,
  },
  {
    title: 'WhatsApp',
    value: 'Chat with our team',
    helper: 'Fast support for partner queries',
    href: '#',
    icon: MessageCircle,
  },
]

const ContactPage = () => {
  const [inquiryType, setInquiryType] = useState('General')

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-[#14161a] dark:via-[#181b21] dark:to-[#14161a] p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-lime font-semibold mb-4">Contact</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            Let's Build Better Crop Outcomes Together
          </h1>
          <p className="max-w-3xl text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
            Reach out for product information, technical consultation, and distributorship opportunities.
            TulipCrop connects science-backed crop protection with real farm needs.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-7 items-start">
          <div className="space-y-5">
            {contactCards.map((card) => {
              const Icon = card.icon
              return (
                <a
                  key={card.title}
                  href={card.href}
                  className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1a1d22] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{card.title}</p>
                      <p className="text-slate-900 dark:text-white font-semibold">{card.value}</p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{card.helper}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-gray-500 group-hover:text-brand-lime group-hover:translate-x-0.5 transition-all" />
                </a>
              )
            })}

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Headquarters</h3>
              <p className="text-slate-700 dark:text-gray-300">TulipCrop (India) Pvt. Ltd.</p>
              <p className="text-slate-500 dark:text-gray-400 mt-1">Technology backed by TulipCrop, Israel</p>
              <p className="text-slate-500 dark:text-gray-400">ISO 9001:2015 Certified Company</p>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#121316]">
                  <MapPin className="w-4 h-4 text-brand-lime mb-2" />
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider">Coverage</p>
                  <p className="text-sm text-slate-800 dark:text-white mt-1">Rajasthan, Punjab, Haryana, Uttar Pradesh</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#121316]">
                  <Clock3 className="w-4 h-4 text-brand-lime mb-2" />
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider">Support Window</p>
                  <p className="text-sm text-slate-800 dark:text-white mt-1">Mon-Sat, 9:00 AM to 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-7 md:p-9">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-7">Send An Inquiry</h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Inquiry Type</label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {inquiryTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setInquiryType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        inquiryType === type
                          ? 'bg-brand-lime text-brand-dark border-brand-lime'
                          : 'bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-gray-200 border-slate-200 dark:border-white/10 hover:border-brand-lime/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Product Interest</label>
                  <select className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-700 dark:text-gray-200 focus:outline-none focus:border-brand-lime">
                    <option className="text-black">Select a category</option>
                    <option className="text-black">Herbicide</option>
                    <option className="text-black">Fungicide</option>
                    <option className="text-black">Insecticide</option>
                    <option className="text-black">PGR</option>
                    <option className="text-black">Bio Products</option>
                    <option className="text-black">Fertilizers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 font-semibold">Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell us your crop challenge, target region, and support needed..."
                  className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-lime text-brand-dark font-bold flex items-center justify-center gap-2 hover:bg-brand-volt transition-colors shadow-[0_8px_30px_rgba(132,204,22,0.25)]"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ContactPage
