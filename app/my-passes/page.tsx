import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabaseUser } from "@/lib/supabase-user";
import { supabaseAdmin } from "@/lib/supabase-server";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type EnrichedPass = {
  token: string;
  pass_type: "live" | "vod" | "bundle";
  expires_at: string;
  revoked: boolean;
  event: {
    title: string;
    slug: string;
    status: string;
    date: string;
    poster_url: string | null;
  };
};

async function loadPasses(email: string): Promise<EnrichedPass[]> {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("access_tokens")
    .select(
      "token, pass_type, expires_at, revoked, event_id, events(title, slug, status, date, poster_url)",
    )
    .eq("user_email", email.toLowerCase())
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    token: row.token,
    pass_type: row.pass_type,
    expires_at: row.expires_at,
    revoked: row.revoked,
    event: (row.events as unknown as EnrichedPass["event"]) ?? {
      title: "—",
      slug: "",
      status: "ended",
      date: row.expires_at,
      poster_url: null,
    },
  }));
}

export default async function MyPassesPage() {
  const supabase = supabaseUser();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/my-passes");

  const passes = await loadPasses(user.email ?? "");
  const now = Date.now();
  const active = passes.filter(
    (p) => !p.revoked && new Date(p.expires_at).getTime() > now,
  );
  const inactive = passes.filter(
    (p) => p.revoked || new Date(p.expires_at).getTime() <= now,
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              MY ACCOUNT
            </div>
            <h1 className="font-oswald text-3xl font-extrabold uppercase tracking-wider md:text-4xl">
              Moji pasovi
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Prijavljen kao{" "}
              <span className="text-bif-gold">{user.email}</span>
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-4 py-2 font-oswald text-sm font-bold uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>

        {active.length === 0 && inactive.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Section title="Aktivni pasovi" passes={active} />
            {inactive.length > 0 ? (
              <Section title="Stari" passes={inactive} faded />
            ) : null}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  passes,
  faded = false,
}: {
  title: string;
  passes: EnrichedPass[];
  faded?: boolean;
}) {
  if (passes.length === 0) return null;
  return (
    <section className={`mb-10 ${faded ? "opacity-60" : ""}`}>
      <h2 className="mb-4 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {passes.map((p) => (
          <PassCard key={p.token} pass={p} />
        ))}
      </div>
    </section>
  );
}

function PassCard({ pass }: { pass: EnrichedPass }) {
  const expDate = formatEventDate(pass.expires_at);
  const now = Date.now();
  const expired = new Date(pass.expires_at).getTime() <= now;
  const watchable = !pass.revoked && !expired;
  const isLive = pass.event.status === "live";
  const isVod = pass.event.status === "vod";

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#161616] to-[#0d0d0d]">
      {pass.event.poster_url ? (
        <div className="relative h-32 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pass.event.poster_url}
            alt={pass.event.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-bif-red">
            {pass.pass_type}
          </span>
          {isLive ? (
            <span className="rounded-full border border-red-500/40 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
              ● LIVE
            </span>
          ) : null}
          {isVod ? (
            <span className="rounded-full border border-bif-gold/30 bg-bif-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bif-gold">
              REPLAY
            </span>
          ) : null}
        </div>
        <h3 className="font-oswald text-xl font-extrabold uppercase tracking-wider">
          {pass.event.title}
        </h3>
        <p className="mt-1 text-xs text-white/50">
          {pass.revoked
            ? "Opozvan"
            : expired
              ? `Istekao ${expDate.day}.${pass.expires_at.slice(5, 7)}.${expDate.year}`
              : `Važi do ${expDate.day}.${pass.expires_at.slice(5, 7)}.${expDate.year}`}
        </p>

        <div className="mt-4">
          {watchable ? (
            <Link
              href={`/watch/${pass.token}`}
              className="inline-flex items-center gap-2 rounded-lg bg-bif-red px-4 py-2 font-oswald text-sm font-bold uppercase tracking-wider text-white hover:bg-bif-red/90"
            >
              ▶ Gledaj
            </Link>
          ) : (
            <span className="text-xs text-white/40">Pass nije više aktivan</span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-12 text-center">
      <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
        PRAZNO
      </div>
      <h2 className="mb-4 font-oswald text-2xl font-extrabold uppercase tracking-wider">
        Još nemaš pasove
      </h2>
      <p className="mx-auto mb-6 max-w-md text-sm text-white/60">
        Kad kupiš pristup za BIF event, pojaviće se ovde sa dugmetom za
        gledanje. Replay-evi ostaju do datuma isteka.
      </p>
      <Link
        href="/events"
        className="inline-flex items-center gap-2 rounded-lg bg-bif-red px-6 py-3 font-oswald text-sm font-bold uppercase tracking-wider text-white hover:bg-bif-red/90"
      >
        ▶ Pogledaj događaje
      </Link>
    </div>
  );
}
