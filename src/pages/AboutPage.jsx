import {
  Beaker,
  CheckCircle2,
  Cpu,
  Globe,
  Leaf,
  Shield,
  Sprout,
  Star,
  Target,
} from 'lucide-react'
import SEO from '../components/SEO'

const strengths = [
  {
    title: 'Research-Based',
    desc: 'Every formulation is developed through extensive R&D with proven efficacy across crop types and geographies.',
    icon: Beaker,
  },
  {
    title: 'High Efficiency',
    desc: 'Superior active ingredient concentration ensures maximum protection with optimal input cost.',
    icon: Cpu,
  },
  {
    title: 'Crop-Safe',
    desc: 'Formulations are tested to protect crops while being mindful of beneficial insects and soil biology.',
    icon: Leaf,
  },
  {
    title: 'Eco-Conscious',
    desc: 'We prioritize solutions that protect long-term soil health and water quality.',
    icon: Globe,
  },
  {
    title: 'Quality Assured',
    desc: 'ISO 9001:2015 certified systems ensure consistent quality across every batch.',
    icon: Shield,
  },
  {
    title: 'Field Validated',
    desc: 'Extensive multi-location field trials across Indian conditions before launch.',
    icon: CheckCircle2,
  },
]

const AboutPage = () => {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <SEO 
        title="About Us | Our Story & Vision" 
        description="Learn about TulipCrop's journey, our commitment to eco-friendly agriculture, and the research-backed formulations that make us an industry leader." 
        url="/about"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        <section id="about-overview" className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-brand-lime font-bold mb-5">About TulipCrop</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-black text-slate-900 dark:text-white">
              Built On <span className="text-brand-lime">Science.</span>
              <br />
              Grown On <span className="text-brand-lime">Trust.</span>
            </h1>
            <p className="mt-6 text-slate-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              TulipCrop Science Pvt. Ltd. is an ISO 9001:2015 certified organization and a leading agrochemical
              company focused on high-performance crop protection. For decades, our promoters have been associated
              with the agrochemical industry, helping farmers with reliable, practical, and science-backed solutions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-200">ISO 9001:2015</span>
              <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-200">Israel Tech Partnership</span>
              <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-200">Pan-India Reach</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-[460px]">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 col-span-1 row-span-2 bg-slate-100 dark:bg-slate-800/50">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
                alt="Field landscape"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800/50">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
                alt="Soil and growth"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800/50">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80"
                alt="Harvest produce"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 md:p-12">
          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.18em] uppercase rounded-full border border-brand-lime/30 bg-brand-lime/10 text-brand-lime font-semibold mb-6">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">Introduction</h2>

            <div className="space-y-4 text-slate-600 dark:text-gray-300 leading-relaxed">
              <p>
                We promote and support a broad range of crop protection categories, including Insecticides,
                Herbicides, Fungicides, and Plant Growth Promoters. Our team works to ensure that each solution
                delivers dependable field performance with consistency and farmer confidence.
              </p>
              <p>
                Our operations are built around strong quality control systems, modern laboratory infrastructure,
                and standardized processes. We focus on precision, transparency, and accountability at every step,
                supported by experienced technical professionals and trained field teams.
              </p>
              <p>
                TulipCrop is committed to continuous innovation and practical product development that matches
                real farm requirements. We actively invest in process improvement, capacity enhancement, and
                technology-driven manufacturing to deliver long-term value to growers.
              </p>
              <p>
                Safety, environmental responsibility, and employee well-being remain central to our culture.
                We maintain high standards for occupational health and responsible operations while building
                sustainable growth for agriculture and rural communities.
              </p>
            </div>
          </div>
        </section>

        <section id="our-story" className="grid md:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 text-center">
            <div className="text-5xl font-black text-slate-900 dark:text-white">27+</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 tracking-[0.18em] mt-2">PRODUCTS LAUNCHED</p>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 text-center">
            <div className="text-5xl font-black text-slate-900 dark:text-white">10,000+</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 tracking-[0.18em] mt-2">FARMERS SERVED</p>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 text-center">
            <div className="text-5xl font-black text-slate-900 dark:text-white">200+</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 tracking-[0.18em] mt-2">DISTRIBUTORS</p>
          </div>
        </section>

        <section id="mission-vision" className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-9">
            <Target className="w-9 h-9 text-brand-lime mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
              To empower Indian farmers with scientifically superior and environmentally responsible agro-chemical
              solutions that maximize yield while supporting sustainable agriculture for future generations.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-9">
            <Star className="w-9 h-9 text-brand-lime mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
              To be India's most trusted crop protection brand, known for innovation, quality, and measurable farm
              impact, while setting global standards in agrochemical performance by 2030.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Core Strengths</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Technology-backed, field-tested, farmer-focused</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {strengths.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#17181c] p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center text-brand-lime mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-brand-lime/20 bg-gradient-to-r from-slate-50 via-lime-50/30 to-slate-50 dark:from-brand-dark dark:via-[#121b12] dark:to-brand-dark p-8 md:p-12">
          <p className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.18em] uppercase rounded-full border border-brand-lime/30 bg-brand-lime/10 text-brand-lime font-semibold mb-7">
            <Sprout className="w-4 h-4" /> Israel Technology Partnership
          </p>
          <div className="grid lg:grid-cols-[1fr_140px] gap-8 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-5">
                World-Class Agrochemical <span className="text-brand-lime">Expertise</span>
              </h3>
              <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
                Our collaboration with Israeli innovation ecosystems brings globally recognized crop protection science,
                precision agriculture insights, and high-performance formulation practices to Indian conditions.
              </p>
            </div>
            <div className="hidden lg:flex justify-end">
              <span className="text-7xl font-black text-slate-200 dark:text-white/15">IL</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Our Operational Presence</h4>
            <p className="text-slate-500 dark:text-gray-400">Focused agricultural support across key growth regions in India.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh'].map((state) => (
              <span key={state} className="px-4 py-2 rounded-full text-sm font-medium bg-brand-lime/10 text-brand-lime border border-brand-lime/20">
                {state}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AboutPage
