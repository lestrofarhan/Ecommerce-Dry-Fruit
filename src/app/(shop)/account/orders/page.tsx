// app/(shop)/account/orders/page.tsx
"use client";

import { useState } from "react";
import { OrderCard, PastOrder } from "@/components/cards/OrderCard";

const MOCK_PAST_ORDERS: PastOrder[] = [
  {
    id: "himalayan-shilajeet-1",
    name: "Himalayan Shilajeet Resin",
    price: 120,
    dateOrdered: "Sept 12, 2024",
    status: "Delivered",
    imageSrc: "/order-card-pic.png",
  },
  {
    id: "iranian-v-almonds",
    name: "Iranian v Almonds",
    price: 45,
    dateOrdered: "Aug 28, 2024",
    status: "Delivered",
    imageSrc: "/order-card-pic.png",
  },
  {
    id: "himalayan-shilajeet-2",
    name: "Himalayan Shilajeet Resin",
    price: 120,
    dateOrdered: "Sept 12, 2024",
    status: "Delivered",
    imageSrc: "/order-card-pic.png",
  },
];

export default function CustomerOrdersPage() {
  const [orders] = useState<PastOrder[]>(MOCK_PAST_ORDERS);

  return (
          <main className="md:col-span-9 lg:col-span-9 space-y-6">
            <h2 className="text-xl font-serif text-zinc-900 tracking-wide text-left pb-1.5">
              Past Orders
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {orders.map((order, idx) => (
                <OrderCard
                  key={`${order.id}-${idx}`}
                  order={order}
                  onViewDetails={(id) =>
                    console.log(`Details frame for order: ${id}`)
                  }
                  onBuyAgain={(id) =>
                    console.log(
                      `Adding item: ${id} to checkout dispatch pipeline`,
                    )
                  }
                />
              ))}
            </div>

            <div className="pt-4">
              <button className="w-full py-3 bg-transparent hover:bg-white border border-dashed border-zinc-300 rounded-lg text-zinc-500 hover:text-zinc-800 text-xs tracking-wide transition-all duration-150">
                View 14 older orders
              </button>
            </div>
          </main>
  );
}
