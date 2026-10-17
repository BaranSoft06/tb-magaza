---
name: kaydet
description: T&B projesindeki değişiklikleri Git ile kaydeder (commit) ve GitHub'a gönderir (push). Baran "kaydet", "commit at" veya "değişiklikleri kaydet" dediğinde kullan.
---

T&B projesindeki değişiklikleri Git ile kaydet ve GitHub'a gönder (depo: BaranSoft06/tb-magaza). Adımlar:

1. `git status` ile neyin değiştiğine bak.
2. Değişiklikleri Baran'a Türkçe, madde madde ve kısaca anlat: hangi dosyalar eklendi, hangileri değişti.
3. Kısa ve anlaşılır bir Türkçe commit mesajı öner. Örnek: "Ana sayfaya giriş animasyonu eklendi".
   - Mesaj 60 karakteri geçmesin.
   - Geçmiş zamanla yaz: "eklendi", "düzeltildi", "güncellendi".
   - Baran'a bu kaydın onaydan sonra GitHub'a da gönderileceğini söyle.
4. Baran onaylayınca `git add .` ve `git commit -m "<mesaj>"` komutlarını çalıştır.
5. Commit başarılı olunca `git push` ile GitHub'a gönder.
   - Push başarısız olursa hatanın nedenini Baran'a basit bir Türkçeyle açıkla ve ne yapılabileceğini söyle. Örnekler:
     - İnternet bağlantısı yok → bağlantıyı kontrol edip tekrar denemesini öner.
     - Giriş/yetki hatası → GitHub hesabıyla tekrar giriş yapması gerektiğini anlat.
     - GitHub'da bilgisayarda olmayan yeni kayıtlar var (rejected / fetch first) → önce `git pull` ile onları indirmek gerektiğini anlat.
   - Push başarısız olsa bile commit bilgisayarda kayıtlıdır; bunu da söyle.
   - Hatayı düzeltmek için başka bir Git komutu (pull vb.) çalıştırmadan önce Baran'a sor. `git push --force` asla kullanma.
6. `git log --oneline -5` ile son 5 kaydı göster ve Baran'a bir cümleyle commit'in ne işe yaradığını hatırlat: istediği zaman bu noktaya geri dönebilir.
7. En sonda, push başarılıysa commit'in GitHub'a gönderildiğini bir cümleyle söyle.

Değişiklik yoksa bunu söyle ve dur. Baran onay vermeden ne commit at ne de push yap.
