import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import { supabaseUser } from "@/lib/supabase-user";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const supabase = supabaseUser();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.next ?? "/my-passes");
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0a0c] to-[#0a0a0a] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              SIGN IN
            </div>
            <h1 className="font-oswald text-3xl font-extrabold uppercase tracking-wider">
              Otvori svoje pasove
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Unesi email — pošaljemo ti link za prijavu. Bez lozinke.
            </p>
          </div>

          <LoginForm initialError={searchParams.error} />
        </div>
      </main>
      <Footer />
    </>
  );
}
