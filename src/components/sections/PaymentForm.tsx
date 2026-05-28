// components/checkout/payment-form.tsx
import { CreditCard, Truck } from "lucide-react";

interface CardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface PaymentFormProps {
  method: "card" | "cod";
  onMethodChange: (method: "card" | "cod") => void;
  cardInfo: CardData;
  onCardInfoChange: (data: CardData) => void;
}

export function PaymentForm({
  method,
  onMethodChange,
  cardInfo,
  onCardInfoChange,
}: PaymentFormProps) {
  const updateCardField = (field: keyof CardData, value: string) => {
    onCardInfoChange({ ...cardInfo, [field]: value });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 bg-[#312117] text-white rounded-full flex items-center justify-center font-serif text-xs">
          2
        </span>
        <h2 className="text-lg font-serif tracking-wide text-zinc-900">
          Payment Method
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        <label
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
            method === "card"
              ? "bg-white border-zinc-800 ring-1 ring-zinc-800"
              : "bg-white/60 border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment"
              checked={method === "card"}
              onChange={() => onMethodChange("card")}
              className="w-4 h-4 accent-[#312117] cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
              <CreditCard className="w-4 h-4 text-zinc-500 stroke-[1.5]" />
              <span>Credit or Debit Card</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-light hidden sm:inline">
            Secure checkout via Visa, MasterCard, Amex
          </span>
        </label>

        <label
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
            method === "cod"
              ? "bg-white border-zinc-800 ring-1 ring-zinc-800"
              : "bg-white/60 border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment"
              checked={method === "cod"}
              onChange={() => onMethodChange("cod")}
              className="w-4 h-4 accent-[#312117] cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
              <Truck className="w-4 h-4 text-zinc-500 stroke-[1.5]" />
              <span>Cash on Delivery</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-light hidden sm:inline">
            Pay when your ritual package arrives
          </span>
        </label>
      </div>

      {method === "card" && (
        <div className="p-6 bg-[#f5efe9]/40 border border-zinc-200/60 rounded-xl space-y-5 animate-fade-in">
          <div className="flex flex-col border-b border-zinc-300/80 py-1.5 focus-within:border-zinc-800 transition-colors">
            <label className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
              Card Number
            </label>
            <input
              type="text"
              required
              placeholder="0000 0000 0000 0000"
              value={cardInfo.cardNumber}
              onChange={(e) => updateCardField("cardNumber", e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 tracking-wider focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col border-b border-zinc-300/80 py-1.5 focus-within:border-zinc-800 transition-colors">
              <label className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
                Expiry
              </label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={cardInfo.expiry}
                onChange={(e) => updateCardField("expiry", e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 focus:outline-none"
              />
            </div>
            <div className="flex flex-col border-b border-zinc-300/80 py-1.5 focus-within:border-zinc-800 transition-colors">
              <label className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
                CVC
              </label>
              <input
                type="text"
                required
                placeholder="123"
                value={cardInfo.cvc}
                onChange={(e) => updateCardField("cvc", e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
