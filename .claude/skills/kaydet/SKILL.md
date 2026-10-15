---
name: kaydet
description: T&B projesindeki değişiklikleri Git ile kaydeder (commit). Baran "kaydet", "commit at" veya "değişiklikleri kaydet" dediğinde kullan.
---

T&B projesindeki değişiklikleri Git ile kaydet. Adımlar:

1. `git status` ile neyin değiştiğine bak.
2. Değişiklikleri Baran'a Türkçe, madde madde ve kısaca anlat: hangi dosyalar eklendi, hangileri değişti.
3. Kısa ve anlaşılır bir Türkçe commit mesajı öner. Örnek: "Ana sayfaya giriş animasyonu eklendi".
   - Mesaj 60 karakteri geçmesin.
   - Geçmiş zamanla yaz: "eklendi", "düzeltildi", "güncellendi".
4. Baran onaylayınca `git add .` ve `git commit -m "<mesaj>"` komutlarını çalıştır.
5. Son olarak `git log --oneline -5` ile son 5 kaydı göster ve Baran'a bir cümleyle commit'in ne işe yaradığını hatırlat: istediği zaman bu noktaya geri dönebilir.

Değişiklik yoksa bunu söyle ve dur. Baran onay vermeden commit atma.
