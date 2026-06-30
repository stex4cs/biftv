import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt · Contact",
  description:
    "Kontaktiraj BIF.TV tim za podršku, partnerstva ili pravna pitanja.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            CONTACT
          </div>
          <h1 className="font-oswald text-4xl font-extrabold uppercase tracking-wider md:text-5xl">
            Pošalji poruku
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Odgovaramo na sve poruke u roku od 48h. Za hitne probleme tokom
            live event-a (stream ne radi), pratiš Kick chat:{" "}
            <a
              href="https://kick.com/bifevents"
              className="text-bif-gold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              kick.com/bifevents
            </a>
            .
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          <aside className="space-y-6 text-sm">
            <Box label="PODRŠKA" desc="Tehnička pitanja, problemi sa stream-om">
              <a
                href="mailto:support@biftv.events"
                className="text-bif-gold underline break-all"
              >
                support@biftv.events
              </a>
            </Box>
            <Box label="PARTNERSTVA" desc="Sponzorstvo, integracije">
              <a
                href="mailto:partners@biftv.events"
                className="text-bif-gold underline break-all"
              >
                partners@biftv.events
              </a>
            </Box>
            <Box label="PRESS" desc="Mediji, intervjui">
              <a
                href="mailto:press@biftv.events"
                className="text-bif-gold underline break-all"
              >
                press@biftv.events
              </a>
            </Box>
            <Box label="GDPR" desc="Pristup podacima, brisanje naloga">
              <a
                href="mailto:privacy@biftv.events"
                className="text-bif-gold underline break-all"
              >
                privacy@biftv.events
              </a>
            </Box>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Box({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
      <div className="mb-1 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
        {label}
      </div>
      <p className="mb-2 text-xs text-white/50">{desc}</p>
      {children}
    </div>
  );
}
