import Link from "next/link";
import { supabaseUser } from "@/lib/supabase-user";
import HeaderNav from "./HeaderNav";

export async function Header() {
  const supabase = supabaseUser();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="relative z-30 border-b border-white/5 backdrop-blur-md bg-black/40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-oswald font-extrabold uppercase text-2xl tracking-wider text-white"
            style={{ letterSpacing: "0.08em" }}
          >
            BIF<span className="text-bif-red">.</span>TV
          </span>
        </Link>
        <HeaderNav signedIn={!!user} />
      </div>
    </header>
  );
}
