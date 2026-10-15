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

// Kalp butonu. aria-pressed: ekran okuyucuya "favoride mi" bilgisini verir,
// CSS de dolu/boş kalbi bu bilgiye göre çizer.
function kalpOlustur(urun) {
  const favoride = favorideMi(urun.id);
  return `
    <button type="button" class="kalp-buton" data-id="${urun.id}"
            aria-pressed="${favoride}" aria-label="${urun.ad}: favorilere ekle">
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.8 3.7 4.5 7.1 4.5c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.4 0 5.7 3.3 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/>
      </svg>
    </button>`;
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
        ${kalpOlustur(urun)}
      </div>
      <div class="urun-bilgi">
        <p class="urun-tur">${CINSIYET_ADI[urun.cinsiyet]} · ${TUR_ADI[urun.tur]}</p>
        <h2 class="urun-ad">${urun.ad}</h2>
        ${fiyatOlustur(urun)}
        ${renklerOlustur(urun)}
      </div>
    </article>`;
}

const urunAlani = document.getElementById('urun-listesi');
const hareketiAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================
// KAYDIRDIKÇA BELİREN KARTLAR
// IntersectionObserver: tarayıcıya "bu öğe ekrana girince bana haber
// ver" dememizi sağlar. Kaydırma olayını sürekli dinleyip hesap
// yapmaktan çok daha verimlidir, sayfayı yavaşlatmaz.
// =========================================================
const kartGozcusu = hareketiAzalt ? null : new IntersectionObserver(function (girdiler) {
  // Aynı anda ekrana giren kartlar (ör. aynı satırdakiler) hepsi birden
  // değil, kısa aralıklarla arka arkaya gelsin
  let sira = 0;
  girdiler.forEach(function (girdi) {
    if (!girdi.isIntersecting) return;

    const kart = girdi.target;
    kart.style.setProperty('--gecikme', (sira * 0.08) + 's');
    kart.classList.remove('kart-bekliyor');
    kart.classList.add('kart-gorundu');
    sira++;

    // Kart bir kez göründü; artık izlemeye gerek yok
    kartGozcusu.unobserve(kart);
  });
}, {
  // Kartın en az %15'i görününce, ekranın alt kenarına biraz girince başla
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

function urunleriGoster(liste) {
  // Eski kartları izlemeyi bırak (sayfadan siliniyorlar)
  if (kartGozcusu) kartGozcusu.disconnect();

  // map her ürünü bir kart HTML'ine çevirir, join hepsini tek metinde birleştirir.
  // Sayfaya tek seferde eklemek, kartları tek tek eklemekten daha hızlıdır.
  urunAlani.innerHTML = liste.map(kartOlustur).join('');

  if (kartGozcusu) {
    urunAlani.querySelectorAll('.urun-kart').forEach(function (kart) {
      kart.classList.add('kart-bekliyor'); // ekrana girene kadar görünmez
      kartGozcusu.observe(kart);
    });
  }

  document.getElementById('urun-sayisi').textContent = liste.length + ' ürün';
}

// =========================================================
// FİLTRE VE SIRALAMA
// Sayfanın o anki seçimleri "durum" nesnesinde tutulur. Bir şey
// değişince durumu güncelleyip listeyi baştan hazırlıyoruz.
// =========================================================

const CINSIYETLER = ['tumu', 'kadin', 'erkek'];
const SIRALAMALAR = ['onerilen', 'artan', 'azalan', 'yeni'];

// URLSearchParams: adresteki "?cinsiyet=kadin" kısmını okumamızı sağlar.
// Ana sayfadaki kategori kartları sayfayı bu şekilde filtreli açıyor.
const adresBilgisi = new URLSearchParams(window.location.search);
const adrestekiCinsiyet = adresBilgisi.get('cinsiyet');

const durum = {
  // Adreste geçerli bir değer yoksa (ya da yanlış yazılmışsa) "Tümü"
  cinsiyet: CINSIYETLER.includes(adrestekiCinsiyet) ? adrestekiCinsiyet : 'tumu',
  siralama: 'onerilen'
};

function listeyiHazirla() {
  // filter: koşula uyanları yeni bir listeye alır (asıl liste değişmez)
  const liste = URUNLER.filter(function (urun) {
    return durum.cinsiyet === 'tumu' || urun.cinsiyet === durum.cinsiyet;
  });

  // sort, iki ürünü karşılaştıran bir fonksiyon ister: sonuç negatifse
  // a önce, pozitifse b önce gelir. "Önerilen" için listenin kendi sırası kalır.
  if (durum.siralama === 'artan') {
    liste.sort(function (a, b) { return a.fiyat - b.fiyat; });
  } else if (durum.siralama === 'azalan') {
    liste.sort(function (a, b) { return b.fiyat - a.fiyat; });
  } else if (durum.siralama === 'yeni') {
    // Tarihler "2026-10-10" biçiminde; bu biçim yazı olarak da doğru sıralanır
    liste.sort(function (a, b) { return b.eklenme.localeCompare(a.eklenme); });
  }

  return liste;
}

// Eski kartlar küçülerek kaybolur, sonra yeni kartlar sırayla gelir
let degisimZamanlayici = null;

function listeyiYenile() {
  if (hareketiAzalt) {
    urunleriGoster(listeyiHazirla());
    return;
  }

  // Art arda hızlı tıklanırsa yarım kalan değişimi iptal et
  clearTimeout(degisimZamanlayici);
  urunAlani.classList.add('kartlar-cikiyor');

  degisimZamanlayici = setTimeout(function () {
    urunAlani.classList.remove('kartlar-cikiyor');
    urunleriGoster(listeyiHazirla());
  }, 220); // CSS'teki çıkış animasyonunun süresiyle aynı
}

// ---------- Filtre butonları ----------
const filtre = document.querySelector('.filtre');
const filtreButonlari = filtre.querySelectorAll('.filtre-buton');
const filtreGosterge = filtre.querySelector('.filtre-gosterge');

// Sarı zemini seçili butonun konumuna ve genişliğine taşır
function gostergeyiTasi() {
  const secili = filtre.querySelector('[aria-pressed="true"]');
  filtreGosterge.style.width = secili.offsetWidth + 'px';
  filtreGosterge.style.transform = `translateX(${secili.offsetLeft}px)`;
}

function filtreButonlariniAyarla() {
  filtreButonlari.forEach(function (buton) {
    buton.setAttribute('aria-pressed', buton.dataset.cinsiyet === durum.cinsiyet);
  });
  gostergeyiTasi();
}

filtreButonlari.forEach(function (buton) {
  buton.addEventListener('click', function () {
    if (buton.dataset.cinsiyet === durum.cinsiyet) return; // zaten seçili

    durum.cinsiyet = buton.dataset.cinsiyet;
    filtreButonlariniAyarla();
    adresiGuncelle();
    listeyiYenile();
  });
});

// Seçili filtreyi adrese de yaz; sayfa yenilenince ya da link
// paylaşılınca aynı filtre açılsın. replaceState sayfayı yeniden
// yüklemeden sadece adres çubuğundaki yazıyı değiştirir.
function adresiGuncelle() {
  const adres = new URL(window.location.href);
  if (durum.cinsiyet === 'tumu') {
    adres.searchParams.delete('cinsiyet');
  } else {
    adres.searchParams.set('cinsiyet', durum.cinsiyet);
  }
  history.replaceState(null, '', adres);
}

// Ekran boyutu değişince ya da font geç yüklenince butonların
// genişliği değişebilir; sarı zemin yerinden kaymasın
window.addEventListener('resize', gostergeyiTasi);
document.fonts.ready.then(gostergeyiTasi);

// =========================================================
// SIRALAMA MENÜSÜ (kendi açılır listemiz)
// Klavye: ↑ ↓ seçenekler arasında gezer, Enter/Boşluk seçer,
// Esc kapatır, Home/End ilk/son seçeneğe gider.
// Odak hep butonda kalır; hangi seçeneğin üzerinde olduğumuzu
// "aria-activedescendant" ile ekran okuyucuya bildiririz.
// =========================================================
const siralamaKutu = document.querySelector('.siralama');
const siralamaButon = document.getElementById('siralama-buton');
const siralamaListe = document.getElementById('siralama-liste');
const siralamaSecili = siralamaKutu.querySelector('.siralama-secili');
const secenekler = Array.from(siralamaListe.querySelectorAll('.siralama-secenek'));

let aktifSira = 0; // klavyeyle üzerinde durulan seçeneğin sırası

function listeAcikMi() {
  return siralamaButon.getAttribute('aria-expanded') === 'true';
}

function aktifSecenegiAyarla(sira) {
  aktifSira = sira;
  secenekler.forEach(function (secenek, i) {
    secenek.classList.toggle('aktif', i === sira);
  });
  siralamaButon.setAttribute('aria-activedescendant', secenekler[sira].id);
}

function listeyiAc() {
  siralamaButon.setAttribute('aria-expanded', 'true');
  siralamaKutu.classList.add('acik');
  // Açılınca seçili olan seçenekten başla
  aktifSecenegiAyarla(SIRALAMALAR.indexOf(durum.siralama));
}

function listeyiKapat() {
  siralamaButon.setAttribute('aria-expanded', 'false');
  siralamaKutu.classList.remove('acik');
  siralamaButon.removeAttribute('aria-activedescendant');
}

function siralamaSec(sira) {
  const secenek = secenekler[sira];
  secenekler.forEach(function (s) {
    s.setAttribute('aria-selected', s === secenek);
  });
  siralamaSecili.textContent = secenek.textContent;
  listeyiKapat();

  if (secenek.dataset.siralama !== durum.siralama) {
    durum.siralama = secenek.dataset.siralama;
    listeyiYenile();
  }
}

siralamaButon.addEventListener('click', function () {
  if (listeAcikMi()) {
    listeyiKapat();
  } else {
    listeyiAc();
  }
});

siralamaButon.addEventListener('keydown', function (olay) {
  const acik = listeAcikMi();
  const son = secenekler.length - 1;

  switch (olay.key) {
    case 'ArrowDown':
      // Kapalıyken ok tuşu listeyi açar, açıkken bir aşağı iner
      if (acik) aktifSecenegiAyarla(Math.min(aktifSira + 1, son));
      else listeyiAc();
      break;
    case 'ArrowUp':
      if (acik) aktifSecenegiAyarla(Math.max(aktifSira - 1, 0));
      else listeyiAc();
      break;
    case 'Home':
      if (!acik) return;
      aktifSecenegiAyarla(0);
      break;
    case 'End':
      if (!acik) return;
      aktifSecenegiAyarla(son);
      break;
    case 'Enter':
    case ' ':
      if (acik) siralamaSec(aktifSira);
      else listeyiAc();
      break;
    case 'Escape':
      if (!acik) return;
      listeyiKapat();
      break;
    case 'Tab':
      // Başka bir öğeye geçilirken liste açık kalmasın
      if (acik) listeyiKapat();
      return; // Tab'ın normal görevini engelleme
    default:
      return;
  }
  // preventDefault: tuşun tarayıcıdaki normal işini (ör. sayfayı kaydırmak) engeller
  olay.preventDefault();
});

// Boşluk tuşu, bırakıldığında butona bir de "tıklama" gönderir. Enter ve
// Boşluk'u yukarıda kendimiz yönettiğimiz için o tıklamayı engelliyoruz;
// yoksa seçim yapınca liste kapanıp hemen yeniden açılırdı.
siralamaButon.addEventListener('keyup', function (olay) {
  if (olay.key === ' ') olay.preventDefault();
});

secenekler.forEach(function (secenek, sira) {
  secenek.addEventListener('click', function () {
    siralamaSec(sira);
    siralamaButon.focus();
  });
  // Fareyle üzerine gelinen seçenek, klavyedeki aktif seçenekle aynı olsun
  secenek.addEventListener('mousemove', function () {
    if (aktifSira !== sira) aktifSecenegiAyarla(sira);
  });
});

// Listenin dışına tıklanınca (ya da telefonda dokununca) kapat
document.addEventListener('click', function (olay) {
  if (listeAcikMi() && !siralamaKutu.contains(olay.target)) {
    listeyiKapat();
  }
});

// =========================================================
// KALP (FAVORİLER)
// Kartlar filtreyle sürekli yeniden oluşturulduğu için her kalbe
// ayrı dinleyici eklemek yerine listenin tamamını dinliyoruz
// (olay delegasyonu): tıklanan şey bir kalp butonuysa işliyoruz.
// =========================================================
urunAlani.addEventListener('click', function (olay) {
  const buton = olay.target.closest('.kalp-buton');
  if (!buton) return;

  const eklendi = favoriDegistir(buton.dataset.id);

  // Aynı ürünün sayfadaki bütün kalpleri (ileride hızlı bakıştaki de) güncellensin
  document.querySelectorAll(`.kalp-buton[data-id="${buton.dataset.id}"]`).forEach(function (kalp) {
    kalp.setAttribute('aria-pressed', eklendi);
  });

  // Patlama animasyonu sadece eklerken; çıkarırken kalp sessizce boşalır
  buton.classList.remove('patla');
  if (eklendi) {
    void buton.offsetWidth; // animasyonu baştan başlatmak için (favoriler.js'teki gibi)
    buton.classList.add('patla');
  }
});

// ---------- Sayfa açılışı ----------
filtreButonlariniAyarla();
urunleriGoster(listeyiHazirla());

// Sarı zemin ilk yerine animasyonsuz otursun; kayma efekti sadece
// sonraki tıklamalarda çalışsın. requestAnimationFrame: bir sonraki karede.
requestAnimationFrame(function () {
  filtre.classList.add('hazir');
});
