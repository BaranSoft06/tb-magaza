// =========================================================
// T&B — ÜRÜNLER SAYFASI
// js/urunler-veri.js'teki URUNLER listesinden ürün kartlarını
// oluşturup sayfaya ekler.
// =========================================================

// Türkçe adlar, fiyat yazımı ve yer tutucu çizimler js/urun-gorsel.js'te
// (menüdeki arama da onları kullanıyor).

// Eski ve yeni fiyattan indirim yüzdesini hesaplar (1099 → 879 ise 20)
function indirimYuzdesi(urun) {
  return Math.round((1 - urun.fiyat / urun.eskiFiyat) * 100);
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

// Ekran okuyucunun kalp için okuyacağı yazı: butona basınca ne olacağını söyler
function kalpEtiketi(urun, favoride) {
  return urun.ad + (favoride ? ': favorilerden çıkar' : ': favorilere ekle');
}

// Kalp butonu. aria-pressed: ekran okuyucuya "favoride mi" bilgisini verir,
// CSS de dolu/boş kalbi bu bilgiye göre çizer.
function kalpOlustur(urun) {
  const favoride = favorideMi(urun.id);
  return `
    <button type="button" class="kalp-buton" data-id="${urun.id}"
            aria-pressed="${favoride}" aria-label="${kalpEtiketi(urun, favoride)}">
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
        <button type="button" class="hizli-bak-buton" data-id="${urun.id}" aria-haspopup="dialog">
          Hızlı bak<span class="gizli">: ${urun.ad}</span>
        </button>
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
  if (liste.length === 0) {
    // Aramaya uyan ürün yok: mesaj, öneri başlığı ve altında birkaç öneri ürün
    urunAlani.innerHTML = sonucYokOlustur() +
      '<p class="oneriler-baslik">Bunlara göz atabilirsin</p>' +
      aramaOnerileri(durum.cinsiyet).map(kartOlustur).join('');
  } else {
    urunAlani.innerHTML = liste.map(kartOlustur).join('');
  }

  if (kartGozcusu) {
    urunAlani.querySelectorAll('.urun-kart').forEach(function (kart) {
      kart.classList.add('kart-bekliyor'); // ekrana girene kadar görünmez
      kartGozcusu.observe(kart);
    });
  }

  // Öneri kartları sayılmaz; sonuç yoksa "0 ürün" yerine açıkça söyle
  document.getElementById('urun-sayisi').textContent =
    liste.length === 0 ? 'Sonuç bulunamadı' : liste.length + ' ürün';
  aramaSeridiniGuncelle(liste.length);
}

// Listenin en başında, tüm satırı kaplayan "sonuç yok" kutusu.
// Aranan yazı kullanıcıdan geldiği için aramaGuvenliYaz ile koyuyoruz
// (js/arama.js): içine kod yazılsa bile düz yazı olarak görünür.
function sonucYokOlustur() {
  return `
    <div class="sonuc-yok">
      <p class="sonuc-yok-baslik">Sonuç bulunamadı</p>
      <p class="sonuc-yok-metin">
        ‘${aramaGuvenliYaz(durum.ara)}’ ile eşleşen bir ürünümüz yok.
        Başka bir kelime dene.
      </p>
    </div>`;
}

// =========================================================
// FİLTRE VE SIRALAMA
// Sayfanın o anki seçimleri "durum" nesnesinde tutulur. Bir şey
// değişince durumu güncelleyip listeyi baştan hazırlıyoruz.
// =========================================================

const CINSIYETLER = ['tumu', 'kadin', 'erkek'];
const SIRALAMALAR = ['onerilen', 'artan', 'azalan', 'yeni'];

// URLSearchParams: adresteki "?cinsiyet=kadin" kısmını okumamızı sağlar.
// Ana sayfadaki kategori kartları sayfayı bu şekilde filtreli açıyor,
// menüdeki arama da "?ara=gömlek" ile açıyor.
const adresBilgisi = new URLSearchParams(window.location.search);
const adrestekiCinsiyet = adresBilgisi.get('cinsiyet');
const adrestekiSiralama = adresBilgisi.get('sirala');
const adrestekiArama = (adresBilgisi.get('ara') || '').trim();

const durum = {
  // Adreste geçerli bir değer yoksa (ya da yanlış yazılmışsa) "Tümü"
  cinsiyet: CINSIYETLER.includes(adrestekiCinsiyet) ? adrestekiCinsiyet : 'tumu',
  // Sıralama da aynı şekilde: geçerli değilse "Önerilen"
  siralama: SIRALAMALAR.includes(adrestekiSiralama) ? adrestekiSiralama : 'onerilen',
  // Boşsa ya da tek harfse arama yok (aramaYeterliMi: js/arama.js)
  ara: aramaYeterliMi(adrestekiArama) ? adrestekiArama : ''
};

function listeyiHazirla() {
  // Arama varsa sadece aramaya uyanlarla başla (js/arama.js). urunAra
  // en uygun ürünleri başa koyar; "Önerilen" sıralamada bu sıra kalır.
  const baslangic = durum.ara ? urunAra(durum.ara) : URUNLER;

  // filter: koşula uyanları yeni bir listeye alır (asıl liste değişmez)
  const liste = baslangic.filter(function (urun) {
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
  if (durum.siralama === 'onerilen') {
    adres.searchParams.delete('sirala');
  } else {
    adres.searchParams.set('sirala', durum.siralama);
  }
  if (durum.ara) {
    adres.searchParams.set('ara', durum.ara);
  } else {
    adres.searchParams.delete('ara');
  }
  history.replaceState(null, '', adres);
}

// =========================================================
// ARAMA ŞERİDİ
// Sayfa "?ara=..." ile açıldıysa listenin üstünde
// "'gömlek' için 3 sonuç ✕" şeridi görünür. ✕ aramayı temizler.
// =========================================================
const aramaSeridi = document.getElementById('arama-seridi');

function aramaSeridiniGuncelle(sayi) {
  aramaSeridi.classList.remove('kapaniyor');
  aramaSeridi.hidden = !durum.ara;
  if (!durum.ara) return;

  // textContent: aranan yazı HTML olarak değil düz yazı olarak girer
  aramaSeridi.querySelector('.arama-seridi-sorgu').textContent = durum.ara;
  aramaSeridi.querySelector('.arama-seridi-sayi').textContent = sayi;
}

aramaSeridi.querySelector('.arama-seridi-kapat').addEventListener('click', function () {
  durum.ara = '';
  adresiGuncelle();
  // Şerit kapanma animasyonunu oynatır; liste yenilenince tamamen gizlenir
  aramaSeridi.classList.add('kapaniyor');
  listeyiYenile();
  // Tıklanan buton kayboluyor; klavye odağı boşta kalmasın, filtreye geçsin
  filtre.querySelector('[aria-pressed="true"]').focus();
});

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

// Seçili seçeneği işaretler ve butonda yazısını gösterir
function siralamaButonunuAyarla() {
  secenekler.forEach(function (s) {
    s.setAttribute('aria-selected', s.dataset.siralama === durum.siralama);
  });
  siralamaSecili.textContent = secenekler[SIRALAMALAR.indexOf(durum.siralama)].textContent;
}

function siralamaSec(sira) {
  const secenek = secenekler[sira];
  listeyiKapat();

  if (secenek.dataset.siralama !== durum.siralama) {
    durum.siralama = secenek.dataset.siralama;
    siralamaButonunuAyarla();
    adresiGuncelle();
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
// Hem kart listesi hem hızlı bakış penceresi bu fonksiyonu kullanır
function kalpTiklandi(olay) {
  const buton = olay.target.closest('.kalp-buton');
  if (!buton) return;

  const eklendi = favoriDegistir(buton.dataset.id);
  const urun = URUNLER.find(function (u) { return u.id === buton.dataset.id; });

  // Aynı ürünün sayfadaki bütün kalpleri (kart + hızlı bakış) birlikte güncellensin
  document.querySelectorAll(`.kalp-buton[data-id="${buton.dataset.id}"]`).forEach(function (kalp) {
    kalp.setAttribute('aria-pressed', eklendi);
    kalp.setAttribute('aria-label', kalpEtiketi(urun, eklendi));
  });

  // Patlama animasyonu sadece eklerken; çıkarırken kalp sessizce boşalır
  buton.classList.remove('patla');
  if (eklendi) {
    void buton.offsetWidth; // animasyonu baştan başlatmak için (favoriler.js'teki gibi)
    buton.classList.add('patla');
  }
}

urunAlani.addEventListener('click', kalpTiklandi);

// =========================================================
// HIZLI BAKIŞ PENCERESİ
// Kartlardaki "Hızlı bak" butonu, ürünün özetini sayfadan
// ayrılmadan bir pencerede gösterir.
// =========================================================
const hizliBakis = document.getElementById('hizli-bakis');

function hizliBakisIcerigi(urun) {
  const renkAdlari = urun.renkler.map(function (renk) { return renk.ad; }).join(', ');
  const bedenler = urun.bedenler
    .map(function (beden) { return `<li class="beden-kutu">${beden}</li>`; })
    .join('');

  // Kart için yazdığımız parçaları (çizim, etiketler, kalp, fiyat, renkler)
  // burada tekrar kullanıyoruz; aynı kodu iki kez yazmamış oluyoruz
  // Tüm içerik tek bir kutunun (hizli-bakis-ic) içinde: böylece kutunun
  // dışına tıklamak = pencerenin kendisine tıklamak = arka plana tıklamak olur
  return `
    <div class="hizli-bakis-ic">
    <button type="button" class="hizli-bakis-kapat" aria-label="Pencereyi kapat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18"/>
      </svg>
    </button>

    <div class="hizli-bakis-gorsel urun-gorsel zemin-${urun.zemin}">
      <span class="urun-gorsel-amp" aria-hidden="true">&amp;</span>
      ${cizimOlustur(urun)}
      ${etiketlerOlustur(urun)}
      ${kalpOlustur(urun)}
    </div>

    <div class="hizli-bakis-bilgi">
      <p class="urun-tur">${CINSIYET_ADI[urun.cinsiyet]} · ${TUR_ADI[urun.tur]}</p>
      <h2 class="hizli-bakis-ad" id="hizli-bakis-ad">${urun.ad}</h2>
      ${fiyatOlustur(urun)}
      <p class="hizli-bakis-aciklama">${urun.aciklama}</p>

      <h3 class="hizli-bakis-baslik">Renkler <span class="hizli-bakis-renk-adlari">${renkAdlari}</span></h3>
      ${renklerOlustur(urun)}

      <h3 class="hizli-bakis-baslik">Bedenler</h3>
      <ul class="beden-listesi">${bedenler}</ul>

      <a href="urun.html?id=${urun.id}" class="buton hizli-bakis-git">
        Ürüne git
        <span class="buton-ok" aria-hidden="true">→</span>
      </a>
    </div>
    </div>`;
}

function hizliBakisAc(id) {
  // find: listede koşula uyan ilk öğeyi bulur
  const urun = URUNLER.find(function (u) { return u.id === id; });
  if (!urun) return;

  hizliBakis.innerHTML = hizliBakisIcerigi(urun);
  hizliBakis.classList.remove('kapaniyor');
  hizliBakis.showModal();

  // Özel imleç pencerenin arkasında kalmasın (bkz. js/imlec.js)
  if (window.imleciOneGetir) window.imleciOneGetir();
}

// Kapanırken önce küçülme animasyonu oynar, bitince pencere gerçekten kapanır
function hizliBakisKapat() {
  if (!hizliBakis.open || hizliBakis.classList.contains('kapaniyor')) return;

  if (hareketiAzalt) {
    hizliBakis.close();
    return;
  }

  hizliBakis.classList.add('kapaniyor');
  hizliBakis.addEventListener('animationend', function bitti(olay) {
    // İçerideki başka animasyonlar (ör. kalp patlaması) yanlışlıkla kapatmasın
    if (olay.target !== hizliBakis) return;
    hizliBakis.removeEventListener('animationend', bitti);
    hizliBakis.classList.remove('kapaniyor');
    hizliBakis.close();
  });
}

urunAlani.addEventListener('click', function (olay) {
  const buton = olay.target.closest('.hizli-bak-buton');
  if (buton) hizliBakisAc(buton.dataset.id);
});

hizliBakis.addEventListener('click', function (olay) {
  // Pencerenin kendisine tıklanmışsa (içindeki bir öğeye değil) bu,
  // arkadaki bulanık alana tıklandı demek: pencereyi kapat
  if (olay.target === hizliBakis || olay.target.closest('.hizli-bakis-kapat')) {
    hizliBakisKapat();
    return;
  }
  kalpTiklandi(olay);
});

// Esc'ye basılınca tarayıcı pencereyi hemen kapatır. preventDefault ile
// bunu durdurup kendi animasyonlu kapatmamızı kullanıyoruz.
hizliBakis.addEventListener('cancel', function (olay) {
  olay.preventDefault();
  hizliBakisKapat();
});

// ---------- Sayfa açılışı ----------
filtreButonlariniAyarla();
siralamaButonunuAyarla(); // adresten gelen sıralama ("?sirala=artan") butonda görünsün
// Adreste kullanılmayan bir arama varsa (ör. tek harf "?ara=ı") adresten de silinsin
if (adrestekiArama && !durum.ara) adresiGuncelle();
urunleriGoster(listeyiHazirla());

// Menüdeki aramada bir ürüne tıklanınca sayfa "?bak=urun-id" ile açılır:
// o ürünün hızlı bakış penceresini aç. Ürün detay sayfası hazır olunca
// arama sonuçları oraya gidecek ve bu kısma gerek kalmayacak.
const bakilacakUrun = adresBilgisi.get('bak');
if (bakilacakUrun) {
  // Adresten sil: sayfa yenilenince pencere tekrar tekrar açılmasın
  const adres = new URL(window.location.href);
  adres.searchParams.delete('bak');
  history.replaceState(null, '', adres);
  hizliBakisAc(bakilacakUrun);
}

// Sarı zemin ilk yerine animasyonsuz otursun; kayma efekti sadece
// sonraki tıklamalarda çalışsın. requestAnimationFrame: bir sonraki karede.
requestAnimationFrame(function () {
  filtre.classList.add('hazir');
});
