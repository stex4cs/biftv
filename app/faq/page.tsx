import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ · Često postavljana pitanja",
  description:
    "Sve što treba da znaš o BIF.TV pasovima, plaćanju, gledanju i tehničkim zahtevima.",
  alternates: { canonical: "/faq" },
};

type QA = { q: string; a: string };

const QUESTIONS: { section: string; items: QA[] }[] = [
  {
    section: "Kupovina i pristup",
    items: [
      {
        q: "Kako da kupim pass za BIF događaj?",
        a: "Otvori stranicu događaja na BIF.TV, klikni 'Live pass' ili 'Replay pass' dugme, unesi email i plati karticom. Watch link stiže odmah u inbox.",
      },
      {
        q: "Koliko košta pass?",
        a: "Cene se razlikuju po događaju i tipu pass-a. Live pass je obično od €9, replay pass od €5, a bundle (live + 48h replay) je od €12. Tačne cene su navedene na stranici svakog događaja.",
      },
      {
        q: "Koje načine plaćanja prihvatate?",
        a: "Visa, Mastercard, Maestro, Dina kartice. Plaćanje ide kroz ovlašćenog procesora — BIF.TV ne čuva podatke o kartici.",
      },
      {
        q: "Mogu li da kupim pass kao poklon nekom drugom?",
        a: "Za sada ne — pass se vezuje za email koji unese kupac. Funkcija gift pass-a stiže uskoro.",
      },
    ],
  },
  {
    section: "Gledanje stream-a",
    items: [
      {
        q: "Kako da otvorim stream koji sam platio/la?",
        a: "Imaš dva načina: (1) klikni link iz email-a koji ti je stigao posle kupovine, ili (2) prijavi se na biftv.vercel.app/login i otvori 'My Passes' — vidiš sve svoje pasove i klikneš 'Gledaj'.",
      },
      {
        q: "Na kojim uređajima mogu da gledam?",
        a: "Svaki moderan browser na telefonu, tabletu, laptop-u ili Smart TV-u sa Chrome/Safari browser-om. Player podržava Chromecast i AirPlay za prebacivanje na TV.",
      },
      {
        q: "Da li mogu istovremeno da gledam na više uređaja?",
        a: "Pass radi na jednom uređaju u datom trenutku. Kad otvoriš stream na laptopu pa prebaciš na telefon, prethodna sesija se zatvara. Možeš da prebacuješ slobodno, ali ne više od 10 puta u 24h.",
      },
      {
        q: "Kolika je preporučena brzina interneta?",
        a: "Za HD (720p): minimum 5 Mbps. Za Full HD (1080p): 10 Mbps. Mobilni 4G/5G je dovoljan. Player automatski bira najbolji kvalitet za tvoju vezu.",
      },
      {
        q: "Stream se prekida ili buffer-uje. Šta da radim?",
        a: "Probaj: (1) refresh stranice, (2) pređi sa Wi-Fi na mobilni data ili obrnuto, (3) zatvori ostale tab-ove, (4) koristi Chrome ili Safari (Firefox ponekad ima problem sa HLS-om). Ako ništa ne pomaže, javi nam kroz contact stranicu.",
      },
    ],
  },
  {
    section: "Replay i VOD",
    items: [
      {
        q: "Mogu li da gledam replay posle event-a?",
        a: "Live pass uključuje 48h besplatnog replay-a posle završetka event-a. Za duži pristup kupi posebno replay pass ili bundle pass.",
      },
      {
        q: "Kada postaje replay dostupan?",
        a: "Replay je automatski dostupan ~5 minuta nakon kraja live emitovanja. Email obaveštenje stiže kada postane spreman.",
      },
      {
        q: "Mogu li da pauziram ili premotam replay?",
        a: "Da, replay ima sve standardne kontrole: play, pauza, premotavanje, full screen, brzina reprodukcije.",
      },
    ],
  },
  {
    section: "Tehnički problemi i refundacije",
    items: [
      {
        q: "Stream ne radi tokom event-a — imam li pravo na povraćaj?",
        a: "Ako problem traje duže od 30 minuta zbog naših servera, imaš pravo na delimičnu ili punu refundaciju. Javi nam odmah preko contact stranice sa detaljima.",
      },
      {
        q: "Predomislio/la sam se — mogu li da otkažem pass?",
        a: "Da, pre nego što event počne. Posle početka stream-a refundacija nije moguća (EU zakon o digitalnom sadržaju). Detalji su u Terms of Service.",
      },
      {
        q: "Event je otkazan/odložen.",
        a: "Ako se event otkaže ili odloži za više od 30 dana, dobijaš pun automatski povraćaj u roku od 14 dana.",
      },
      {
        q: "Izgubio/la sam pristup email-u — kako da uđem u nalog?",
        a: "Javi nam preko contact stranice sa detaljima o kupovini (datum, iznos, poslednje 4 cifre kartice). Posle verifikacije prebacujemo pass na novi email.",
      },
    ],
  },
  {
    section: "Privatnost i bezbednost",
    items: [
      {
        q: "Da li delite moje podatke sa trećim licima?",
        a: "Ne prodajemo podatke. Procesori koje koristimo (Supabase, Mux, AltaPay, Resend) su navedeni u Privacy Policy. Imaju ugovorne klauzule o zaštiti podataka.",
      },
      {
        q: "Mogu li da obrišem nalog i podatke?",
        a: "Da, u svakom trenutku. Javi nam preko contact stranice sa naslovom 'GDPR delete request'. Brišemo sve podatke u roku od 30 dana, osim onih koje moramo da čuvamo po poreskom zakonu (računi: 10 godina).",
      },
      {
        q: "Kako BIF.TV sprečava deljenje pass-a?",
        a: "Stream URL-ovi su potpisani sa kratkim isticanjem. Pass je vezan za uređaj. Email watermark se prikazuje preko video-a tokom celog gledanja. Auto-revoke ako se detektuje deljenje sa više IP lokacija istovremeno.",
      },
    ],
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    ),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            HELP CENTER
          </div>
          <h1 className="font-oswald text-4xl font-extrabold uppercase tracking-wider md:text-5xl">
            Često postavljana pitanja
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Ne nalaziš odgovor? Pošalji pitanje na{" "}
            <a href="/contact" className="text-bif-gold underline">
              contact stranicu
            </a>
            .
          </p>
        </div>

        <div className="space-y-10">
          {QUESTIONS.map((section) => (
            <section key={section.section}>
              <h2 className="mb-4 font-oswald text-2xl font-extrabold uppercase tracking-wider text-bif-gold">
                {section.section}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl border border-white/10 bg-[#0d0d0d] px-5 py-4 transition hover:border-white/20"
                  >
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-white">
                          {item.q}
                        </h3>
                        <span className="mt-1 text-bif-red transition-transform group-open:rotate-45">
                          +
                        </span>
                      </div>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
