# T&B — Skill Listesi

Bu projede kullandığımız skill'ler. Claude her işe başlamadan önce bu listeye bakar ve işe uygun skill'i kullanır.
Yeni bir skill eklendiğinde bu dosya güncellenir.

| Skill | Ne işe yarar | Ne zaman kullanılır | Nereden geldi |
| --- | --- | --- | --- |
| `/kaydet` | Değişiklikleri Git ile kaydeder (commit) ve GitHub'a gönderir (push). Önce neyin değiştiğini anlatır, Türkçe commit mesajı önerir, onay bekler. | Bir adım bittiğinde ya da Baran "kaydet", "commit at", "değişiklikleri kaydet" dediğinde. | Bizim yazdığımız (`.claude/skills/kaydet/SKILL.md`) |
| `frontend-design` | Şablon gibi durmayan, karakterli arayüz tasarımı için rehber: görsel yön, tipografi, düzen, animasyon fikirleri. | Yeni bir sayfa, bölüm ya da animasyon tasarlarken veya var olan bir arayüzü yeniden şekillendirirken. Marka renkleri ve fontları (CLAUDE.md) her zaman önceliklidir. | Resmi paket (`example-skills`) |
| `webapp-testing` | Siteyi Playwright ile gerçek bir tarayıcıda açar; tıklama, ekran görüntüsü alma, konsol hatalarını görme. | Her özellik bittikten sonra: siteyi bilgisayar ve telefon boyutunda test etmek ve ekran görüntüsü almak için. Python ve Playwright gerektirir. | Resmi paket (`example-skills`) |
| `skill-creator` | Yeni skill yazar, var olan skill'i düzenler, skill'in doğru zamanda devreye girip girmediğini test eder. | Tekrar eden bir iş için yeni bir skill yazmak ya da mevcut bir skill'i (ör. `/kaydet`) geliştirmek istediğimizde. | Resmi paket (`example-skills`) |
