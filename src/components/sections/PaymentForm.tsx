// components/checkout/payment-form.tsx
import { CreditCard, Truck, Smartphone, Wallet } from "lucide-react";

export type PaymentMethod = "Stripe" | "JazzCash" | "EasyPaisa" | "COD";

interface CardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface PaymentFormProps {
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  cardInfo: CardData;
  onCardInfoChange: (data: CardData) => void;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "Stripe",
    label: "Credit / Debit Card",
    subtitle: "Visa, MasterCard, Amex — powered by Stripe",
    icon: <CreditCard className="w-4 h-4 text-zinc-500 stroke-[1.5]" />,
  },
  {
    id: "JazzCash",
    label: "JazzCash",
    subtitle: "Pay securely via JazzCash mobile wallet",
    icon: <Smartphone className="w-4 h-4 text-zinc-500 stroke-[1.5]" />,
  },
  {
    id: "EasyPaisa",
    label: "EasyPaisa",
    subtitle: "Pay securely via EasyPaisa mobile wallet",
    icon: <Wallet className="w-4 h-4 text-zinc-500 stroke-[1.5]" />,
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    subtitle: "Pay when your package arrives at your door",
    icon: <Truck className="w-4 h-4 text-zinc-500 stroke-[1.5]" />,
  },
];

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
        {PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
              method === option.id
                ? "bg-white border-zinc-800 ring-1 ring-zinc-800"
                : "bg-white/60 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                checked={method === option.id}
                onChange={() => onMethodChange(option.id)}
                className="w-4 h-4 accent-[#312117] cursor-pointer"
              />
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-light hidden sm:inline">
              {option.subtitle}
            </span>
          </label>
        ))}
      </div>

      {/* Stripe card fields — only visible when Stripe is selected */}
      {method === "Stripe" && (
        <div className="p-6 bg-[#f5efe9]/40 border border-zinc-200/60 rounded-xl space-y-5">
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

      {/* JazzCash instruction panel */}
      {method === "JazzCash" && (
        <div className="p-5 bg-[#f5efe9]/40 border border-zinc-200/60 rounded-xl">
          <p className="text-xs text-zinc-600 font-light leading-relaxed">
            You will be redirected to the <strong className="font-semibold text-zinc-800">JazzCash</strong> payment gateway to complete your purchase securely. Please have your JazzCash mobile wallet ready.
          </p>
        </div>
      )}

      {/* EasyPaisa instruction panel */}
      {method === "EasyPaisa" && (
        <div className="p-5 bg-[#f5efe9]/40 border border-zinc-200/60 rounded-xl">
          <p className="text-xs text-zinc-600 font-light leading-relaxed">
            You will be redirected to the <strong className="font-semibold text-zinc-800">EasyPaisa</strong> payment gateway to complete your purchase securely. Please have your EasyPaisa mobile wallet ready.
          </p>
        </div>
      )}

      {/* COD confirmation note */}
      {method === "COD" && (
        <div className="p-5 bg-[#e2f0d9]/30 border border-[#b7d4a0]/50 rounded-xl">
          <p className="text-xs text-zinc-600 font-light leading-relaxed">
            Your order will be delivered to your address and payment collected at the doorstep. Please keep the <strong className="font-semibold text-zinc-800">exact amount</strong> ready at the time of delivery.
          </p>
        </div>
      )}
    </div>
  );
}
