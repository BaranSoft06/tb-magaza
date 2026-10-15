# T&B — Proje Talimatları

Bu dosya, T&B projesinde çalışırken Claude'un nasıl davranacağını anlatır. Claude her oturumun başında bu dosyayı okur.

## Proje

T&B; Baran ve Taylan'ın kendi tasarladıkları kadın ve erkek kıyafetlerini satacağı bir giyim markası. Bu klasör markanın e-ticaret sitesidir.

- Tarz: şık ve günlük giyim (gömlek, pantolon, ceket)
- Hedef kitle: önce gençler; iş büyüdükçe genişleyecek
- Site havası: cesur, renkli, enerjik; bol animasyon
- Ürün görselleri: ürünler hazır olana kadar örnek görseller
- Baran kod tarafında, Taylan ticaret tarafında

## Çalışma şekli

- **Kodu Claude yazar.** Baran fikirleri, örnek siteleri ve görselleri getirir; kararları birlikte veririz.
- **Önce plan, sonra kod.** Her yeni özellikten önce kısa bir plan çıkar (hangi dosyalar, ne yapılacak) ve Baran onaylayınca yaz.
- **Küçük adımlar.** Bir seferde tek bir sayfa ya da özellik. Her adımın sonunda site tarayıcıda çalışır durumda olmalı.
- **Her değişiklikten sonra kısa açıklama.** Türkçe, sade bir dille: ne yaptın, neden böyle yaptın, öğrenilecek bir kavram varsa bir iki cümleyle anlat. Uzun ders anlatma.
- **Kodun içine Türkçe yorumlar** yaz, özellikle yeni bir kavram ilk kez kullanıldığında.
- **Emin olmadığında sor.** Tasarım ya da içerik kararlarını (renk, metin, sayfa düzeni) kendi başına değiştirme.
- **Git:** Her tamamlanan adımdan sonra Baran'a commit atmayı öner ve anlaşılır bir Türkçe commit mesajı yaz.
- Baran kendini her zaman net ifade edemeyebilir; istediğini tahmin etmek yerine kısa sorularla netleştir.

## Teknoloji (Aşama 1)

- Sadece HTML, CSS ve JavaScript. Framework yok, build aracı yok.
- Siteyi VS Code'daki Live Server ile çalıştırıyoruz.
- Sepet verisi tarayıcıda `localStorage` ile tutulur.
- Gerçek ödeme yok: sepetin sonunda demo ödeme ekranı ve sepeti WhatsApp mesajı olarak gönderen bir buton olacak.
- WhatsApp numarası sadece `js/ayarlar.js` içinde durur (şimdilik demo numara). Gerçek numara belli olunca sadece orası değişir; numarayı başka dosyalara yazma.
- Önce telefon ekranına göre tasarla (mobile-first), sonra büyük ekranlara uyarla.

## Marka

Renkler (CSS değişkeni olarak tanımla, sabit renk kodlarını dosyalara dağıtma):

| Ad | Kod | Kullanım |
| --- | --- | --- |
| Gece siyahı | #141414 | Ana zemin, yazılar |
| Güneş sarısı | #FFC93C | Ampersand, vurgular |
| Mercan turuncu | #FF5A36 | Butonlar, indirim etiketleri |
| Elektrik moru | #6C3BFF | İkinci vurgu, animasyonlar |
| Krem | #FFF4EC | Açık zeminler |

Fontlar (Google Fonts):
- Syne: başlıklar ve logodaki T ile B
- Playfair Display, italik: logodaki "&" işareti
- DM Sans: metinler

Rakamlar, fiyatlar, % işareti ve küçük ürün etiketleri her zaman DM Sans ile yazılır. Sadece harflerden oluşan, geniş harf aralıklı büyük harf etiketleri (şerit, bölüm başlıkları) Syne olabilir.

Logo: "T&B" yazısı; T ve B kalın Syne, aradaki "&" büyük, italik ve sarı. Küçük kullanımlarda sadece "&" ikonu.

## Sayfalar (Aşama 1)

1. Ana sayfa: animasyonlu giriş ("&" işaretinin dönerek ortaya çıkması), öne çıkan ürünler
2. Ürünler: ürün listesi, kadın/erkek filtresi
3. Ürün detay: fotoğraf, açıklama, fiyat, beden seçimi, sepete ekle
4. Sepet: ekle/çıkar, adet, toplam, demo ödeme ve WhatsApp butonu
5. Hakkımızda
6. İletişim
7. Kendin Tasarla: seçili ürünlerde renk, kumaş, baskı vb. seçimi, canlı görsel, tahmini fiyat

## Klasör yapısı

```
TB/
├── index.html
├── urunler.html
├── urun.html
├── sepet.html
├── odeme.html
├── tasarla.html
├── favoriler.html
├── hakkimizda.html
├── iletisim.html
├── css/
├── js/
└── img/
```

Dosya ve klasör adlarında Türkçe karakter, boşluk ve `&` kullanma.

## Yol haritası

Her adım ayrı yapılır. Kod yazmadan önce plan anlatılır, Baran onaylayınca yazılır.
Genel hava: çok dinamik, hareketli ve ilgi çekici; ama animasyonlar sayfayı yavaşlatmamalı.

0. Başlangıç
   - [x] Ana sayfa açılış animasyonu ("&" dönerek ortaya çıkıyor)
   - [x] Üst menü (logo, linkler, sepet ikonu, telefonda hamburger)
   - [x] Ana sayfa karşılama alanı (hero)
1. Siteyi baştan sona saran özellikler
   - [x] Sayfanın en üstünde sürekli kayan yazı şeridi ("Ücretsiz kargo • Yeni sezon • Kendi tasarımımız" gibi)
   - [x] Markaya uygun özel fare imleci (sadece bilgisayarda, telefonda normal kalsın)
   - [x] Sayfalar arası yumuşak geçiş animasyonu
   - [ ] Menüde ürün arama
   - [x] Footer: logo, linkler, sosyal medya, "Bu bir demo sitedir" notu
2. Ürünler sayfası
   - [x] 12 demo ürün (6 kadın, 6 erkek; şık ve günlük giyim; gerçekçi TL fiyatlar)
   - [x] Marka renklerinde yer tutucu görseller
   - [x] Tümü / Kadın / Erkek filtresi
   - [ ] Kaydırdıkça beliren kartlar
   - [ ] Kalp ikonuyla favorilere ekleme
   - [ ] Açılan pencerede hızlı bakış
3. Ürün detay sayfası
   - [ ] Büyük görsel
   - [ ] Beden ve renk seçimi
   - [ ] Sepete eklerken ürünün sepet ikonuna uçma animasyonu
4. Sepet sayfası
   - [ ] Ürün ekleme / çıkarma, adet, toplam fiyat
   - [ ] Sepeti WhatsApp mesajı olarak gönderen buton
5. Ödeme sayfası (DEMO)
   - [ ] Gerçek kredi kartı görseli
   - [ ] Kart numarası, isim ve son kullanma tarihi yazıldıkça kartın üzerinde kendi yerinde belirsin
   - [ ] CVC kutusuna tıklayınca kart dönüp arka yüzü görünsün
   - [ ] Numaranın başına göre Visa / Mastercard logosu
   - [ ] Sipariş tamamlanınca konfeti efekti
   - [ ] Kart bilgileri hiçbir yere gönderilmez ve kaydedilmez; sayfada "Bu bir demodur, gerçek ödeme alınmaz" yazar
6. Kendin Tasarla (Taylan onayladı)
   - [ ] Ürün verisine her ürün için `kisisellestirilebilir: true/false` alanı; demo ürünlerden 5-6 tanesi (genellikle düşük ve orta fiyatlılar) seçilir
   - [ ] Bu ürünlerin kartında küçük "Kendin tasarla" rozeti, detay sayfasında "Kendin tasarla" butonu
   - [ ] Tasarım sayfası (tasarla.html): renk, kumaş, kalıp, baskı (ön/arka/kol, yazı veya desen), nakış, düğme/yaka tipi seçimi
   - [ ] Kıyafet görseli seçimlere göre canlı olarak değişir
   - [ ] "Özel isteğin var mı?" metin kutusu; bu isteklerin fiyatının sonra bildirileceği notu
   - [ ] Fiyat: ürünün kendi fiyatı + seçimlerin ek ücretleri. Ek ücretler tek bir dosyada (js/tasarim-fiyatlari.js) tablo halinde durur, Taylan kolayca değiştirebilir; şimdilik gerçekçi demo değerler
   - [ ] Fiyat sayaç animasyonuyla artar; yanında hangi seçimin ne kadar eklediği liste olarak görünür; fiyatın yanında "tahmini fiyat" yazar
   - [ ] Tasarlanan ürün seçimleriyle birlikte sepete eklenir
7. Demo sohbet asistanı
   - [ ] Sağ altta sohbet balonu, tüm sayfalarda; ödeme sayfasında form alanlarının üstüne binmez
   - [ ] Üzerinde "Demo asistan" yazar, yapay zeka gibi gösterilmez
   - [ ] Sık sorulan sorulara (kargo, iade, beden, kişiselleştirme) hazır cevaplar
   - [ ] Cevabı yoksa WhatsApp'a yönlendirir
8. Favoriler sayfası
   - [ ] Favorilere eklenen ürünlerin listesi
9. Hakkımızda ve İletişim sayfaları
   - [ ] Hakkımızda
   - [ ] İletişim

## Aşama 2 (ileride)

Aşama 1 bitmeden bu bölümdeki işlere başlanmaz; burada sadece hedef olarak not ediliyor.

- Sohbet asistanı gerçek bir yapay zekaya bağlanacak; müşteri konuşarak tasarım yapabilecek.
- Yapay zeka fiyatı kendisi uydurmayacak: fiyatı sadece js/tasarim-fiyatlari.js tablosundan hesaplayacak.
- Siparişe son onayı Taylan verecek.
