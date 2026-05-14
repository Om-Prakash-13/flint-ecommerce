import HeroSlider from "../components/Home/HeroSlider";

import CategoryGrid from "../components/Home/CategoryGrid";

import ProductSlider from "../components/Home/ProductSlider";

import FeatureSection from "../components/Home/FeatureSection";

import NewsletterSection from "../components/Home/NewsletterSection";

import { useSelector } from "react-redux";

const Index = () => {
  const {
    topRatedProducts,
    newProducts,
  } = useSelector(
    (state) => state.product
  );

  return (
    <main className="min-h-screen bg-background">

      {/* hero */}
      <HeroSlider />


      {/* content */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
        "
      >

        {/* categories */}
        <section className="py-20">
          <CategoryGrid />
        </section>


        {/* new arrivals */}
        {newProducts.length > 0 && (
          <section className="pb-20">

            <ProductSlider
              title="New Arrivals"
              products={newProducts}
            />

          </section>
        )}


        {/* top rated */}
        {topRatedProducts.length > 0 && (
          <section className="pb-20">

            <ProductSlider
              title="Top Rated Products"
              products={
                topRatedProducts
              }
            />

          </section>
        )}


        {/* features */}
        <section className="pb-20">
          <FeatureSection />
        </section>


        {/* newsletter */}
        <section className="pb-24">
          <NewsletterSection />
        </section>

      </div>

    </main>
  );
};

export default Index;