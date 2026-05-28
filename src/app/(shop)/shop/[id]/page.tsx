// app/(shop)/product/[id]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Shield,
  Truck,
  CheckCircle2,
  Leaf,
  Zap,
  Brain,
  Activity,
} from "lucide-react";

// Mocked structural asset payload mimicking your uploaded image state
const MOCK_PRODUCT = {
  title: "Premium Himalayan Shilajeet",
  badge: "ORGANIC • LAB TESTED",
  price: 45.0,
  rating: 4.9,
  reviewsCount: 128,
  description:
    "Pure, potent, and sustainably sourced from the heart of the Himalayas. Our Shilajeet resin is cold-extracted and purified to retain its 85+ trace minerals and fulvic acid content.",
  mainImage: "/images/product/shilajeet-main.jpg",
  gallery: [
    "/product-page-pic.png",
    "/product-page-pic.png",
    "/product-page-pic.png",
    "/product-page-pic.png",
    "/product-page-pic.png",
  ],
  benefits: [
    {
      icon: <Zap className="w-5 h-5 text-zinc-800" />,
      title: "Sustained Vitality",
      desc: "Naturally boosts ATP production, providing a clean energy lift without the jitters associated with caffeine or synthetic stimulants.",
    },
    {
      icon: <Brain className="w-5 h-5 text-zinc-800" />,
      title: "Cognitive Clarity",
      desc: "Rich in fulvic acid, known for its neuroprotective properties and ability to enhance mental focus and long-term memory.",
    },
    {
      icon: <Activity className="w-5 h-5 text-zinc-800" />,
      title: "Cellular Recovery",
      desc: "Contains over 85 trace minerals that support the body's natural healing processes and optimize nutrient absorption.",
    },
  ],
  reviews: [
    {
      author: "ELIZABETH A.",
      date: "2 weeks ago",
      rating: 5,
      text: "The quality is incomparable. I've tried many brands, but the potency and cleanliness of Healthy Basket is evident from the first dose. Truly a premium experience.",
    },
    {
      author: "JAMES D.",
      date: "1 month ago",
      rating: 5,
      text: "I appreciate the laboratory certification. In a market full of questionable supplements, this feels like an investment in my health. The packaging is also beautiful.",
    },
  ],
};

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(MOCK_PRODUCT.gallery[0]);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 pb-24">
      {/* Upper Segment: Interactive Media Sandbox + Buying Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          {/* Left Block: Image Workbench Matrix */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200/40 shadow-sm">
              <Image
                src={activeImage}
                alt={MOCK_PRODUCT.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
              />
            </div>

            {/* Dynamic Thumbnails Track Row */}
            <div className="grid grid-cols-5 gap-3">
              {MOCK_PRODUCT.gallery.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square bg-zinc-100 rounded-md overflow-hidden border transition-all duration-200 ${
                    activeImage === img
                      ? "border-zinc-900 ring-1 ring-zinc-900"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Block: Order Placement Matrix */}
          <div className="flex flex-col pt-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#4a6b36] bg-[#e2f0d9] px-3 py-1 rounded-full w-fit mb-4 uppercase">
              {MOCK_PRODUCT.badge}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-zinc-900 mb-2">
              {MOCK_PRODUCT.title}
            </h1>

            {/* Stars Summary Rating Row */}
            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-zinc-900 stroke-zinc-900"
                  />
                ))}
              </div>
              <span className="text-xs font-light text-zinc-500">
                ({MOCK_PRODUCT.reviewsCount} Reviews)
              </span>
            </div>

            {/* Price Presentation Row */}
            <div className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900 mb-6">
              ${MOCK_PRODUCT.price.toFixed(2)}
            </div>

            {/* Editorial Product Copy block */}
            <p className="text-zinc-600 text-sm sm:text-base font-light leading-relaxed mb-8 border-b border-zinc-200 pb-8 text-balance">
              {MOCK_PRODUCT.description}
            </p>

            {/* Quantity Adjuster Controller Box */}
            <div className="mb-6">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
                Quantity
              </label>
              <div className="flex items-center border border-zinc-300 rounded-md w-fit bg-white/50 shadow-xs">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-900 text-sm transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-sm font-medium w-8 text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-900 text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Transaction Action Panel Block */}
            <div className="space-y-3 mb-8">
              <button className="w-full py-4 bg-[#312117] hover:bg-[#432f22] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition-all duration-200 active:scale-99">
                Add to Cart
              </button>
              <button className="w-full py-4 bg-[#f2ede7] hover:bg-[#eade6f]/20 border border-zinc-300/60 text-[#312117] text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-200">
                Buy Now
              </button>
            </div>

            {/* Value Checkpoints Grid Strip */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-zinc-200 pt-6">
              {[
                {
                  icon: <Leaf className="w-4 h-4 text-zinc-700" />,
                  text: "100% Organic",
                },
                {
                  icon: <Truck className="w-4 h-4 text-zinc-700" />,
                  text: "Free Shipping",
                },
                {
                  icon: <Shield className="w-4 h-4 text-zinc-700" />,
                  text: "Lab Certified",
                },
                {
                  icon: <CheckCircle2 className="w-4 h-4 text-zinc-700" />,
                  text: "Ethically Sourced",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-zinc-600 font-light"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Center Segment: Value Proposition Layout Block */}
      <section className="w-full border-t border-zinc-200/60 mt-20 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-900 mb-12">
            Traditional Wisdom, Modern Purity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {MOCK_PRODUCT.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-[#fffdfb] border border-zinc-200/40 p-8 rounded-xl text-left shadow-xs flex flex-col items-start"
              >
                <div className="p-3 bg-[#f5efe9] rounded-lg mb-5 shadow-xs">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-serif text-zinc-900 mb-2 tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lower Segment: Verified Testimonials Evaluation Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-zinc-200/60">
        <div className="flex justify-between items-baseline mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-900 mb-1">
              Refined Testimony
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Voices from our health-conscious community.
            </p>
          </div>
          <button className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-600 hover:border-zinc-400 transition-all">
            Write a Review
          </button>
        </div>

        {/* Dynamic Reviews Deck Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PRODUCT.reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200/40 rounded-xl p-6 sm:p-8 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-amber-400 stroke-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-light">
                    {review.date}
                  </span>
                </div>
                <p className="text-zinc-600 text-xs sm:text-sm font-light italic leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#f5efe9] text-zinc-700 font-serif text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {review.author.split(" ")[0][0]}
                  {review.author.split(" ")[1]?.[0] || ""}
                </div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase flex items-center gap-1">
                  {review.author}
                  <span
                    className="text-emerald-600 text-[10px] font-normal lowercase"
                    title="Verified buyer"
                  >
                    ✓
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
