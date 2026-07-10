"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckoutSteps } from "@/components/sections/CheckoutSteps";
import { ShippingForm } from "@/components/sections/ShippingForm";
import { PaymentForm, PaymentMethod } from "@/components/sections/PaymentForm";
import {
  OrderSummary,
  CheckoutProduct,
} from "@/components/sections/CheckoutOrderSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface CardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const [cardInfo, setCardInfo] = useState<CardData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  
  console.log("Submitting checkout with data:", items);
  // Protect route based on current auth loading state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  // Transform cart context data structures safely to visual components specs
  const checkoutItems: CheckoutProduct[] = items.map((item) => ({
    name: item.name,
    variant: item.variant,
    quantity: item.quantity,
    price: item.price,
    imageSrc: item.imageSrc,
  }));

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    setIsSubmitting(true);

    try {
      const checkoutPayload = {
        customerId: user?._id, // Extracted directly from context provider state properties
        paymentMethod: paymentMethod,
        shippingInfo: shippingInfo,
        orderItems: items.map((item: any) => {
          // Fallback extraction: Ensures database 24-character ObjectId is passed
          const trueProductId = item._id || item.databaseId || item.id;

          return {
            productId: trueProductId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.imageSrc || "",
            category: item.category || "",
          };
        }),
      };

      // Calls endpoint matching base dynamic URLs routes definitions
      const response = await axiosInstance.post("/orders/", checkoutPayload);
      console.log("Checkout submission response:", response.data);
      const { success, gatewayData } = response.data;

      if (success) {
        // Clear active client-side cart states immediately upon validation completion
        clearCart();

        if (paymentMethod === "COD") {
          router.push("/checkout/success");
        } else {
          // Handle payment gateway url routing structures fallback checks
          const checkoutUrl =
            gatewayData?.checkoutUrl ||
            gatewayData?.paymentUrl ||
            gatewayData?.redirectUrl;

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            throw new Error(
              "Payment gateway failed to provide a valid checkout session URL.",
            );
          }
        }
      }
    } catch (error: any) {
      console.error("Checkout submission processing halted:", error);
      alert(
        error.response?.data?.message ||
          "An unexpected error occurred while placing your order. Please check your fields and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Initial Authentication Lifecycle Verification Spinner UI
  if (authLoading) {
    return (
      <div className="w-full bg-[#fcf9f6] min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="text-xs text-zinc-500 font-light mt-4 tracking-widest uppercase">
          Verifying Session...
        </p>
      </div>
    );
  }

  // Soft fallback layout block wrapper preventing render flickers during redirection cycles
  if (!isAuthenticated) return null;

  // 2. Empty Cart State Fallback View UI
  if (items.length === 0) {
    return (
      <div className="w-full bg-[#fcf9f6] min-h-screen flex flex-col items-center justify-center pb-24 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#f5efe9] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-7 h-7 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-serif text-zinc-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-zinc-500 font-light mb-8">
            Add some products before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-[#312117] text-white text-xs font-semibold tracking-widest uppercase rounded-md hover:bg-[#473224] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // 3. Main Form Context Layout holding single nested form submit pipeline tracking components
  return (
    <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 pb-24">
      <CheckoutSteps />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleCheckoutSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start"
        >
          {/* Form Fields UI wrappers */}
          <div className="lg:col-span-2 space-y-12">
            <ShippingForm data={shippingInfo} onChange={setShippingInfo} />

            <PaymentForm
              method={paymentMethod}
              onMethodChange={setPaymentMethod}
              cardInfo={cardInfo}
              onCardInfoChange={setCardInfo}
            />
          </div>

          {/* Cart Sidebar Order Summary UI containing single button trigger */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={checkoutItems}
              subtotal={totalPrice}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
