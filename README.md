# AquaDS - Veritabanı Sistemi Kurulum Rehberi

## 📋 Genel Bakış

Bu proje, AquaDS web sitesi için kullanıcıların seçtiği paketleri ve strateji önerilerini kaydeden bir veritabanı sistemini içerir.

## 🗄️ Veritabanı Yapısı

### 3 Ana Tablo:

1. **package_selections** - Paket seçimleri
   - id, package_name, customer_name, email, phone, company, message, created_at

2. **strategy_recommendations** - Strateji önerileri
   - id, sector, audience, budget, recommended_package, score, roi, duration, customer_name, email, phone, created_at

3. **contact_forms** - İletişim formları
   - id, name, email, phone, company, message, created_at

## 🚀 Kurulum Adımları

### 1. Node.js Paketlerini Yükleyin

```powershell
cd "c:\Users\Excalibur\Desktop\aquads"
npm install
```

Bu komut şu paketleri yükler:
- express (Web sunucusu)
- sqlite3 (Veritabanı)
- cors (Cross-origin istekleri)
- body-parser (JSON parsing)

### 2. Sunucuyu Başlatın

```powershell
npm start
```

veya geliştirme modu için (otomatik yeniden başlatma):

```powershell
npm run dev
```

Sunucu şu adreste çalışacak: **http://localhost:3000**

## 📊 Admin Panel

Admin paneline erişim: **http://localhost:3000/admin.html**

### Özellikler:
- ✅ Canlı istatistikler (Toplam paket seçimi, strateji önerileri, iletişim formları)
- ✅ 3 sekme: Paket Seçimleri, Strateji Önerileri, İletişim Formları
- ✅ Arama fonksiyonu (her tabloda)
- ✅ CSV export (Excel'de açılabilir)
- ✅ Otomatik yenileme (30 saniyede bir)
- ✅ Responsive tasarım (mobil uyumlu)

## 🔌 API Endpoint'leri

### Kullanıcı İşlemleri:
- `POST /api/select-package` - Paket seçimi kaydet
- `POST /api/save-recommendation` - Strateji önerisi kaydet
- `POST /api/contact` - İletişim formu kaydet

### Admin İşlemleri:
- `GET /api/admin/packages` - Tüm paket seçimlerini getir
- `GET /api/admin/recommendations` - Tüm strateji önerilerini getir
- `GET /api/admin/contacts` - Tüm iletişim formlarını getir
- `GET /api/admin/stats` - İstatistikleri getir

## 📝 Örnek Kullanım

### Paket Seçimi Kaydetme:
```javascript
fetch('http://localhost:3000/api/select-package', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        package_name: 'Kampüs Paketi',
        customer_name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '05551234567',
        company: 'ABC Şirketi',
        message: 'Detaylı bilgi istiyorum'
    })
});
```

## 🌐 Web Sitesini Çalıştırma

1. Sunucuyu başlattıktan sonra tarayıcınızda şu adresi açın:
   **http://localhost:3000/index.html**

2. Paket seçimleri ve strateji önerileri otomatik olarak veritabanına kaydedilecektir.

## 📁 Dosya Yapısı

```
aquads/
├── server.js                 # Backend sunucu
├── package.json             # Node.js bağımlılıkları
├── aquads.db               # SQLite veritabanı (otomatik oluşur)
├── index.html              # Ana sayfa (güncellenmiş)
├── admin.html              # Admin panel
├── hakkimizda.html
├── recommendation-engine.html
└── assets/
```

## ⚙️ Önemli Notlar

1. **İlk Çalıştırma**: Sunucu ilk kez başlatıldığında `aquads.db` dosyası otomatik oluşturulur ve tablolar hazırlanır.

2. **CORS**: Backend CORS'u destekler, farklı portlardan erişim mümkündür.

3. **Veritabanı Yedekleme**: `aquads.db` dosyasını düzenli olarak yedekleyin.

4. **Canlı Ortam**: Production ortamında:
   - `API_BASE` değişkenini gerçek sunucu adresinize güncelleyin
   - CORS ayarlarını güvenli hale getirin
   - HTTPS kullanın

## 🔧 Sorun Giderme

### Port zaten kullanımda hatası:
```powershell
# 3000 portunu kullanan işlemi bulun ve durdurun
Get-NetTCPConnection -LocalPort 3000
```

### Veritabanı sıfırlama:
```powershell
Remove-Item aquads.db
npm start  # Veritabanı yeniden oluşturulur
```

### NPM paketleri yeniden yükleme:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## 📞 Destek

Herhangi bir sorun yaşarsanız, server.js dosyasındaki console log'ları kontrol edin.

---
**Not**: Bu sistem SQLite kullanır, production ortamında MySQL veya PostgreSQL tercih edilebilir.
