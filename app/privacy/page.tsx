import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politika privatnosti · Privacy Policy",
  description:
    "Kako BIF.TV prikuplja, koristi i štiti tvoje podatke. GDPR-saglasna politika privatnosti.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "26. jun 2026.";

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="LEGAL"
      title="Politika privatnosti"
      updatedAt={UPDATED}
    >
      <p>
        Ova politika opisuje kako BIF.TV prikuplja, koristi, deli i štiti tvoje
        lične podatke. Saglasna je sa Zakonom o zaštiti podataka o ličnosti
        Republike Srbije i Uredbom EU 2016/679 (GDPR).
      </p>

      <h2>1. Rukovalac podacima</h2>
      <p>
        BIF.TV (&ldquo;Rukovalac&rdquo;) — kontakt:{" "}
        <a href="/contact">contact stranica</a>. Za GDPR upite koristi naslov
        &ldquo;GDPR request&rdquo;.
      </p>

      <h2>2. Koje podatke prikupljamo</h2>
      <h3>2.1 Podaci koje sam unosiš</h3>
      <ul>
        <li>
          <strong>Email adresa</strong> — za prijavu (magic link), kupovinu i
          komunikaciju.
        </li>
        <li>
          <strong>Podaci o plaćanju</strong> — obrađuje ovlašćeni procesor
          plaćanja (AltaPay). Mi <strong>NE skladištimo brojeve kartica</strong>;
          čuvamo samo ID transakcije i status.
        </li>
        <li>
          <strong>Sadržaj poruka</strong> — ako nas kontaktiraš kroz formular.
        </li>
      </ul>

      <h3>2.2 Podaci koje sistem prikuplja automatski</h3>
      <ul>
        <li>
          <strong>IP adresa, user-agent, device ID</strong> — za bezbednost
          (anti-piracy, sprečavanje deljenja, detekcija zloupotrebe).
        </li>
        <li>
          <strong>Heartbeat sesije</strong> — kada gledaš stream, šaljemo
          periodični signal serveru da se sesija održi.
        </li>
        <li>
          <strong>Analitika</strong> — anonimna posećenost (Google Analytics) i
          konverzije reklamnih kampanja (Meta Pixel). Učitavaju se samo ako si
          dao saglasnost preko cookie banner-a.
        </li>
      </ul>

      <h2>3. Svrha obrade</h2>
      <ul>
        <li>Pružanje Usluge (prijava, streaming, replay window).</li>
        <li>Obrada plaćanja i isporuka pass-a.</li>
        <li>Slanje transakcionih email-ova (potvrda kupovine, reminderi).</li>
        <li>
          Bezbednost: sprečavanje neovlašćenog deljenja pass-a, watermark, device
          limit.
        </li>
        <li>
          Marketing (samo uz saglasnost): newsletter, remarketing, lookalike
          audiences.
        </li>
        <li>Ispunjenje zakonskih obaveza (poreske evidencije, knjigovodstvo).</li>
      </ul>

      <h2>4. Pravni osnov</h2>
      <ul>
        <li>
          <strong>Izvršenje ugovora</strong> (čl. 6(1)(b) GDPR) — pristup
          plaćenom sadržaju i isporuka.
        </li>
        <li>
          <strong>Legitiman interes</strong> (čl. 6(1)(f)) — anti-piracy,
          detekcija prevara, osnovna analitika.
        </li>
        <li>
          <strong>Saglasnost</strong> (čl. 6(1)(a)) — marketing email-ovi, Meta
          Pixel i druge marketinške analitike.
        </li>
        <li>
          <strong>Zakonska obaveza</strong> (čl. 6(1)(c)) — čuvanje računa za
          poreske svrhe.
        </li>
      </ul>

      <h2>5. Kome šaljemo podatke (procesori)</h2>
      <p>
        Tvoji podaci se obrađuju kod sledećih ovlašćenih procesora, svi imaju
        ugovorne klauzule o zaštiti podataka:
      </p>
      <ul>
        <li>
          <strong>Supabase Inc.</strong> (SAD) — baza podataka, autentifikacija.
          GDPR-saglasan kroz Standard Contractual Clauses.
        </li>
        <li>
          <strong>Mux Inc.</strong> (SAD) — video streaming i playback.
        </li>
        <li>
          <strong>AltaPay</strong> — procesiranje plaćanja.
        </li>
        <li>
          <strong>Resend Inc.</strong> (SAD) — slanje transakcionih email-ova.
        </li>
        <li>
          <strong>Vercel Inc.</strong> (SAD) — hosting.
        </li>
        <li>
          <strong>Google LLC</strong> — Google Analytics (samo uz saglasnost).
        </li>
        <li>
          <strong>Meta Platforms Inc.</strong> — Meta Pixel (samo uz saglasnost).
        </li>
      </ul>

      <h2>6. Rok čuvanja</h2>
      <ul>
        <li>
          <strong>Email subscriberi:</strong> dok ne zatražiš brisanje.
        </li>
        <li>
          <strong>Podaci o nalozima i pass-evima:</strong> tokom aktivnog
          korišćenja + 24 meseca.
        </li>
        <li>
          <strong>Računi i podaci o transakcijama:</strong> 10 godina (zakonska
          obaveza poreskih evidencija).
        </li>
        <li>
          <strong>Logovi sesija (IP, device):</strong> 90 dana, zatim brisanje.
        </li>
        <li>
          <strong>Analitika:</strong> agregisani podaci, 26 meseci (default GA4).
        </li>
      </ul>

      <h2>7. Tvoja prava (GDPR)</h2>
      <p>U svakom trenutku imaš pravo na:</p>
      <ul>
        <li>pristup tvojim podacima i kopiju (čl. 15);</li>
        <li>ispravku netačnih podataka (čl. 16);</li>
        <li>brisanje (&ldquo;pravo da budeš zaboravljen&rdquo;, čl. 17);</li>
        <li>ograničavanje obrade (čl. 18);</li>
        <li>prenosivost podataka u strukturisan formatu (čl. 20);</li>
        <li>
          povlačenje saglasnosti za marketing u svakom trenutku (cookie banner →
          Prilagodi);
        </li>
        <li>
          podnošenje žalbe Povereniku za informacije od javnog značaja Republike
          Srbije ili nadležnoj EU instituciji.
        </li>
      </ul>
      <p>
        Da ostvariš ova prava, javi nam se na{" "}
        <a href="/contact">contact stranicu</a> sa naslovom &ldquo;GDPR
        request&rdquo;. Odgovaramo u roku od 30 dana.
      </p>

      <h2>8. Kolačići</h2>
      <p>
        Detalji koje kolačiće koristimo i opcije upravljanja su u cookie
        banner-u (dole desno) i u dva osnovna tipa:
      </p>
      <ul>
        <li>
          <strong>Neophodni</strong> — sesija, magic link login, anti-piracy
          device ID, payment flow. Bez ovih sajt ne radi.
        </li>
        <li>
          <strong>Analitika</strong> — Google Analytics.
        </li>
        <li>
          <strong>Marketing</strong> — Meta Pixel.
        </li>
      </ul>

      <h2>9. Sigurnost</h2>
      <p>
        Sve veze su šifrovane TLS-om (HTTPS). Database i storage su enkriptovani
        u mirovanju. Plaćanje koristi 3D Secure 2.0. Sesije su vezane za
        potpisane HTTP-only cookie-je. Stream URL-ovi su potpisani RS256 JWT-om
        sa kratkim trajanjem.
      </p>

      <h2>10. Maloletni</h2>
      <p>
        Usluga je namenjena isključivo osobama 18+. Ne prikupljamo svesno
        podatke maloletnih lica. Ako saznaš da je maloletno lice unelo svoj
        email, javi nam i odmah brišemo zapis.
      </p>

      <h2>11. Izmene politike</h2>
      <p>
        Materijalne izmene objavljujemo na ovoj stranici i, za korisnike sa
        nalogom, email obaveštenjem. Datum poslednje izmene je u zaglavlju.
      </p>
    </LegalLayout>
  );
}
