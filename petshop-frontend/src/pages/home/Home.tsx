import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./components/Product";
import featured1 from "../../assets/featured/featured1.avif";
import featured2 from "../../assets/featured/featured2.jpeg";
import featured3 from "../../assets/featured/featured3.avif";

const Home = () => {
  const navigate = useNavigate();
  const { categories, featuredCategories, featuredProducts } = useData();
  const [activeSlide, setActiveSlide] = useState(0);

  const featuredRef = useRef<HTMLDivElement | null>(null);

  const featuredContent = [
    {
      image: featured1,
      title: "New Arrivals",
      description: "Check out our latest collection",
    },
    {
      image: featured2,
      title: "Summer Sale",
      description: "Up to 50% off on selected items",
    },
    {
      image: featured3,
      title: "Premium Collection",
      description: "Exclusive designs for you",
    },
  ];

  const scrollFeatured = (direction: string) => {
    if (featuredRef.current) {
      const { clientWidth } = featuredRef.current;
      const scrollAmount = clientWidth;

      let newSlide = activeSlide;
      if (direction === "left") {
        newSlide = Math.max(0, activeSlide - 1);
      } else {
        newSlide = Math.min(featuredContent.length - 1, activeSlide + 1);
      }

      setActiveSlide(newSlide);

      featuredRef.current.scrollTo({
        left: newSlide * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative w-full overflow-hidden mt-6">
        <div
          ref={featuredRef}
          className="flex overflow-x-hidden snap-x snap-mandatory w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredContent.map((content, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-center relative"
            >
              <div className="relative h-64 md:h-96 w-full">
                <img
                  src={content.image}
                  alt={`Featured ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
          onClick={() => scrollFeatured("left")}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
          onClick={() => scrollFeatured("right")}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                activeSlide === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => {
                setActiveSlide(index);
                featuredRef.current?.scrollTo({
                  left: index * featuredRef.current.clientWidth,
                  behavior: "smooth",
                });
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {categories.slice(0, 10).map((category) => (
            <div
              onClick={() => navigate(`/products/categories/${category.id}`)}
              key={category.id}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg shadow-md bg-white transition-all duration-300 group-hover:shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-center text-gray-800">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Featured Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <div
                onClick={() => navigate(`/products/categories/${category.id}`)}
                key={category.id}
                className="cursor-pointer group transition-all duration-300"
              >
                <div className="bg-[#9BDCDE] rounded-lg overflow-hidden h-40 flex items-end justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <div className="flex items-end justify-center w-full pb-2">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      style={{ width: "150px", height: "180px" }}
                    />
                  </div>
                </div>
                <p className="text-center mt-2 font-medium text-gray-800">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
