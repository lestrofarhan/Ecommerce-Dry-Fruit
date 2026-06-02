// app/(auth)/signup/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Leaf, Globe } from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          agreeToTerms: false,
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: unknown) {
      let errorMessage = "An error occurred during signup";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Editorial Heritage Banner with Embedded Copy */}
      <div className="relative hidden md:flex flex-col justify-end p-12 lg:p-16 text-white bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/signup-img.png" // Path to your shilajeet/resin image
            alt="Authentic botanical minerals and raw alchemical elements"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-50 filter brightness-90"
          />
          {/* Linear bottom dark gradient shade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Floating Typography Copy */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-serif tracking-wide mb-3">
            Heritage of Purity
          </h2>
          <p className="text-xs text-zinc-300 font-light leading-relaxed">
            Join our circle of wellness and experience the uncompromised rituals
            of ancient alchemy.
          </p>
        </div>
      </div>

      {/* Right Column: Expanded Signup Form Panel */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-[#fcf9f6] py-12">
        <div className="max-w-md w-full mx-auto flex flex-col h-full justify-between">
          <div className="w-full">
            <header className="mb-8">
              <h1 className="text-3xl font-serif text-zinc-900 tracking-wide mb-2">
                Create Account
              </h1>
              <p className="text-sm text-zinc-500 font-light">
                Begin your journey to conscious vitality.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                  {success}
                </div>
              )}
              {[
                {
                  label: "First Name",
                  type: "text",
                  key: "firstName",
                  placeholder: "Alexander",
                },
                {
                  label: "Last Name",
                  type: "text",
                  key: "lastName",
                  placeholder: "Vance",
                },
                {
                  label: "Email Address",
                  type: "email",
                  key: "email",
                  placeholder: "alex@domain.com",
                },
                {
                  label: "Password",
                  type: "password",
                  key: "password",
                  placeholder: "••••••••",
                },
              ].map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col border-b border-zinc-300 py-1.5 focus-within:border-zinc-800 transition-colors duration-200"
                >
                  <label className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    disabled={loading}
                    placeholder={field.placeholder}
                    value={String(formData[field.key as keyof typeof formData])}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              ))}

              {/* Terms and Privacy Checkbox option */}
              <label className="flex items-start gap-3 text-[11px] font-light text-zinc-500 cursor-pointer pt-2 select-none">
                <input
                  type="checkbox"
                  required
                  disabled={loading}
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeToTerms: e.target.checked })
                  }
                  className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 bg-white text-amber-800 accent-[#413126] focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="underline hover:text-zinc-900">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline hover:text-zinc-900"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-[#413126] text-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-[#534033] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"} {!loading && <span>→</span>}
              </button>
            </form>

            <footer className="mt-8 text-center text-xs text-zinc-600 font-light">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-zinc-900 hover:underline"
              >
                Log In
              </Link>
            </footer>
          </div>

          {/* Bottom Footprint Badges matching your layout mock */}
          <div className="mt-12 pt-6 border-t border-zinc-200/60 grid grid-cols-3 gap-2">
            {[
              { icon: <Award className="w-3.5 h-3.5" />, text: "Lab Tested" },
              { icon: <Leaf className="w-3.5 h-3.5" />, text: "100% Organic" },
              {
                icon: <Globe className="w-3.5 h-3.5" />,
                text: "Ethically Sourced",
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-bold uppercase tracking-wider justify-center md:justify-start"
              >
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
