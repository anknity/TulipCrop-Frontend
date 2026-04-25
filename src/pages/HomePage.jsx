import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import ProductCategories from '../components/ProductCategories'
import FeaturedProducts from '../components/FeaturedProducts'

const HomePage = () => {
  return (
    <>
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
    </>
  )
}

export default HomePage