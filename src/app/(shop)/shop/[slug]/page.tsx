"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Shield,
  Truck,
  CheckCircle2,
  Leaf,
  Zap,
  Brain,
  Activity,
  ArrowLeft,
  ShoppingBag,
  Zap as ZapIcon,
} from "lucide-react";
import { productService, Product } from "@/services/productService";
import { useCart } from "@/context/CartContext";
// 1. Import useAuth to pull user details directly from the global application state sandbox
import { useAuth } from "@/context/AuthContext";
import FlyToCart from "@/components/common/FlyToCart";
import ReviewModal from "@/components/modals/AddReviewModal";
import axiosInstance from "@/lib/axios";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [addedToCart, setAddedToCart] = useState(false);

  // Modal display states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Cart Context parameters
  const { addItem, cartIconRef } = useCart();
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const [flyTrigger, setFlyTrigger] = useState(0);

  // 2. Destructure active user identity profile variables and authentication flags from context matrix
  const { user, isAuthenticated } = useAuth();

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await productService.getProductBySlug(slug);
      if (response.success && response.product) {
        setProduct(response.product);
        if (response.product.images && response.product.images.length > 0) {
          setActiveImage(response.product.images[0]);
        } else {
          setActiveImage("/product-page-pic.png");
        }
      } else {
        setError("Product details could not be loaded.");
      }
    } catch (err: unknown) {
      console.error("Error fetching product details:", err);
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = (err as any).response;
        setError(
          errorResponse?.data?.message ||
            "Failed to load product. Please check your network connection.",
        );
      } else {
        setError(
          "Failed to load product. Please check your network connection.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      id: product.slug,
      name: product.name,
      price: product.salePrice || product.originalPrice,
      imageSrc: product.images?.[0] || "/product-page-pic.png",
      quantity,
    });
    setFlyTrigger((t) => t + 1);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  }, [product, addItem, quantity]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addItem({
      id: product.slug,
      name: product.name,
      price: product.salePrice || product.originalPrice,
      imageSrc: product.images?.[0] || "/product-page-pic.png",
      quantity,
    });
    router.push("/cart");
  }, [product, addItem, quantity, router]);

  // Handle Auth Gate validation checks before rendering Modal Matrix using state context parameters
  const handleWriteReviewClick = () => {
    if (!isAuthenticated || !user) {
      // Direct context routing to pass redirection parameters seamlessly back down to this slug
      router.push(`/login?redirect=/shop/${slug}`);
      return;
    }

    setIsReviewModalOpen(true);
  };

  // Interfacing the structured Multipart / JSON Formdata submissions directly to API endpoint
  const handleReviewSubmit = async (formData: FormData) => {
    if (!product) return;

    if (!isAuthenticated || !user) {
      throw new Error("Your session has timed out. Please sign in again.");
    }

    // Safely parse identifier fallbacks from user profile context object model
    const userId = user.id || user.userId || user._id;
    if (!userId) {
      throw new Error(
        "Authentication profiling details missing. Please sign back in.",
      );
    }

    // Inject mandatory data structures defined by your backend specification architecture
    formData.append("productId", product._id || product.id);
    formData.append("userId", userId);

    const response = await axiosInstance.post("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.data;

    if (!data.success) {
      throw new Error(
        data.message || "Failed to dispatch review content parameters.",
      );
    }

    // Refresh layout data sandbox context to view the shiny newly published client review
    fetchProductDetails();
  };

  if (loading) {
    return (
      <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 flex flex-col items-center justify-center py-24">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          <div className="space-y-4 animate-pulse">
            <div className="w-full aspect-square bg-zinc-200 rounded-xl" />
            <div className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-200 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6 animate-pulse pt-2">
            <div className="h-6 w-32 bg-zinc-200 rounded-full" />
            <div className="h-10 w-3/4 bg-zinc-200 rounded" />
            <div className="h-4 w-24 bg-zinc-200 rounded" />
            <div className="h-8 w-20 bg-zinc-200 rounded" />
            <div className="h-24 w-full bg-zinc-200 rounded" />
            <div className="h-12 w-full bg-zinc-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 flex flex-col items-center justify-center py-24 px-4">
        <div className="max-w-md w-full bg-white border border-zinc-200 p-8 rounded-xl shadow-xs text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-4 font-bold">
            !
          </div>
          <h2 className="text-xl font-serif text-zinc-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-zinc-500 font-light mb-6">
            {error ||
              "The requested organic product does not exist or has been removed."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#312117] hover:bg-[#432f22] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/product-page-pic.png"];

  const productBadge = product.category
    ? `${product.category} • ${product.stock ? "IN STOCK" : "OUT OF STOCK"}`
    : product.stock
      ? "IN STOCK"
      : "OUT OF STOCK";

  const premiumBenefits = [
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
  ];

  return (
    <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 pb-24">
      <FlyToCart
        originEl={addToCartBtnRef.current}
        targetEl={cartIconRef.current}
        imageSrc={product.images?.[0] || "/product-page-pic.png"}
        trigger={flyTrigger}
      />

      {/* Main Sandbox Upper Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200/40 shadow-sm">
              <Image
                src={activeImage || galleryImages[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
              />
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {galleryImages.slice(0, 5).map((img, idx) => (
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
            )}
          </div>

          <div className="flex flex-col pt-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#4a6b36] bg-[#e2f0d9] px-3 py-1 rounded-full w-fit mb-4 uppercase">
              {productBadge}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-zinc-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = product.ratings || 0;
                  const isFilled = i < Math.floor(ratingValue);
                  return (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        isFilled
                          ? "fill-zinc-900 stroke-zinc-900"
                          : "fill-none stroke-zinc-300"
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-light text-zinc-500">
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
                ${(product.salePrice || product.originalPrice).toFixed(2)}
              </span>
              {product.salePrice > 0 &&
                product.salePrice < product.originalPrice && (
                  <span className="line-through text-sm text-zinc-400">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
            </div>

            <p className="text-zinc-600 text-sm sm:text-base font-light leading-relaxed mb-8 border-b border-zinc-200 pb-8 text-balance">
              {product.description ||
                "No description available for this premium organic product."}
            </p>

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

            <div className="space-y-3 mb-8">
              <button
                ref={addToCartBtnRef}
                onClick={handleAddToCart}
                disabled={!product.stock}
                className={`
                  w-full py-4 text-xs font-semibold uppercase tracking-widest rounded-md shadow-md
                  transition-all duration-200 active:scale-99 cursor-pointer
                  flex items-center justify-center gap-2
                  ${
                    addedToCart
                      ? "bg-[#4a6b36] text-white"
                      : product.stock
                        ? "bg-[#312117] hover:bg-[#432f22] text-white"
                        : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                  }
                `}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedToCart
                  ? "Added to Cart ✓"
                  : product.stock
                    ? "Add to Cart"
                    : "Out of Stock"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.stock}
                className={`
                  w-full py-4 border border-zinc-300/60 text-xs font-semibold uppercase tracking-widest
                  rounded-md transition-all duration-200 cursor-pointer
                  flex items-center justify-center gap-2
                  ${
                    product.stock
                      ? "bg-[#f2ede7] hover:bg-[#eade6f]/20 text-[#312117]"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }
                `}
              >
                <ZapIcon className="w-4 h-4" />
                Buy Now
              </button>
            </div>

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

      {/* Middle Value Proposition Block */}
      <section className="w-full border-t border-zinc-200/60 mt-20 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-900 mb-12">
            Traditional Wisdom, Modern Purity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {premiumBenefits.map((benefit, idx) => (
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

      {/* Lower Testimonials Grid Block */}
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
          <button
            onClick={handleWriteReviewClick}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-600 hover:border-zinc-400 transition-all cursor-pointer"
          >
            Write a Review
          </button>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review, idx) => {
              const authorName = review.user
                ? `${review.user.firstName} ${review.user.lastName || ""}`.trim()
                : "Verified Buyer";
              const authorInitials = review.user
                ? `${review.user.firstName[0]}${review.user.lastName?.[0] || ""}`.toUpperCase()
                : "VB";

              return (
                <div
                  key={review._id || idx}
                  className="bg-white border border-zinc-200/40 rounded-xl p-6 sm:p-8 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-amber-400 stroke-amber-400"
                                : "fill-none stroke-zinc-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-light">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Recent"}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-xs sm:text-sm font-light italic leading-relaxed mb-6">
                      "{review.comment}"
                    </p>

                    {review.image && (
                      <div className="relative w-20 aspect-square rounded-md overflow-hidden border border-zinc-200 mb-4 bg-zinc-50">
                        <Image
                          src={review.image}
                          alt="Review image upload"
                          fill
                          sizes="10vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#f5efe9] text-zinc-700 font-serif text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {authorInitials}
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase flex items-center gap-1">
                      {authorName}
                      <span
                        className="text-emerald-600 text-[10px] font-normal lowercase"
                        title="Verified buyer"
                      >
                        ✓
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/40 border border-dashed border-zinc-200 rounded-xl w-full">
            <p className="text-sm text-zinc-500 font-light mb-2">
              No reviews yet for this product.
            </p>
            <p className="text-xs text-zinc-400 font-light">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </section>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
