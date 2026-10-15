// =========================================================
// T&B — ÜRÜN LİSTESİ
// Sitedeki tüm ürünler burada, tek bir yerde durur. Ürünler,
// ürün detay, sepet ve favoriler sayfaları bu listeyi kullanır.
// Yeni ürün eklemek ya da fiyat değiştirmek için sadece bu
// dosyayı düzenlemek yeterli.
//
// Alanlar:
//   id        → adres çubuğunda kullanılacak kısa ad (Türkçe karakter yok)
//   cinsiyet  → 'kadin' veya 'erkek'
//   tur       → 'gomlek', 'pantolon' veya 'ceket' (yer tutucu çizimi bunu seçer)
//   fiyat     → satış fiyatı (TL)
//   eskiFiyat → sadece indirimli ürünlerde: üstü çizili eski fiyat
//   yeni      → true ise kartta mor "Yeni" etiketi çıkar
//   eklenme   → siteye eklenme tarihi ("En yeniler" sıralaması için)
//   zemin     → yer tutucu görselin marka rengi: sari, mercan, mor, krem
//   renkler   → ürünün renk seçenekleri (kumaş renkleri, marka rengi değil)
//
// Liste sırası "Önerilen" sıralamasıdır: kadın ve erkek ürünleri
// karışık dizildi ki "Tümü" görünümü dengeli olsun.
// =========================================================

const BEDENLER_KADIN = ['XS', 'S', 'M', 'L', 'XL'];
const BEDENLER_ERKEK = ['S', 'M', 'L', 'XL', 'XXL'];

const URUNLER = [
  {
    id: 'kruvaze-blazer-ceket',
    ad: 'Kruvaze Blazer Ceket',
    cinsiyet: 'kadin',
    tur: 'ceket',
    fiyat: 2199,
    yeni: true,
    eklenme: '2026-10-10',
    zemin: 'sari',
    renkler: [
      { ad: 'Siyah', kod: '#1E1E1E' },
      { ad: 'Ekru', kod: '#EFE6D6' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Omuzları belirgin, kruvaze kesim blazer. Ofiste de hafta sonu da tişörtün üstüne.'
  },
  {
    id: 'oxford-gomlek',
    ad: 'Oxford Gömlek',
    cinsiyet: 'erkek',
    tur: 'gomlek',
    fiyat: 899,
    yeni: true,
    eklenme: '2026-10-08',
    zemin: 'mercan',
    renkler: [
      { ad: 'Beyaz', kod: '#F7F7F2' },
      { ad: 'Açık mavi', kod: '#BFD3EA' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Kalın dokulu oxford kumaştan klasik gömlek. Ütü istemeyen, her şeye uyan bir parça.'
  },
  {
    id: 'keten-oversize-gomlek',
    ad: 'Keten Oversize Gömlek',
    cinsiyet: 'kadin',
    tur: 'gomlek',
    fiyat: 949,
    eklenme: '2026-08-20',
    zemin: 'mor',
    renkler: [
      { ad: 'Krem', kod: '#F3E9DC' },
      { ad: 'Haki', kod: '#8A8F6A' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Bol kesim, nefes alan keten gömlek. Tek başına ya da açık olarak ceket gibi giyilir.'
  },
  {
    id: 'rahat-kesim-kargo-pantolon',
    ad: 'Rahat Kesim Kargo Pantolon',
    cinsiyet: 'erkek',
    tur: 'pantolon',
    fiyat: 919,
    eskiFiyat: 1149,
    eklenme: '2026-07-15',
    zemin: 'krem',
    renkler: [
      { ad: 'Haki', kod: '#6F7350' },
      { ad: 'Siyah', kod: '#1E1E1E' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Geniş cepli, rahat kesim kargo pantolon. Paçası lastikli, günlük kullanım için ideal.'
  },
  {
    id: 'wide-leg-pantolon',
    ad: 'Yüksek Bel Wide Leg Pantolon',
    cinsiyet: 'kadin',
    tur: 'pantolon',
    fiyat: 1249,
    eklenme: '2026-09-05',
    zemin: 'mercan',
    renkler: [
      { ad: 'Bej', kod: '#D8C3A5' },
      { ad: 'Siyah', kod: '#1E1E1E' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Yüksek bel, geniş paça pantolon. Boyu uzun gösterir, sneaker ile de topuklu ile de olur.'
  },
  {
    id: 'denim-ceket',
    ad: 'Denim Ceket',
    cinsiyet: 'erkek',
    tur: 'ceket',
    fiyat: 1799,
    eklenme: '2026-08-02',
    zemin: 'sari',
    renkler: [
      { ad: 'Koyu mavi', kod: '#3B5A80' },
      { ad: 'Siyah', kod: '#1E1E1E' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Sağlam dokulu klasik denim ceket. Zamanla yumuşar, her yıkamada daha çok senin olur.'
  },
  {
    id: 'saten-gomlek',
    ad: 'Saten Gömlek',
    cinsiyet: 'kadin',
    tur: 'gomlek',
    fiyat: 879,
    eskiFiyat: 1099,
    eklenme: '2026-07-28',
    zemin: 'krem',
    renkler: [
      { ad: 'Şampanya', kod: '#E8CFA8' },
      { ad: 'Siyah', kod: '#1E1E1E' },
      { ad: 'Bordo', kod: '#7A1F2B' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Hafif parlak saten gömlek. Jean ile günlük, kumaş pantolonla akşam şıklığı.'
  },
  {
    id: 'keten-kisa-kollu-gomlek',
    ad: 'Keten Kısa Kollu Gömlek',
    cinsiyet: 'erkek',
    tur: 'gomlek',
    fiyat: 799,
    eklenme: '2026-08-12',
    zemin: 'mor',
    renkler: [
      { ad: 'Beyaz', kod: '#F7F7F2' },
      { ad: 'Toprak', kod: '#B5653C' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Kısa kollu, rahat yakalı keten gömlek. Sıcak günlerin en serin parçası.'
  },
  {
    id: 'crop-denim-ceket',
    ad: 'Crop Denim Ceket',
    cinsiyet: 'kadin',
    tur: 'ceket',
    fiyat: 1699,
    yeni: true,
    eklenme: '2026-10-01',
    zemin: 'mercan',
    renkler: [
      { ad: 'Açık mavi', kod: '#9DB8D9' },
      { ad: 'Siyah', kod: '#1E1E1E' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Bel hizasında biten kısa denim ceket. Yüksek bel pantolonlarla tam uyum.'
  },
  {
    id: 'chino-pantolon',
    ad: 'Chino Pantolon',
    cinsiyet: 'erkek',
    tur: 'pantolon',
    fiyat: 1099,
    eklenme: '2026-09-12',
    zemin: 'sari',
    renkler: [
      { ad: 'Bej', kod: '#D8C3A5' },
      { ad: 'Lacivert', kod: '#22304A' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Hafif esnek kumaştan düz kesim chino. Gömlekle şık, tişörtle rahat.'
  },
  {
    id: 'kargo-pantolon',
    ad: 'Kargo Pantolon',
    cinsiyet: 'kadin',
    tur: 'pantolon',
    fiyat: 1199,
    eklenme: '2026-09-18',
    zemin: 'krem',
    renkler: [
      { ad: 'Haki', kod: '#8A8F6A' },
      { ad: 'Taş', kod: '#C9C0B1' }
    ],
    bedenler: BEDENLER_KADIN,
    aciklama: 'Düşük bel, bol paça kargo pantolon. Yan cepleri hem kullanışlı hem iddialı.'
  },
  {
    id: 'bomber-ceket',
    ad: 'Bomber Ceket',
    cinsiyet: 'erkek',
    tur: 'ceket',
    fiyat: 1799,
    eskiFiyat: 2399,
    eklenme: '2026-06-30',
    zemin: 'mor',
    renkler: [
      { ad: 'Siyah', kod: '#1E1E1E' },
      { ad: 'Haki', kod: '#6F7350' }
    ],
    bedenler: BEDENLER_ERKEK,
    aciklama: 'Hafif dolgulu, ribanalı bomber ceket. Mevsim geçişlerinin vazgeçilmezi.'
  }
];
