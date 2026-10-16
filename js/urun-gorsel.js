// =========================================================
// T&B — ÜRÜN GÖRSELİ VE YAZIM YARDIMCILARI
// Ürünü ekranda göstermek için gereken ortak parçalar: Türkçe
// adlar, fiyat yazımı ve yer tutucu çizimler. Ürünler sayfası
// ve menüdeki arama bu dosyayı birlikte kullanır; böylece aynı
// kodu iki yere yazmamış oluyoruz. Tüm sayfalarda yüklenir.
// =========================================================

// Ekranda görünecek Türkçe adlar
const CINSIYET_ADI = { kadin: 'Kadın', erkek: 'Erkek' };
const TUR_ADI = { gomlek: 'Gömlek', pantolon: 'Pantolon', ceket: 'Ceket' };

// Yer tutucu çizimler (gerçek fotoğraflar gelene kadar).
// Her biri 100x100'lük bir alana çizilmiş basit bir SVG.
// {renk} yazan yeri ürünün ilk rengiyle değiştiriyoruz, böylece
// çizim ürünün gerçek rengini taşıyor.
const CIZIMLER = {
  gomlek: `
    <path d="M36 16 L50 22 L64 16 L84 28 L77 44 L68 39 L68 86 L32 86 L32 39 L23 44 L16 28 Z" fill="{renk}"/>
    <path d="M42 18 L50 30 L58 18"/>
    <path d="M50 30 V86"/>
    <circle cx="54" cy="44" r="1.6" fill="currentColor"/>
    <circle cx="54" cy="58" r="1.6" fill="currentColor"/>
    <circle cx="54" cy="72" r="1.6" fill="currentColor"/>`,
  pantolon: `
    <path d="M31 14 H69 L74 88 H55 L50 40 L45 88 H26 Z" fill="{renk}"/>
    <path d="M31 23 H69"/>
    <path d="M50 23 V40"/>
    <path d="M38 23 Q38 32 32 34"/>
    <path d="M62 23 Q62 32 68 34"/>`,
  ceket: `
    <path d="M35 14 L50 20 L65 14 L85 28 L82 72 L71 70 L71 88 L29 88 L29 70 L18 72 L15 28 Z" fill="{renk}"/>
    <path d="M42 16 L50 48 L58 16"/>
    <path d="M42 16 L37 30 L45 34"/>
    <path d="M58 16 L63 30 L55 34"/>
    <path d="M50 48 V88"/>
    <path d="M34 66 H44"/>
    <path d="M56 66 H66"/>`
};

// Intl.NumberFormat: sayıyı Türkiye'deki yazım şekline çevirir (1249 → "1.249")
const sayiBicimi = new Intl.NumberFormat('tr-TR');

function fiyatYaz(tutar) {
  return sayiBicimi.format(tutar) + ' TL';
}

function cizimOlustur(urun) {
  const icerik = CIZIMLER[urun.tur].replace('{renk}', urun.renkler[0].kod);
  return `
    <svg class="urun-cizim" viewBox="0 0 100 100" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
      ${icerik}
    </svg>`;
}
