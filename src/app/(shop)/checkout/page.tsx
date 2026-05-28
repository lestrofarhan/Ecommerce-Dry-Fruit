// app/(shop)/checkout/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { CheckoutSteps } from "@/components/sections/CheckoutSteps";
import { ShippingForm } from "@/components/sections/ShippingForm";
import { PaymentForm } from "@/components/sections/PaymentForm";
import {
  OrderSummary,
  CheckoutProduct,
} from "@/components/sections/CheckoutOrderSummary";

const ORDER_ITEMS: CheckoutProduct[] = [
  {
    name: "Premium Almonds",
    variant: "500g Ritual Pack",
    quantity: 1,
    price: 24.0,
    imageSrc: "/checkout-product-pic.jpg",
  },
  {
    name: "Pure Shilajeet Resin",
    variant: "30g Himalayan Origin",
    quantity: 1,
    price: 48.0,
    imageSrc: "/checkout-product-pic.jpg",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleCompletePurchase = (e: FormEvent) => {
    e.preventDefault();
    console.log("Dispatching Secure Gateway Checkout Payload Token...", {
      shippingInfo,
      paymentMethod,
      cardInfo,
    });
  };

  const subtotal = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 pb-24">
      {/* 1. Progress Step Visual Tracker Badge Banner */}
      <CheckoutSteps />

      {/* Main Container Workspace Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleCompletePurchase}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start"
        >
          {/* Form Stack Controls Deck Frame (Left) */}
          <div className="lg:col-span-2 space-y-12">
            {/* 2. Structured Shipping Fields Box */}
            <ShippingForm data={shippingInfo} onChange={setShippingInfo} />

            {/* 3. Safe Processing Selector Area */}
            <PaymentForm
              method={paymentMethod}
              onMethodChange={setPaymentMethod}
              cardInfo={cardInfo}
              onCardInfoChange={setCardInfo}
            />
          </div>

          {/* Checkout Totals Ledger Frame Column (Right) */}
          <div className="lg:col-span-1">
            {/* 4. Interactive Calculated Summary Frame */}
            <OrderSummary items={ORDER_ITEMS} subtotal={subtotal} />
          </div>
        </form>
      </main>
    </div>
  );
}
