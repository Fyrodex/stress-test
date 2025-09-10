# Stres Testi Uygulaması

Bu uygulama, kullanıcıların stres seviyelerini ölçmek için tasarlanmış interaktif bir test uygulamasıdır. **Sınırsız soru havuzu** ile her seferinde farklı 90 soru sunar.

## 🚀 Hızlı Başlangıç

### 1. API Sunucusunu Başlatın

```bash
cd server
npm install
npm start
```

### 2. Uygulamayı Açın

`public/index.html` dosyasını tarayıcınızda açın veya bir local server kullanın:

```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve public
```

## 📁 Proje Yapısı

```
yeniproje/
├── public/                 # Frontend dosyaları
│   ├── index.html         # Ana HTML dosyası
│   └── images/            # Görseller
├── src/                   # JavaScript dosyaları
│   ├── app.js            # Ana uygulama mantığı
│   ├── api.js           # API entegrasyonu
│   └── style.css        # Stil dosyası
├── server/               # API sunucusu
│   ├── server.js        # Ana sunucu dosyası
│   ├── questions.js     # Dinamik soru üretici
│   ├── database.sqlite  # Veritabanı
│   ├── package.json     # Node.js bağımlılıkları
│   └── README.md        # API dokümantasyonu
└── README.md           # Bu dosya
```

## 🌟 Özellikler

### Frontend
- ✅ Responsive tasarım (tüm cihazlarda uyumlu)
- ✅ 3 aşamalı stres testi
- ✅ Çoktan seçmeli ve eşleştirme soruları
- ✅ Gerçek zamanlı skor takibi
- ✅ Görsel efektler ve animasyonlar
- ✅ Timer sistemi
- ✅ Sonuç analizi

### Backend API
- ✅ **Sınırsız soru üretimi** - Dinamik soru üretici
- ✅ Her seferinde 90 farklı soru
- ✅ Matematik, coğrafya, bilim, tarih soruları
- ✅ Eşleştirme soruları
- ✅ Sonuç kaydetme
- ✅ İstatistikler
- ✅ SQLite veritabanı
- ✅ RESTful API
- ✅ CORS desteği
- ✅ Güvenlik önlemleri

## 🔧 API Endpoint'leri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/health` | GET | Sağlık kontrolü |
| `/questions?count=90` | GET | 90 dinamik soru çek |
| `/results` | POST | Sonuç kaydetme |
| `/results` | GET | Sonuçları görüntüleme |
| `/stats` | GET | İstatistikler |

## 📊 Test Aşamaları

1. **Normal Aşama (1-30 soru)**: Temel sorular
2. **Orta Aşama (31-60 soru)**: Zaman baskısı + görsel efektler
3. **Yüksek Aşama (61-90 soru)**: Yoğun stres + dikkat dağıtıcılar

## 🎯 Kullanım

1. API sunucusunu başlatın: `cd server && npm start`
2. Uygulamayı tarayıcıda açın: `public/index.html`
3. "Teste Başla" butonuna tıklayın
4. Her soruya cevap verin
5. Sonuçlarınızı görüntüleyin

## 🔍 Test Etme

API'yi test etmek için:
```bash
curl http://localhost:3001/health
curl "http://localhost:3001/questions?count=90"
```

## 📈 Sonuç Analizi

Uygulama şu kriterlere göre stres seviyenizi değerlendirir:
- **Düşük Stres**: 0-150 puan
- **Orta Stres**: 151-300 puan  
- **Yüksek Stres**: 301+ puan

## 🛠️ Geliştirme

### Dinamik Soru Üretimi

Sistem şu kategorilerde sınırsız soru üretir:
- **Matematik**: Toplama, çarpma işlemleri
- **Coğrafya**: Ülke-başkent eşleştirmeleri
- **Bilim**: Periyodik tablo elementleri
- **Tarih**: Önemli tarihsel olaylar
- **Eşleştirme**: Renkler, hayvanlar, gezegenler

### Yeni Soru Kategorisi Ekleme

`server/questions.js` dosyasında `QUESTION_TEMPLATES` objesine yeni kategori ekleyin:

```javascript
newCategory: [
  {
    type: 'multiple',
    template: '{{question}}',
    options: ['{{answer}}', '{{wrong1}}', '{{wrong2}}', '{{wrong3}}'],
    answer: '{{answer}}',
    generate: () => {
      // Dinamik veri üretimi
      return { question: '...', answer: '...', wrong1: '...' };
    }
  }
]
```

## 🐛 Sorun Giderme

### API Bağlantı Hatası
- Port 3001'in boş olduğunu kontrol edin
- API sunucusunun çalıştığını kontrol edin: `npm start`
- CORS ayarlarını kontrol edin

### Soru Yükleme Hatası
- API sunucusunun çalıştığını kontrol edin
- Console'da hata mesajlarını kontrol edin
- Dinamik soru üreticinin çalıştığını kontrol edin

## 📝 Lisans

MIT License

---

**Not**: Bu uygulama her seferinde 90 farklı soru üretir. Aynı sorular tekrar gelmez!
