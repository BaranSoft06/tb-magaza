// =========================================================
// T&B — ÜRÜN ARAMA
// Menüdeki büyüteç ikonuna basınca yukarıdan açılan arama paneli.
// Yazdıkça ürünler anında listelenir. Enter'a basınca ürünler
// sayfası "?ara=..." ile açılır ve liste bu aramaya göre süzülür.
// Tüm sayfalarda kullanılır.
//
// Bu dosyadaki isimlerin hepsi "arama" ile başlıyor: dosyalar aynı
// sayfada birlikte çalıştığı için başka bir dosyadaki bir isimle
// (ör. urunler.js'teki "durum") çakışmasınlar.
// =========================================================

// =========================================================
// 1. TÜRKÇE KARAKTERE DUYARSIZ KARŞILAŞTIRMA
// Aranan kelimeyi de ürün bilgilerini de aynı "sade" hale
// getiriyoruz: hepsi küçük harf, Türkçe harfler İngilizce
// karşılığına dönmüş. Böylece "gomlek", "GÖMLEK" ve "Gömlek"
// hepsi "gomlek" olur ve birbirini bulur.
// =========================================================

// Tek bir harfi sadeleştirir: "Ğ" → "g", "İ" → "i", "ş" → "s"
function aramaHarfiSadelestir(harf) {
  // Türkçe İ/ı sorunu: JavaScript'in normal toLowerCase()'i "I"yı "i"ye
  // ve "İ"yi "i̇"ye (i + üstte nokta, İKİ karakter) çevirir. Türkçede ise
  // I'nın küçüğü ı, İ'nin küçüğü i'dir. Bu iki harfi elle çeviriyoruz,
  // diğerleri için Türkçe kurallarla küçültüyoruz ('tr-TR').
  let kucuk;
  if (harf === 'İ') kucuk = 'i';
  else if (harf === 'I') kucuk = 'ı';
  else kucuk = harf.toLocaleLowerCase('tr-TR');

  // normalize('NFD'): "ö" gibi harfleri "o" + "¨" (iki nokta işareti) olarak
  // ikiye ayırır. Ardından replace ile bu işaretleri siliyoruz (Unicode'da
  // ̀-ͯ aralığı bu "harfin üstüne/altına konan işaretler").
  // Böylece ö→o, ü→u, ş→s, ç→c, ğ→g olur. "ı"nın ayrılacak bir işareti
  // yok, onu ayrıca "i" yapıyoruz. Sonuçta "I", "ı", "İ", "i" hepsi "i".
  return kucuk
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i');
}

// Bütün bir metni sadeleştirir. Vurgulama için her sade harfin
// asıl metinde nereden başlayıp nerede bittiğini de not eder.
function aramaSadelestirKonumlu(metin) {
  let sade = '';
  const baslar = []; // sade harfin asıl metindeki başlangıç konumu
  const biter = [];  // ... ve bitiş konumu
  let konum = 0;

  // for...of: metni harf harf gezer
  for (const harf of metin) {
    for (const sadeHarf of aramaHarfiSadelestir(harf)) {
      sade += sadeHarf;
      baslar.push(konum);
      biter.push(konum + harf.length);
    }
    konum += harf.length;
  }
  return { sade: sade, baslar: baslar, biter: biter };
}

function aramaSadelestir(metin) {
  return aramaSadelestirKonumlu(metin).sade;
}

// Arama en az kaç harften sonra başlasın. Tek harf ("ı", "e") neredeyse
// her kelimede geçtiği için bütün ürünleri getiriyordu.
const ARAMA_EN_AZ_HARF = 2;

// Boşluklar sayılmadan yeterince harf yazılmış mı? ("a b" → 2 harf)
function aramaYeterliMi(sorgu) {
  return sorgu.replace(/\s/g, '').length >= ARAMA_EN_AZ_HARF;
}

// Aranan metni kelimelere böler: "  Kadın   GÖMLEK " → ["kadin", "gomlek"]
function aramaKelimeleri(sorgu) {
  return aramaSadelestir(sorgu)
    .split(/\s+/) // bir ya da daha fazla boşluktan böl
    .filter(Boolean) // boş parçaları at
    .map(function (kelime) {
      // Çoğul eki: "gömlekler" → "gomlek", "kargolar" → "kargo".
      // Kısa kelimelere dokunmuyoruz ki kelimenin kendisi bozulmasın.
      if (kelime.length >= 6 && /(ler|lar)$/.test(kelime)) {
        return kelime.slice(0, -3);
      }
      return kelime;
    });
}

// =========================================================
// 2. ARAMA VE PUANLAMA
// Her ürünün aranabilir bilgilerini bir kez sadeleştirip saklıyoruz
// (önbellek); her tuş vuruşunda yeniden hesaplamaya gerek kalmıyor.
// =========================================================
const aramaOnbellek = new Map(); // Map: anahtar → değer çiftleri tutan liste

function aramaAlanlari(urun) {
  if (!aramaOnbellek.has(urun.id)) {
    aramaOnbellek.set(urun.id, {
      ad: aramaSadelestir(urun.ad),
      etiket: aramaSadelestir(CINSIYET_ADI[urun.cinsiyet] + ' ' + TUR_ADI[urun.tur]),
      renk: aramaSadelestir(urun.renkler.map(function (r) { return r.ad; }).join(' ')),
      aciklama: aramaSadelestir(urun.aciklama)
    });
  }
  return aramaOnbellek.get(urun.id);
}

// Kelime, alandaki bir kelimenin BAŞINDA mı? ("kar" → "kargo pantolon": evet)
function aramaKelimeBasindaMi(alan, kelime) {
  return (' ' + alan).includes(' ' + kelime);
}

// Ürünün bu aramaya uygunluk puanı. 0 = uymuyor.
// Her kelime üründe bir yerde geçmeli; adda geçmesi en değerlisi.
function aramaPuani(urun, kelimeler, aciklamaDahil) {
  const alan = aramaAlanlari(urun);
  let toplam = 0;

  for (const kelime of kelimeler) {
    let puan = 0;
    if (aramaKelimeBasindaMi(alan.ad, kelime)) puan = 5;
    else if (alan.ad.includes(kelime)) puan = 3;
    else if (alan.etiket.includes(kelime)) puan = 2;
    else if (alan.renk.includes(kelime)) puan = 1;
    else if (aciklamaDahil && alan.aciklama.includes(kelime)) puan = 1;

    if (puan === 0) return 0; // bir kelime bile tutmadıysa ürün elenir
    toplam += puan;
  }
  return toplam;
}

// Aramaya uyan ürünleri, en uygun olan başta olacak şekilde döndürür
function urunAra(sorgu) {
  if (!aramaYeterliMi(sorgu)) return [];
  const kelimeler = aramaKelimeleri(sorgu);
  if (kelimeler.length === 0) return [];

  function ara(aciklamaDahil) {
    return URUNLER
      .map(function (urun) {
        return { urun: urun, puan: aramaPuani(urun, kelimeler, aciklamaDahil) };
      })
      .filter(function (sonuc) { return sonuc.puan > 0; })
      // Puanı yüksek olan önce; eşitse listedeki ("Önerilen") sıra korunur
      .sort(function (a, b) { return b.puan - a.puan; })
      .map(function (sonuc) { return sonuc.urun; });
  }

  // Açıklamalara sadece hiç sonuç çıkmazsa bakıyoruz. Yoksa "gömlek"
  // araması, açıklamasında "gömlekle şık" yazan pantolonu da getirirdi.
  const sonuclar = ara(false);
  return sonuclar.length > 0 ? sonuclar : ara(true);
}

// Sonuç bulunamayınca gösterilecek öneri ürünler.
// Cinsiyet verilirse (ör. ürünler sayfasında "Kadın" seçiliyse) ona göre.
function aramaOnerileri(cinsiyet) {
  return URUNLER
    .filter(function (urun) {
      return !cinsiyet || cinsiyet === 'tumu' || urun.cinsiyet === cinsiyet;
    })
    .slice(0, 4); // slice: listenin ilk 4 öğesi
}

// =========================================================
// 3. VURGULAMA
// Ürün adında aranan kısmı <mark> etiketiyle sarar:
// "gomlek" araması → "Oxford <mark>Gömlek</mark>"
// =========================================================

// Metni HTML olarak güvenle yazmak için: "<" gibi işaretler
// etiket sanılmasın, düz yazı olarak görünsün.
function aramaGuvenliYaz(metin) {
  return metin
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function aramaVurgula(metin, sorgu) {
  const konumlu = aramaSadelestirKonumlu(metin);
  const araliklar = []; // vurgulanacak [başlangıç, bitiş] parçaları

  aramaKelimeleri(sorgu).forEach(function (kelime) {
    let yer = konumlu.sade.indexOf(kelime);
    while (yer !== -1) {
      araliklar.push([
        konumlu.baslar[yer],
        konumlu.biter[yer + kelime.length - 1]
      ]);
      yer = konumlu.sade.indexOf(kelime, yer + kelime.length);
    }
  });

  if (araliklar.length === 0) return aramaGuvenliYaz(metin);

  // Parçaları sırala, iç içe geçenleri birleştir
  araliklar.sort(function (a, b) { return a[0] - b[0]; });
  const birlesik = [araliklar[0]];
  araliklar.slice(1).forEach(function (aralik) {
    const son = birlesik[birlesik.length - 1];
    if (aralik[0] <= son[1]) son[1] = Math.max(son[1], aralik[1]);
    else birlesik.push(aralik);
  });

  let sonuc = '';
  let konum = 0;
  birlesik.forEach(function (aralik) {
    sonuc += aramaGuvenliYaz(metin.slice(konum, aralik[0]));
    sonuc += '<mark>' + aramaGuvenliYaz(metin.slice(aralik[0], aralik[1])) + '</mark>';
    konum = aralik[1];
  });
  return sonuc + aramaGuvenliYaz(metin.slice(konum));
}

// Ürünler sayfasının adresi: "urunler.html?ara=gömlek".
// encodeURIComponent: boşluk ve Türkçe harfleri adrese uygun hale getirir.
function aramaSayfasiAdresi(sorgu) {
  return 'urunler.html?ara=' + encodeURIComponent(sorgu.trim());
}

// =========================================================
// 4. ARAMA PANELİ
// Paneli her sayfaya HTML olarak kopyalamak yerine burada
// oluşturuyoruz; menüye sadece büyüteç butonu ekleniyor.
// =========================================================
const aramaButonu = document.querySelector('.arama-ikon');
const aramaHareketiAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ARAMA_EN_FAZLA = 6; // panelde en fazla kaç sonuç görünsün
const ARAMA_POPULER = ['Gömlek', 'Pantolon', 'Ceket', 'Kadın', 'Erkek', 'Denim'];

const aramaPaneli = document.createElement('dialog');
aramaPaneli.className = 'arama-paneli';
aramaPaneli.setAttribute('aria-label', 'Ürün ara');
aramaPaneli.innerHTML = `
  <div class="arama-ic">
    <span class="arama-amp" aria-hidden="true">&amp;</span>

    <!-- role="search": ekran okuyuculara bunun bir arama alanı olduğunu söyler -->
    <form class="arama-form" role="search">
      <svg class="arama-form-ikon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/>
      </svg>
      <label for="arama-kutu" class="gizli">Ürün ara</label>
      <!-- autofocus: panel açılınca imleç direkt bu kutuya gelsin -->
      <input type="search" id="arama-kutu" class="arama-kutu" placeholder="Ne arıyorsun?"
             autocomplete="off" spellcheck="false" enterkeyhint="search" autofocus>
      <button type="button" class="arama-kapat" aria-label="Aramayı kapat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
    </form>

    <div class="arama-populer">
      <p class="arama-baslik">Popüler aramalar</p>
      <ul class="arama-cipler">
        ${ARAMA_POPULER.map(function (kelime) {
          return `<li><button type="button" class="arama-cip">${kelime}</button></li>`;
        }).join('')}
      </ul>
    </div>

    <!-- aria-live: sonuç sayısı değişince ekran okuyucu okusun -->
    <p class="arama-durum" aria-live="polite"></p>
    <ul class="arama-sonuclar"></ul>
    <a class="arama-tumu" hidden></a>
  </div>`;
document.body.append(aramaPaneli);

const aramaKutu = aramaPaneli.querySelector('.arama-kutu');
const aramaForm = aramaPaneli.querySelector('.arama-form');
const aramaPopuler = aramaPaneli.querySelector('.arama-populer');
const aramaDurum = aramaPaneli.querySelector('.arama-durum');
const aramaSonucListesi = aramaPaneli.querySelector('.arama-sonuclar');
const aramaTumu = aramaPaneli.querySelector('.arama-tumu');

// Tek bir sonuç satırı. Tıklayınca (şimdilik) ürünler sayfasında
// o ürünün hızlı bakış penceresi açılır. Ürün detay sayfası
// hazır olunca buradaki adres "urun.html?id=..." olacak.
function aramaSonucOlustur(urun, sorgu, sira) {
  const fiyat = urun.eskiFiyat
    ? `<del>${fiyatYaz(urun.eskiFiyat)}</del> <span class="arama-sonuc-indirimli">${fiyatYaz(urun.fiyat)}</span>`
    : fiyatYaz(urun.fiyat);

  // --sira: CSS'teki animasyon gecikmesi; satırlar arka arkaya gelsin
  return `
    <li style="--sira: ${sira}">
      <a class="arama-sonuc" href="urunler.html?bak=${urun.id}" data-id="${urun.id}">
        <span class="arama-sonuc-gorsel zemin-${urun.zemin}">${cizimOlustur(urun)}</span>
        <span class="arama-sonuc-bilgi">
          <span class="arama-sonuc-tur">${CINSIYET_ADI[urun.cinsiyet]} · ${TUR_ADI[urun.tur]}</span>
          <span class="arama-sonuc-ad">${aramaVurgula(urun.ad, sorgu)}</span>
        </span>
        <span class="arama-sonuc-fiyat">${fiyat}</span>
      </a>
    </li>`;
}

// Kutudaki yazı her değiştiğinde çalışır
function aramaGuncelle() {
  const sorgu = aramaKutu.value.trim();

  // Kutu boşsa ya da tek harf yazılmışsa: sadece popüler aramalar
  if (!aramaYeterliMi(sorgu)) {
    aramaPopuler.hidden = false;
    aramaDurum.textContent = '';
    aramaSonucListesi.innerHTML = '';
    aramaTumu.hidden = true;
    return;
  }

  aramaPopuler.hidden = true;
  const sonuclar = urunAra(sorgu);

  if (sonuclar.length === 0) {
    // textContent: yazıyı HTML olarak değil düz yazı olarak koyar.
    // Kullanıcının yazdığı bir şey asla kod olarak çalışmasın diye.
    aramaDurum.textContent = `‘${sorgu}’ için sonuç bulunamadı. Bunlara göz atabilirsin:`;
    aramaDurum.classList.add('arama-durum-bos');
    aramaSonucListesi.innerHTML = aramaOnerileri()
      .map(function (urun, i) { return aramaSonucOlustur(urun, '', i); })
      .join('');
    aramaTumu.hidden = true;
    return;
  }

  aramaDurum.textContent = sonuclar.length + ' sonuç';
  aramaDurum.classList.remove('arama-durum-bos');
  aramaSonucListesi.innerHTML = sonuclar
    .slice(0, ARAMA_EN_FAZLA)
    .map(function (urun, i) { return aramaSonucOlustur(urun, sorgu, i); })
    .join('');

  aramaTumu.hidden = false;
  aramaTumu.href = aramaSayfasiAdresi(sorgu);
  aramaTumu.innerHTML = sonuclar.length > ARAMA_EN_FAZLA
    ? `${sonuclar.length} sonucun hepsini gör <span aria-hidden="true">→</span>`
    : `Ürünler sayfasında gör <span aria-hidden="true">→</span>`;
}

function aramaAc() {
  if (aramaPaneli.open) return;

  // Telefonda hamburger menü açıksa kapansın (js/menu.js)
  if (typeof menuyuAyarla === 'function') menuyuAyarla(false);

  aramaPaneli.classList.remove('kapaniyor');
  aramaPaneli.showModal();
  aramaButonu.setAttribute('aria-expanded', 'true');
  // Önceki aramayı seçili getir: yeni bir şey yazınca hemen yerine geçer
  aramaKutu.focus();
  aramaKutu.select();

  // Özel imleç panelin arkasında kalmasın (bkz. js/imlec.js)
  if (window.imleciOneGetir) window.imleciOneGetir();
}

// "sonra": panel tamamen kapandıktan sonra yapılacak iş (isteğe bağlı)
function aramaKapat(sonra) {
  if (!aramaPaneli.open || aramaPaneli.classList.contains('kapaniyor')) return;

  function bitir() {
    aramaPaneli.classList.remove('kapaniyor');
    aramaPaneli.close();
    aramaButonu.setAttribute('aria-expanded', 'false');
    if (sonra) sonra();
  }

  if (aramaHareketiAzalt) {
    bitir();
    return;
  }

  aramaPaneli.classList.add('kapaniyor');
  aramaPaneli.addEventListener('animationend', function bitti(olay) {
    // İçerideki başka animasyonlar (ör. sonuç satırları) yanlışlıkla kapatmasın
    if (olay.target !== aramaPaneli) return;
    aramaPaneli.removeEventListener('animationend', bitti);
    bitir();
  });
}

// Yazıyı ürünler sayfasına götürür (Enter ya da "hepsini gör")
function aramaSayfasinaGit(sorgu) {
  if (!aramaYeterliMi(sorgu)) return;
  window.location.href = aramaSayfasiAdresi(sorgu);
}

if (aramaButonu) {
  aramaButonu.addEventListener('click', aramaAc);

  // "input" olayı: kutudaki yazı her değiştiğinde (harf yazma, silme, yapıştırma)
  aramaKutu.addEventListener('input', aramaGuncelle);

  // Enter'a basınca form "gönderilir"; sayfayı yenilemesini engelleyip
  // ürünler sayfasına kendimiz gidiyoruz
  aramaForm.addEventListener('submit', function (olay) {
    olay.preventDefault();
    aramaSayfasinaGit(aramaKutu.value);
  });

  aramaPaneli.addEventListener('click', function (olay) {
    // Panelin kendisine tıklanması = alttaki bulanık alana tıklanması
    if (olay.target === aramaPaneli || olay.target.closest('.arama-kapat')) {
      aramaKapat();
      return;
    }

    // Popüler arama: kelimeyi kutuya yaz ve ara
    const cip = olay.target.closest('.arama-cip');
    if (cip) {
      aramaKutu.value = cip.textContent;
      aramaGuncelle();
      aramaKutu.focus();
      return;
    }

    // Ürünler sayfasındaysak sayfayı yeniden yüklemeye gerek yok:
    // panel kapanınca hızlı bakış penceresini direkt açıyoruz
    // (hizliBakisAc, js/urunler.js'te tanımlı; başka sayfalarda yok)
    const sonuc = olay.target.closest('.arama-sonuc');
    if (sonuc && typeof hizliBakisAc === 'function') {
      olay.preventDefault();
      aramaKapat(function () { hizliBakisAc(sonuc.dataset.id); });
    }
  });

  // Esc'ye basılınca tarayıcı paneli hemen kapatır. preventDefault ile
  // bunu durdurup kendi animasyonlu kapatmamızı kullanıyoruz.
  aramaPaneli.addEventListener('cancel', function (olay) {
    olay.preventDefault();
    aramaKapat();
  });

  // ↑ ↓ ok tuşlarıyla kutu ve sonuçlar arasında gezinme
  aramaPaneli.addEventListener('keydown', function (olay) {
    if (olay.key !== 'ArrowDown' && olay.key !== 'ArrowUp') return;

    const duraklar = [aramaKutu].concat(
      Array.from(aramaPaneli.querySelectorAll('.arama-sonuc, .arama-tumu:not([hidden])'))
    );
    const simdiki = duraklar.indexOf(document.activeElement);
    if (simdiki === -1) return;

    const yon = olay.key === 'ArrowDown' ? 1 : -1;
    const sonraki = Math.min(Math.max(simdiki + yon, 0), duraklar.length - 1);
    duraklar[sonraki].focus();
    olay.preventDefault(); // sayfa kaymasın, kutudaki imleç zıplamasın
  });

  // Kısayol: bilgisayarda "/" tuşu aramayı açar (birçok sitede böyledir).
  // Bir kutuya yazı yazarken "/" basılırsa açılmasın.
  document.addEventListener('keydown', function (olay) {
    if (olay.key !== '/' || olay.ctrlKey || olay.metaKey || olay.altKey) return;
    const hedef = olay.target;
    if (hedef.closest('input, textarea, select, [contenteditable]')) return;
    if (document.querySelector('dialog[open]')) return; // başka pencere açıksa
    olay.preventDefault(); // "/" kutuya yazılmasın
    aramaAc();
  });
}
