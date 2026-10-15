// =========================================================
// T&B — AÇILIŞ ANİMASYONU
// Animasyonun kendisi CSS'te (css/ana-sayfa.css).
// Bu dosya sadece iki iş yapar:
//   1. Animasyon bu ziyarette zaten görüldüyse onu atlar.
//   2. Animasyon bitince siyah katmanı sayfadan kaldırır.
// =========================================================

(function () {
  const ANAHTAR = 'tb-acilis-goruldu';
  const kok = document.documentElement; // <html> etiketi

  // Kullanıcı cihazında "hareketi azalt" ayarını açmış mı?
  const hareketiAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // sessionStorage: tarayıcı sekmesi açık kaldığı sürece veri saklar.
  // Sekme kapanınca silinir; yani site her yeni ziyarette bir kez animasyon gösterir.
  // try/catch: bazı gizli sekmelerde sessionStorage hata verebilir, site yine çalışsın.
  let gorulduMu = false;
  try {
    gorulduMu = sessionStorage.getItem(ANAHTAR) === 'evet';
  } catch (hata) {}

  if (gorulduMu || hareketiAzalt) {
    // CSS bu sınıfı görünce açılış katmanını hiç göstermez
    kok.classList.add('acilis-atla');
    return;
  }

  try {
    sessionStorage.setItem(ANAHTAR, 'evet');
  } catch (hata) {}

  // DOMContentLoaded: HTML tamamen okunduğunda çalışır.
  // Bu dosya <head> içinde olduğu için #acilis öğesi henüz yok, beklememiz gerekiyor.
  document.addEventListener('DOMContentLoaded', function () {
    const acilis = document.getElementById('acilis');
    if (!acilis) return;

    function kaldir() {
      acilis.remove();
    }

    // animationend: bir CSS animasyonu bitince tetiklenir.
    // İçteki harflerin animasyonları da buraya ulaşır, o yüzden
    // sadece katmanın kendi "kaybol" animasyonunu dinliyoruz.
    acilis.addEventListener('animationend', function (olay) {
      if (olay.animationName === 'acilis-kaybol') {
        kaldir();
      }
    });

    // Yedek: bir sebeple olay gelmezse 3 saniye sonra yine kaldır
    setTimeout(kaldir, 3000);
  });
})();
