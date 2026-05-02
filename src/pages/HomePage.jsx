import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import ProductCategories from '../components/ProductCategories'
import FeaturedProducts from '../components/FeaturedProducts'
import SEO from '../components/SEO'

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Leading Crop Protection Solutions" 
        description="TulipCrop offers premium agricultural products including biocides, PGRs, and herbicides. Empowering farmers with Israeli technology for maximum yield."
        url="/"
      />
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
    </>
  )
}

export default HomePage