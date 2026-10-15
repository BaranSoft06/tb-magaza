// =========================================================
// T&B — FAVORİLER
// Favori ürünlerin listesini tarayıcıda (localStorage) tutar ve
// menüdeki kalp ikonunun yanındaki sayıyı günceller.
// Tüm sayfalarda kullanılır.
//
// localStorage: tarayıcının bu site için ayırdığı küçük bir depo.
// Sayfa kapansa ya da bilgisayar yeniden başlasa bile içindekiler
// silinmez. Sadece yazı saklar; listeyi JSON'a çevirerek koyuyoruz.
// =========================================================

const FAVORI_ANAHTAR = 'tb-favoriler';

function favorileriOku() {
  // try/catch: gizli sekmede ya da tarayıcı ayarı yüzünden depo
  // kapalıysa hata verir; o zaman site çökmesin, boş liste dönsün
  try {
    const kayit = JSON.parse(localStorage.getItem(FAVORI_ANAHTAR));
    return Array.isArray(kayit) ? kayit : [];
  } catch (hata) {
    return [];
  }
}

function favorileriKaydet(liste) {
  try {
    localStorage.setItem(FAVORI_ANAHTAR, JSON.stringify(liste));
  } catch (hata) {
    // Kaydedilemezse sayfa yine çalışsın; favori sadece bu sayfada kalır
  }
}

function favorideMi(id) {
  return favorileriOku().includes(id);
}

// Ürün favorideyse çıkarır, değilse ekler. Yeni durumu döndürür.
function favoriDegistir(id) {
  const liste = favorileriOku();
  const sira = liste.indexOf(id);
  const eklendi = sira === -1;

  if (eklendi) {
    liste.push(id);
  } else {
    liste.splice(sira, 1); // splice: listeden o sıradaki 1 öğeyi siler
  }

  favorileriKaydet(liste);
  favoriSayisiniGuncelle(true);
  return eklendi;
}

// Menüdeki sayıyı günceller; "zipla" true ise sayı hafifçe zıplar
function favoriSayisiniGuncelle(zipla) {
  const ikon = document.querySelector('.favori-ikon');
  if (!ikon) return;

  const adet = favorileriOku().length;
  const sayi = ikon.querySelector('.favori-adet');
  sayi.textContent = adet;
  ikon.setAttribute('aria-label', `Favoriler (${adet} ürün)`);

  if (zipla) {
    // Animasyonu baştan oynatmak için sınıfı kaldırıp yeniden ekliyoruz.
    // Aradaki offsetWidth okuması tarayıcıyı "sınıf kalktı" demeye zorlar;
    // yoksa iki işlemi birleştirir ve animasyon tekrar başlamaz.
    sayi.classList.remove('zipla');
    void sayi.offsetWidth;
    sayi.classList.add('zipla');
  }
}

favoriSayisiniGuncelle(false);

// Site başka bir sekmede de açıksa ve orada favori değişirse
// bu sekmedeki sayı da güncellensin
window.addEventListener('storage', function (olay) {
  if (olay.key === FAVORI_ANAHTAR) favoriSayisiniGuncelle(false);
});
