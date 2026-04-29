import { ArrowRight, FlaskConical, Zap, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AboutSection = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-transparent transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-brand-lime"></span>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-lime uppercase">
              Who we are
            </p>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Rooted in Science, <span className="text-brand-lime">Growing with Farmers</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10">
            <strong className="text-brand-lime font-bold">Tulipcrop</strong> delivers advanced crop protection products backed by cutting-edge Israeli Technology, tailored to increase crop yields, improve plant health, and ensure environmental safety.
          </p>

          <div className="space-y-4 mb-10">
            {/* Feature 1 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-[#14161a] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-brand-lime border border-slate-100 dark:border-white/5">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Research-Based Formulations</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Every product developed using advanced scientific research and field trials</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-[#14161a] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-brand-lime border border-slate-100 dark:border-white/5">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">High Efficacy</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Superior active ingredient concentration for maximum crop protection</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-[#14161a] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-brand-lime border border-slate-100 dark:border-white/5">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Crop-Safe Chemistry</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Formulations designed to protect crops without harming beneficial organisms</p>
              </div>
            </div>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-lime text-brand-dark font-bold hover:bg-brand-volt transition-all shadow-[0_8px_30px_rgba(132,204,22,0.2)] hover:shadow-[0_8px_30px_rgba(132,204,22,0.3)] hover:-translate-y-0.5"
          >
            Our Full Story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Right Images (Staggered Grid) */}
        <motion.div 
          className="grid grid-cols-2 gap-4 lg:gap-6 h-[600px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-[32px] overflow-hidden bg-slate-200 dark:bg-slate-800 h-full">
            <img 
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop" 
              alt="Fresh vegetables harvest" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-4 lg:gap-6 h-full">
            <div className="rounded-[32px] overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?q=80&w=600&auto=format&fit=crop" 
                alt="Golden wheat field" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[32px] overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=600&auto=format&fit=crop" 
                alt="Young crop seedlings" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
