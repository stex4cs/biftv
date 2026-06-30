import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Uslovi korišćenja · Terms of Service",
  description:
    "Uslovi korišćenja BIF.TV platforme za live PPV streaming Balkan Influence Fighting događaja.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "26. jun 2026.";

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="LEGAL" title="Uslovi korišćenja" updatedAt={UPDATED}>
      <p>
        Ovi Uslovi korišćenja (&ldquo;Uslovi&rdquo;) regulišu korišćenje BIF.TV
        sajta i streaming usluge (&ldquo;Usluga&rdquo;). Pristupom ili korišćenjem
        Usluge prihvataš ove Uslove u celosti. Ako se ne slažeš sa bilo kojim
        delom, nemoj koristiti Uslugu.
      </p>

      <h2>1. Definicije</h2>
      <ul>
        <li>
          <strong>BIF.TV / Mi / Nas</strong> — platforma kojom upravlja BIF tim,
          dostupna preko biftv.vercel.app i povezanih domena.
        </li>
        <li>
          <strong>Korisnik / Ti</strong> — fizičko lice koje koristi Uslugu.
        </li>
        <li>
          <strong>Pass</strong> — pravo na pristup pojedinačnom događaju ili
          replay sadržaju u definisanom vremenskom prozoru.
        </li>
        <li>
          <strong>Sadržaj</strong> — live prenosi, replay video, slike, opisi i
          drugi materijali koji se prikazuju kroz Uslugu.
        </li>
      </ul>

      <h2>2. Uslovi pristupa</h2>
      <p>
        Usluga je namenjena osobama starijim od <strong>18 godina</strong>.
        Pristupom potvrđuješ da imaš najmanje 18 godina i da imaš pravnu
        sposobnost za sklapanje ugovora po važećim zakonima Republike Srbije.
      </p>

      <h2>3. Nalog i prijava</h2>
      <p>
        Prijava se vrši putem magic link mehanizma na tvoju email adresu. Ti si
        odgovoran/na za bezbednost svog inbox-a i ne smeš da deliš pristupne
        linkove sa trećim licima. Svaki pristup kroz tvoj email se smatra tvojim
        ovlašćenim pristupom.
      </p>

      <h2>4. Kupovina pass-a i isporuka</h2>
      <p>
        Kupovinom pass-a stupaš u ugovor o pristupu digitalnom sadržaju
        (streaming usluge). Posle uspešne uplate, link za gledanje se isporučuje
        odmah na email adresu kojom si izvršio/la kupovinu.
      </p>
      <p>
        Cene su iskazane u evrima (EUR) sa uračunatim PDV-om. Plaćanje se
        obrađuje preko ovlašćenog procesora plaćanja. BIF.TV ne čuva podatke o
        platnoj kartici.
      </p>

      <h2>5. Pravo na odustanak i refundacija</h2>
      <p>
        Saglasno Zakonu o zaštiti potrošača Republike Srbije i Direktivi EU
        2011/83/EU o digitalnom sadržaju:
      </p>
      <ul>
        <li>
          <strong>Pre početka emitovanja:</strong> imaš pravo na puni povraćaj
          ako otkažeš pass <strong>pre nego što događaj počne</strong>, ili u
          roku od 14 dana — što god nastupi ranije.
        </li>
        <li>
          <strong>Posle početka emitovanja:</strong> izričito prihvataš da
          isporuka digitalnog sadržaja počinje trenutkom kada se stream
          aktivira, čime gubiš pravo na povraćaj saglasno čl. 16(m) Direktive
          2011/83/EU i čl. 36 Zakona o zaštiti potrošača RS.
        </li>
        <li>
          <strong>Otkazivanje događaja od strane organizatora:</strong> ako se
          događaj otkaže ili odloži za više od 30 dana, dobijaš pun povraćaj
          automatski u roku od 14 dana.
        </li>
        <li>
          <strong>Tehnički problemi na našoj strani:</strong> ako stream ne
          funkcioniše više od 30 minuta tokom događaja zbog problema na našim
          serverima, imaš pravo na delimičnu ili punu refundaciju.
        </li>
      </ul>
      <p>
        Refundacije se obrađuju kroz isti kanal kojim je izvršena uplata, u roku
        od 14 dana od odobravanja zahteva.
      </p>

      <h2>6. Pravilo &bdquo;jedan uređaj&rdquo;</h2>
      <p>
        Pass je vezan za jedan uređaj koji prvi otvori stream. Sledeći uređaj sa
        istim pass-om može da preuzme sesiju — prethodna sesija se tada zatvara.
        Učestalo prebacivanje (više od 10 puta u 24h) ili pristup sa više
        različitih IP lokacija istovremeno se smatra zloupotrebom i može
        rezultirati automatskim opozivom pass-a bez refundacije.
      </p>

      <h2>7. Intelektualna svojina i zabrana deljenja</h2>
      <p>
        Sav Sadržaj na BIF.TV-u je zaštićen autorskim pravima i pripada
        organizatoru BIF događaja i njegovim partnerima. Strogo je zabranjeno:
      </p>
      <ul>
        <li>
          snimanje, preuzimanje ili reemitovanje stream-a bilo gde drugde
          (uključujući društvene mreže i druge platforme);
        </li>
        <li>
          deljenje pristupnog linka ili kredencijala sa trećim licima;
        </li>
        <li>
          komercijalna upotreba sadržaja (javno emitovanje u barovima,
          klubovima, kafićima) bez posebne licence;
        </li>
        <li>
          zaobilaženje tehničkih zaštita (signed URL-ovi, watermark, device
          limit);
        </li>
        <li>
          korišćenje automatizovanih alata, bot-ova ili scraper-a.
        </li>
      </ul>
      <p>
        Kršenje ovih pravila može rezultirati opozivom pass-a bez refundacije i
        eventualno pravnim postupkom.
      </p>

      <h2>8. Ograničenje odgovornosti</h2>
      <p>
        Usluga se pruža na principu &bdquo;kakva jeste&rdquo;. Ne garantujemo da
        će Usluga raditi bez prekida, posebno kada prekidi nastaju zbog faktora
        van naše kontrole (problemi kod ISP-a, CDN-a, sportskih organizatora ili
        viša sila). Naša ukupna odgovornost prema tebi je ograničena na iznos
        koji si platio/la za pass o kojem je reč.
      </p>

      <h2>9. Izmene Usluga</h2>
      <p>
        Zadržavamo pravo da menjamo Uslugu, datume događaja, raspored borbi i
        sadržaj u svakom trenutku. Materijalne izmene cena i Uslova ne važe za
        pass-eve koji su već kupljeni.
      </p>

      <h2>10. Privatnost</h2>
      <p>
        Tvoji lični podaci se obrađuju u skladu sa našom{" "}
        <a href="/privacy">Politikom privatnosti</a>.
      </p>

      <h2>11. Merodavno pravo</h2>
      <p>
        Ovi Uslovi se tumače u skladu sa zakonima Republike Srbije. U slučaju
        spora, nadležan je sud u Beogradu, osim ako relevantni potrošački zakon
        ne predviđa drugačije.
      </p>

      <h2>12. Kontakt</h2>
      <p>
        Za sva pitanja o ovim Uslovima:{" "}
        <a href="/contact">stranica za kontakt</a>.
      </p>
    </LegalLayout>
  );
}
