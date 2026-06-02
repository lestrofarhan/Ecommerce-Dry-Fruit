// app/(auth)/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth", {
        email,
        password,
      });

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("authToken", response.data.token);
        
        // Save user data (optional)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setSuccess("Login successful! Redirecting...");
        
        // Reset form
        setEmail("");
        setPassword("");
        
        // Redirect to home page after 1 second
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err: unknown) {
      let errorMessage = "An error occurred during login";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Ambient Product Splash Banner */}
      <div className="relative hidden md:block bg-[#a28671]">
        <Image
          src="/login-img.png" // Path to your dates image
          alt="Premium dates and organic ingredients curated in a dark wooden bowl"
          fill
          priority
          sizes="50vw"
          className="object-cover mix-blend-multiply opacity-90"
        />
        {/* Soft edge vignette mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
      </div>

      {/* Right Column: Clean Auth Input Board */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-[#fcf9f6]">
        <div className="max-w-md w-full mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-serif text-zinc-900 tracking-wide mb-2">
              Welcome
            </h1>
            <p className="text-sm text-zinc-500 font-light">
              Please enter your details to access your account.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Email Field Group */}
            <div className="flex flex-col border-b border-zinc-300 py-2 focus-within:border-zinc-800 transition-colors duration-200">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field Group */}
            <div className="flex flex-col border-b border-zinc-300 py-2 focus-within:border-zinc-800 transition-colors duration-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-800/80 hover:text-amber-900 transition-colors font-light"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-300 tracking-widest focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Form Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-[#413126] text-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-[#534033] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"} {!loading && <span>→</span>}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <footer className="mt-12 text-center text-xs text-zinc-600 font-light">
            New to Aureum Naturals?{" "}
            <Link
              href="/signup"
              className="font-semibold text-zinc-900 hover:underline"
            >
              Create an Account
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
