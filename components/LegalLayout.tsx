import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LegalLayout({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow?: string;
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          {eyebrow ? (
            <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-oswald text-4xl font-extrabold uppercase tracking-wider md:text-5xl">
            {title}
          </h1>
          {updatedAt ? (
            <p className="mt-3 text-xs text-white/40">
              Poslednja izmena: {updatedAt}
            </p>
          ) : null}
        </div>
        <article className="legal-prose space-y-6 text-sm leading-relaxed text-white/75">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
