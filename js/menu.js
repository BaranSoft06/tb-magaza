// =========================================================
// T&B — ÜST MENÜ
// Telefonda hamburger butonuna basınca menüyü açar/kapatır.
// Tüm sayfalarda kullanılır.
// =========================================================

const hamburger = document.querySelector('.hamburger');
const anaNav = document.getElementById('ana-nav');

function menuyuAyarla(acik) {
  anaNav.classList.toggle('acik', acik);
  // aria-expanded: ekran okuyuculara menünün açık mı kapalı mı olduğunu söyler.
  // CSS de bu bilgiyi kullanarak hamburgeri X'e çeviriyor.
  hamburger.setAttribute('aria-expanded', acik);
  hamburger.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
}

if (hamburger && anaNav) {
  hamburger.addEventListener('click', function () {
    const suAnAcik = anaNav.classList.contains('acik');
    menuyuAyarla(!suAnAcik);
  });

  // Bir linke tıklanınca menüyü kapat
  anaNav.addEventListener('click', function (olay) {
    if (olay.target.closest('a')) {
      menuyuAyarla(false);
    }
  });

  // Esc tuşuyla kapat
  document.addEventListener('keydown', function (olay) {
    if (olay.key === 'Escape') {
      menuyuAyarla(false);
    }
  });
}
