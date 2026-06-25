import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 text-center">
          <h1 className="font-oswald font-extrabold text-3xl uppercase mb-2">
            Sign in
          </h1>
          <p className="text-white/60 mb-8">
            Enter the email you used to buy your pass — we'll send you a magic
            link.
          </p>

          <form className="space-y-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-bif-red"
            />
            <button
              type="button"
              disabled
              className="w-full font-oswald font-extrabold uppercase tracking-widest bg-gradient-to-br from-bif-red to-bif-red-dark text-white px-8 py-3 rounded-xl border border-bif-gold/40 opacity-60 cursor-not-allowed"
              title="Supabase magic link coming next"
            >
              Send magic link (Supabase — coming)
            </button>
          </form>

          <p className="text-xs text-white/40 mt-6">
            No account needed — your access lives on the email used at purchase.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
