// app/(shop)/cart/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShieldCheck } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "stone-pressed-walnut-oil",
    name: "Stone-Pressed Walnut Oil",
    variant: "250ml Premium Glass Bottle",
    price: 42.0,
    quantity: 1,
    imageSrc: "/cart-page-pic.jpg", // Reusing your premium fluid assets placeholder
  },
  {
    id: "sun-dried-himalayan-apricots",
    name: "Sun-Dried Himalayan Apricots",
    variant: "500g Biodegradable Pouch",
    price: 28.0, // $28.00 * 2 = $56.00 shown in your exact selection snapshot
    quantity: 2,
    imageSrc: "/cart-page-pic.jpg",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  // Core functional state calculations
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full bg-[#fcf9f6] min-h-screen text-zinc-900 pb-24">
      {/* Upper Tracker Bar: Structural Multi-Step Checkout Breadcrumbs */}
      <nav
        className="w-full border-b border-zinc-200/60 py-6 bg-white/40"
        aria-label="Checkout Progress"
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-6 sm:gap-8 text-[11px] font-semibold tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2 text-zinc-900">
            <span>01</span>
            <span className="border-b-2 border-zinc-900 pb-1">Cart</span>
          </div>
          <span className="text-zinc-300 font-light">—</span>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>02</span>
            <span>Checkout</span>
          </div>
          <span className="text-zinc-300 font-light">—</span>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>03</span>
            <span>Success</span>
          </div>
        </div>
      </nav>

      {/* Main Core Form Content Stack Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-900 mb-8">
          Your Selection
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-xl border border-dashed border-zinc-200">
            <p className="text-zinc-500 font-light text-sm mb-6">
              Your shopping selections cart is empty.
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#312117] text-white text-xs font-semibold tracking-widest uppercase rounded-md hover:bg-[#473224] transition-colors"
            >
              Continue Sourcing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
            {/* Left Column Stack: Interactive Item Rows */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-100 shadow-xs hover:shadow-md transition-all duration-300 flex gap-4 sm:gap-6 relative"
                >
                  {/* Media Snapshot Wrapper */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Core Information Details Panel */}
                  <div className="flex flex-col sm:flex-row sm:justify-between flex-grow pt-1 gap-4">
                    <div className="space-y-1 max-w-sm">
                      <h2 className="font-serif text-base sm:text-lg text-zinc-900 tracking-wide leading-snug">
                        {item.name}
                      </h2>
                      <p className="text-xs text-zinc-400 font-light">
                        {item.variant}
                      </p>

                      {/* Quantity Action Controls */}
                      <div className="flex items-center border border-zinc-200 rounded bg-[#fcf9f6] w-fit shadow-2xs mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease quantity for ${item.name}`}
                          className="px-2.5 py-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium w-6 text-center select-none text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                          className="px-2.5 py-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Extended Calculated Row Pricing Information */}
                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-end items-end shrink-0">
                      <span className="font-serif text-base sm:text-lg font-medium text-zinc-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Absolute Top-Right Positioned Line Item Clear Trigger Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} item from selections basket`}
                    className="absolute top-4 right-4 p-1 text-zinc-300 hover:text-zinc-600 transition-colors rounded-full hover:bg-zinc-50"
                  >
                    <X className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column Panel Sidebar: Pricing Ledger Summary Widget */}
            <div className="bg-[#f5efe9]/70 rounded-xl p-6 sm:p-8 border border-zinc-200/40 sticky top-6">
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 pb-6 border-b border-zinc-200/60 text-xs sm:text-sm">
                <div className="flex justify-between font-light text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline font-light text-zinc-600">
                  <span>Shipping</span>
                  <span className="text-[11px] font-medium text-[#869F5C]  py-0.5 rounded-full uppercase tracking-wider">
                    Calculated next
                  </span>
                </div>
              </div>

              {/* Total Aggregate Sum Indicator row */}
              <div className="flex justify-between items-baseline pt-6 mb-8">
                <span className="font-serif text-lg text-zinc-950">Total</span>
                <span className="font-serif text-2xl font-semibold text-zinc-950">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Final Transaction Trigger Execution CTA Button */}
              <Link href="/checkout">
                <button className="w-full py-4 bg-[#312117] hover:bg-[#432f22] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition-all duration-200 active:scale-99 mb-4">
                  Proceed to Checkout
                </button>
              </Link>

              {/* Secure Trust Footnote element banner */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-light text-zinc-400 text-center max-w-xs mx-auto leading-normal">
                <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0" />
                <span>
                  Secure checkout powered by Pure Provenance Trust Network
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
