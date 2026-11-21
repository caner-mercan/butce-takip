# butce-takip
# Günlük Bütçe

Günlük harcamalarını takip etmek için hazırlanmış, tarayıcıda çalışan basit bir bütçe aracı. Sunucu, kurulum ya da hesap gerektirmez.

**Canlı demo:** [fancy-capybara-6ffb9b.netlify.app](https://fancy-capybara-6ffb9b.netlify.app)

## Özellikler

- **Kadran göstergesi:** Günlük limitten ne kadarının kaldığını 60 çentikli bir kadranda gösterir. Renk yeşilden sarıya, limit aşılınca kırmızıya döner.
- **Devir:** İstenirse günün kalan parası ertesi güne eklenir. Fazla harcama da eksi olarak devredilir. Anahtardan kapatılabilir.
- **Harcama ekleme:** Tutar, kategori ve isteğe bağlı not ile harcama eklenir, istenmeyen harcama silinir.
- **Aylık takvim:** Her gün harcamasına göre yeşil ya da kırmızı boyanır. Bir güne tıklayınca o günün harcamaları açılır.
- **Ay özeti:** Toplam harcama, günlük ortalama ve limit altında kalınan gün sayısı.
- **Kategori dağılımı:** Ayın harcamaları renkli bir çubukta kategorilere göre bölünür.
- **Açık ve koyu tema:** Cihazın temasına otomatik uyar.
- **Mobil uyumlu:** Telefon ekranlarında rahat kullanılır.

## Kullanım

En kolayı yukarıdaki canlı demo bağlantısını açmak. Kendi bilgisayarında çalıştırmak istersen:

1. Depoyu indir ya da klonla:

   ```bash
   git clone https://github.com/KULLANICI_ADI/REPO_ADI.git
   ```

2. `index.html` dosyasını tarayıcıda aç. Başka bir şey kurmana gerek yok.

## Dosya yapısı

```
.
├── index.html   # Sayfa yapısı
├── style.css    # Tasarım ve temalar
├── script.js    # Uygulama mantığı
└── README.md
```

## Veriler nerede saklanıyor?

Tüm veriler tarayıcının `localStorage` alanında, `gunluk-butce-v1` anahtarı altında tutulur. Bu yüzden:

- Veriler yalnızca kullandığın tarayıcıda ve cihazda görünür, başka cihazlarla eşitlenmez.
- Tarayıcı verilerini temizlersen harcamalar da silinir.
- Her kullanıcı kendi verisini görür, sunucuya hiçbir şey gönderilmez.

## Özelleştirme

- **Varsayılan günlük limit:** `script.js` içindeki `state` nesnesinde `budget` değerini değiştir (şu an `2000`). Sayfadaki "Günlük limit" kutusu daha önce kaydedilmiş bir değer varsa onu kullanır.
- **Kategoriler ve renkleri:** `script.js` başındaki `CATS` listesinden düzenlenir.
- **Renkler ve tema:** `style.css` başındaki `:root` altındaki değişkenlerden değiştirilir.
- **Para birimi:** Tutarlar `money()` fonksiyonunda `₺` ile biçimlendirilir.

## Notlar

- Yazı tipi (Bricolage Grotesque) Google Fonts'tan yüklenir. Bağlantı yoksa sistem yazı tipi kullanılır.
- Saf HTML, CSS ve JavaScript ile yazıldı, harici kütüphane yok.
