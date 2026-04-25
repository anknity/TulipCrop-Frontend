import { ArrowRight, Scissors, FlaskConical, Bug, Sprout, Leaf, Target } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Herbicide",
    description: "Control unwanted weeds and grasses effectively to reduce competition for nutrients.",
    icon: <Scissors className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Fungicide",
    description: "Prevent and cure fungal diseases to protect crop yield and quality.",
    icon: <FlaskConical className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1958",
  },
  {
    title: "Insecticide",
    description: "Target and eliminate harmful insects and pests to keep plants healthy.",
    icon: <Bug className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "PGR",
    description: "Regulate plant growth for better structure, flowering, and fruit development.",
    icon: <Sprout className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Bio Products",
    description: "Effective solutions for cleaner fields and higher yields.",
    icon: <Leaf className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2065",
  },
  {
    title: "Fertilizers",
    description: "Effective solutions for cleaner fields and higher yields.",
    icon: <Target className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070",
  },
];

const ProductCategories = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-slate-900/5 dark:bg-brand-dark/50" id="categories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-lime text-sm font-bold tracking-widest uppercase mb-2 block">
            — OUR SOLUTIONS
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            Comprehensive Crop Care Categories
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg">
            Tailored solutions for every stage of the crop cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              to="/products"
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] glass-card"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover img-scale opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                <div className="mb-auto">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white mb-6">
                    {category.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-6">
                    {category.description}
                  </p>
                  <div className="flex items-center text-brand-lime font-medium text-sm gap-2">
                    Explore Category
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;