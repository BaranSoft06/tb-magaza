// =========================================================
// T&B — ÜRÜNLER SAYFASI
// js/urunler-veri.js'teki URUNLER listesinden ürün kartlarını
// oluşturup sayfaya ekler.
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

// Eski ve yeni fiyattan indirim yüzdesini hesaplar (1099 → 879 ise 20)
function indirimYuzdesi(urun) {
  return Math.round((1 - urun.fiyat / urun.eskiFiyat) * 100);
}

function cizimOlustur(urun) {
  const icerik = CIZIMLER[urun.tur].replace('{renk}', urun.renkler[0].kod);
  return `
    <svg class="urun-cizim" viewBox="0 0 100 100" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
      ${icerik}
    </svg>`;
}

function etiketlerOlustur(urun) {
  let etiketler = '';
  if (urun.eskiFiyat) {
    etiketler += `<span class="etiket etiket-indirim">%${indirimYuzdesi(urun)}</span>`;
  }
  if (urun.yeni) {
    etiketler += `<span class="etiket etiket-yeni">Yeni</span>`;
  }
  return etiketler ? `<div class="urun-etiketler">${etiketler}</div>` : '';
}

function fiyatOlustur(urun) {
  if (urun.eskiFiyat) {
    // <del>: üstü çizili, "artık geçerli değil" anlamına gelen metin.
    // "gizli" yazılar ekran okuyucunun fiyatları doğru okuması için.
    return `
      <p class="urun-fiyat">
        <span class="gizli">Eski fiyat:</span>
        <del>${fiyatYaz(urun.eskiFiyat)}</del>
        <span class="gizli">İndirimli fiyat:</span>
        <span class="fiyat-indirimli">${fiyatYaz(urun.fiyat)}</span>
      </p>`;
  }
  return `<p class="urun-fiyat">${fiyatYaz(urun.fiyat)}</p>`;
}

function renklerOlustur(urun) {
  const daireler = urun.renkler
    .map(function (renk) {
      // --renk: CSS'e her dairenin kendi rengini değişkenle veriyoruz
      return `<li class="renk-daire" style="--renk: ${renk.kod}" title="${renk.ad}"></li>`;
    })
    .join('');
  const adlar = urun.renkler.map(function (renk) { return renk.ad; }).join(', ');
  return `<ul class="urun-renkler" aria-label="Renkler: ${adlar}">${daireler}</ul>`;
}

function kartOlustur(urun) {
  // Template literal (ters tırnak `...`): içine ${...} ile değer
  // yerleştirebildiğimiz çok satırlı metin. Kartın HTML'ini böyle kuruyoruz.
  return `
    <article class="urun-kart">
      <div class="urun-gorsel zemin-${urun.zemin}">
        <span class="urun-gorsel-amp" aria-hidden="true">&amp;</span>
        ${cizimOlustur(urun)}
        ${etiketlerOlustur(urun)}
      </div>
      <div class="urun-bilgi">
        <p class="urun-tur">${CINSIYET_ADI[urun.cinsiyet]} · ${TUR_ADI[urun.tur]}</p>
        <h2 class="urun-ad">${urun.ad}</h2>
        ${fiyatOlustur(urun)}
        ${renklerOlustur(urun)}
      </div>
    </article>`;
}

function urunleriGoster(liste) {
  const alan = document.getElementById('urun-listesi');
  // map her ürünü bir kart HTML'ine çevirir, join hepsini tek metinde birleştirir.
  // Sayfaya tek seferde eklemek, kartları tek tek eklemekten daha hızlıdır.
  alan.innerHTML = liste.map(kartOlustur).join('');

  document.getElementById('urun-sayisi').textContent = liste.length + ' ürün';
}

urunleriGoster(URUNLER);
