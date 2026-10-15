// =========================================================
// T&B — ÖZEL FARE İMLECİ
// Fareyi tam takip eden sarı bir nokta + onu biraz geriden
// izleyen bir halka. Link ve butonların üzerinde halka büyür.
// Sadece fareyle kullanılan cihazlarda çalışır; telefonda
// ve tablette normal davranış değişmez. Tüm sayfalarda kullanılır.
// =========================================================

(function () {
  // matchMedia: CSS medya sorgusunu JavaScript'ten sormamızı sağlar.
  // hover: hover  → cihaz "üzerine gelme" yapabiliyor (dokunmatik ekran yapamaz)
  // pointer: fine → hassas bir işaretçi var (fare veya touchpad)
  const fareVarMi = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fareVarMi) return;

  const hareketiAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // İmlecin parçalarını HTML'e elle yazmak yerine burada oluşturuyoruz,
  // böylece her sayfaya kopyalamamız gerekmiyor.
  const nokta = document.createElement('div');
  const halka = document.createElement('div');
  nokta.className = 'imlec-nokta';
  halka.className = 'imlec-halka';
  nokta.setAttribute('aria-hidden', 'true');
  halka.setAttribute('aria-hidden', 'true');
  document.body.append(nokta, halka);

  // Farenin gerçek konumu ve halkanın şu anki konumu
  let fareX = 0;
  let fareY = 0;
  let halkaX = 0;
  let halkaY = 0;
  let calisiyor = false; // animasyon döngüsü şu an açık mı?

  // Halka her karede kalan mesafenin bu kadarını kapatır.
  // Küçük sayı = daha tembel, daha çok geriden gelen halka.
  const TAKIP_HIZI = hareketiAzalt ? 1 : 0.18;

  function konumla(oge, x, y) {
    // translate3d: tarayıcı bunu ekran kartıyla çizer, sayfa yavaşlamaz
    oge.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  // requestAnimationFrame: "ekranı bir sonraki çizişinden hemen önce
  // bu fonksiyonu çalıştır" demek. Saniyede ~60 kez, ekranla uyumlu çalışır.
  function kare() {
    halkaX += (fareX - halkaX) * TAKIP_HIZI;
    halkaY += (fareY - halkaY) * TAKIP_HIZI;
    konumla(halka, halkaX, halkaY);

    // Halka fareye yetiştiyse döngüyü durdur; boşuna işlem yapmasın
    const kalan = Math.abs(fareX - halkaX) + Math.abs(fareY - halkaY);
    if (kalan > 0.1) {
      requestAnimationFrame(kare);
    } else {
      calisiyor = false;
    }
  }

  document.addEventListener('mousemove', function (olay) {
    fareX = olay.clientX;
    fareY = olay.clientY;

    // İlk harekette: normal imleci gizle, halkayı direkt farenin yerinden başlat
    if (!document.documentElement.classList.contains('ozel-imlec')) {
      document.documentElement.classList.add('ozel-imlec');
      halkaX = fareX;
      halkaY = fareY;
    }

    konumla(nokta, fareX, fareY);
    document.documentElement.classList.remove('imlec-disarida');

    if (!calisiyor) {
      calisiyor = true;
      requestAnimationFrame(kare);
    }
  });

  // Tıklanabilir bir şeyin üzerine gelince halka büyüsün.
  // Her linke ayrı ayrı dinleyici eklemek yerine tüm sayfayı dinliyoruz
  // ("olay delegasyonu"); sonradan eklenen linklerde de çalışır.
  const TIKLANABILIR = 'a, button, label, select, [data-imlec]';

  document.addEventListener('mouseover', function (olay) {
    const ustunde = olay.target.closest(TIKLANABILIR) !== null;
    document.documentElement.classList.toggle('imlec-buyuk', ustunde);
  });

  // Basılı tutarken halka küçülsün: tıklandığını hissettirir
  document.addEventListener('mousedown', function () {
    document.documentElement.classList.add('imlec-basili');
  });
  document.addEventListener('mouseup', function () {
    document.documentElement.classList.remove('imlec-basili');
  });

  // Fare pencereden çıkınca imleç kaybolsun, ekranın kenarında asılı kalmasın
  document.documentElement.addEventListener('mouseleave', function () {
    document.documentElement.classList.add('imlec-disarida');
  });

  // pageswap: başka sayfaya geçmeden hemen önce, tarayıcı geçiş animasyonu
  // için bu sayfanın fotoğrafını çekmeden önce tetiklenir. İmleci o anda
  // gizliyoruz ki fotoğrafa girip perdeyle birlikte kaymasın.
  window.addEventListener('pageswap', function () {
    document.documentElement.classList.add('imlec-gecis');
  });

  // pageshow: sayfa her gösterildiğinde tetiklenir. "Geri" tuşuyla bu sayfaya
  // dönülürse tarayıcı sayfayı hafızadan aynen getirir; imleç gizli kalmasın.
  window.addEventListener('pageshow', function () {
    document.documentElement.classList.remove('imlec-gecis');
  });
})();
