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

Logo: "T&B" yazısı; T ve B kalın Syne, aradaki "&" büyük, italik ve sarı. Küçük kullanımlarda sadece "&" ikonu.

## Sayfalar (Aşama 1)

1. Ana sayfa: animasyonlu giriş ("&" işaretinin dönerek ortaya çıkması), öne çıkan ürünler
2. Ürünler: ürün listesi, kadın/erkek filtresi
3. Ürün detay: fotoğraf, açıklama, fiyat, beden seçimi, sepete ekle
4. Sepet: ekle/çıkar, adet, toplam, demo ödeme ve WhatsApp butonu
5. Hakkımızda
6. İletişim

## Klasör yapısı

```
TB/
├── index.html
├── urunler.html
├── urun.html
├── sepet.html
├── hakkimizda.html
├── iletisim.html
├── css/
├── js/
└── img/
```

Dosya ve klasör adlarında Türkçe karakter, boşluk ve `&` kullanma.
