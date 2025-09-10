// Mock API for testing - Gerçek API'niz hazır olduğunda bu dosyayı kaldırabilirsiniz
class MockAPI {
  constructor() {
    this.questions = this.generateMockQuestions();
    this.results = [];
  }

  // Mock soru havuzu oluşturma
  generateMockQuestions() {
    const mockQuestions = [];
    
    // Çoktan seçmeli sorular
    const multipleQuestions = [
      { type: 'multiple', question: 'Mock: Türkiye\'nin başkenti neresidir?', options: ['İstanbul', 'İzmir', 'Ankara', 'Bursa'], answer: 2 },
      { type: 'multiple', question: 'Mock: 7 x 8 işleminin sonucu nedir?', options: ['54', '56', '58', '64'], answer: 1 },
      { type: 'multiple', question: 'Mock: En büyük okyanus hangisidir?', options: ['Atlas', 'Hint', 'Arktik', 'Pasifik'], answer: 3 },
      { type: 'multiple', question: 'Mock: Hangi hayvan memelidir?', options: ['Kaplumbağa', 'Yunus', 'Timsah', 'Martı'], answer: 1 },
      { type: 'multiple', question: 'Mock: Günde kaç saat vardır?', options: ['24', '12', '48', '36'], answer: 0 },
      { type: 'multiple', question: 'Mock: En uzun nehir hangisidir?', options: ['Amazon', 'Nil', 'Tuna', 'Mississippi'], answer: 1 },
      { type: 'multiple', question: 'Mock: Mars gezegenine verilen diğer ad nedir?', options: ['Mavi Gezegen', 'Kırmızı Gezegen', 'Güneşin Çocuğu', 'Taşlı Gezegen'], answer: 1 },
      { type: 'multiple', question: 'Mock: En küçük asal sayı kaçtır?', options: ['0', '1', '2', '3'], answer: 2 },
      { type: 'multiple', question: 'Mock: "Elma" kelimesinin eş anlamlısı hangisidir?', options: ['Meyve', 'Sebze', 'Yoktur', 'Armut'], answer: 2 },
      { type: 'multiple', question: 'Mock: Atatürk hangi tarihte doğmuştur?', options: ['1881', '1919', '1923', '1938'], answer: 0 },
      { type: 'multiple', question: 'Mock: 1000 ÷ 5 sonucu nedir?', options: ['150', '200', '250', '300'], answer: 1 },
      { type: 'multiple', question: 'Mock: İstanbul Boğazı hangi iki kıtayı ayırır?', options: ['Avrupa – Afrika', 'Asya – Amerika', 'Avrupa – Asya', 'Afrika – Antarktika'], answer: 2 },
      { type: 'multiple', question: 'Mock: Güneş sisteminde kaç gezegen vardır?', options: ['7', '8', '9', '10'], answer: 1 },
      { type: 'multiple', question: 'Mock: DNA nedir?', options: ['Kas hücresi', 'Protein', 'Genetik bilgi taşıyan molekül', 'Hormon'], answer: 2 },
      { type: 'multiple', question: 'Mock: 1 yıl kaç gündür?', options: ['364', '365', '366', '367'], answer: 1 },
      { type: 'multiple', question: 'Mock: Mavi renk hangi duyguyu temsil eder?', options: ['Korku', 'Sakinlik', 'Sinir', 'Heyecan'], answer: 1 },
      { type: 'multiple', question: 'Mock: En çok konuşulan dil hangisidir?', options: ['İngilizce', 'Arapça', 'Çince', 'Hintçe'], answer: 2 },
      { type: 'multiple', question: 'Mock: En hızlı kara hayvanı hangisidir?', options: ['Kaplan', 'Ceylan', 'Aslan', 'Çita'], answer: 3 },
      { type: 'multiple', question: 'Mock: Fotosentez hangi yapı ile yapılır?', options: ['Mitokondri', 'Kloroplast', 'Ribozom', 'Çekirdek'], answer: 1 },
      { type: 'multiple', question: 'Mock: Türkiye hangi kıtalarda yer alır?', options: ['Avrupa – Asya', 'Afrika – Avrupa', 'Asya – Afrika', 'Amerika – Avrupa'], answer: 0 },
      { type: 'multiple', question: 'Mock: Güneş doğudan mı batar?', options: ['Evet', 'Hayır'], answer: 1 },
      { type: 'multiple', question: 'Mock: En uzun organımız hangisidir?', options: ['Kalp', 'Akciğer', 'Deri', 'Karaciğer'], answer: 2 },
      { type: 'multiple', question: 'Mock: 3, 6, 9, 12, ? → Sıradaki sayı?', options: ['14', '15', '16', '18'], answer: 1 },
      { type: 'multiple', question: 'Mock: En çok kullanılan sosyal medya uygulaması hangisidir?', options: ['Facebook', 'Instagram', 'TikTok', 'X (Twitter)'], answer: 2 },
      { type: 'multiple', question: 'Mock: Çay genelde nasıl içilir?', options: ['Sıcak', 'Soğuk', 'Donmuş', 'Buharlı'], answer: 0 },
      { type: 'multiple', question: 'Mock: En popüler işletim sistemi hangisidir?', options: ['Linux', 'MacOS', 'Windows', 'Ubuntu'], answer: 2 },
      { type: 'multiple', question: 'Mock: Beş duyu organımızdan biri aşağıdakilerden hangisidir?', options: ['Karaciğer', 'Cilt', 'Burun', 'Mide'], answer: 2 },
      { type: 'multiple', question: 'Mock: Tersine yazılmış kelime: "kabaK" → Düz hali?', options: ['Kabak', 'Kakab', 'Kabka', 'Kkaba'], answer: 0 },
      { type: 'multiple', question: 'Mock: En çok bilinen mesleklerden biri nedir?', options: ['Bilimci', 'Yüzücü', 'Öğretmen', 'Besteci'], answer: 2 },
      { type: 'multiple', question: 'Mock: 15 + 24 – 10 = ?', options: ['29', '31', '32', '33'], answer: 0 },
      { type: 'multiple', question: 'Mock: 81 sayısı hangi sayının karesidir?', options: ['7', '8', '9', '10'], answer: 2 },
      { type: 'multiple', question: 'Mock: Dünya\'nın uydusu hangisidir?', options: ['Venüs', 'Güneş', 'Mars', 'Ay'], answer: 3 },
      { type: 'multiple', question: 'Mock: 100 / 4 işleminin sonucu nedir?', options: ['20', '25', '30', '40'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi ülke Avrupa\'dadır?', options: ['Japonya', 'Türkiye', 'Brezilya', 'Mısır'], answer: 1 },
      { type: 'multiple', question: 'Mock: 1 metre kaç santimetredir?', options: ['10', '100', '1000', '10000'], answer: 1 },
      { type: 'multiple', question: 'Mock: En yaygın kullanılan arama motoru nedir?', options: ['Bing', 'Yandex', 'Google', 'Yahoo'], answer: 2 },
      { type: 'multiple', question: 'Mock: Kış mevsiminde hangisi olur?', options: ['Ağaçlar çiçek açar', 'Kar yağar', 'Güneş batmaz', 'Sıcaklık artar'], answer: 1 },
      { type: 'multiple', question: 'Mock: Türkiye\'nin en kalabalık şehri hangisidir?', options: ['Ankara', 'İzmir', 'İstanbul', 'Bursa'], answer: 2 },
      { type: 'multiple', question: 'Mock: "Photoshop" hangi alanda kullanılır?', options: ['Yazılım', 'Resim düzenleme', 'Müzik yapımı', 'Muhasebe'], answer: 1 },
      { type: 'multiple', question: 'Mock: 5² işlemi kaçtır?', options: ['10', '20', '25', '30'], answer: 2 },
      { type: 'multiple', question: 'Mock: Türkiye\'nin para birimi nedir?', options: ['Dolar', 'Euro', 'TL', 'Yen'], answer: 2 },
      { type: 'multiple', question: 'Mock: Kan grubunu belirleyen sistem hangisidir?', options: ['ABO', 'RNA', 'XYZ', 'HDL'], answer: 0 },
      { type: 'multiple', question: 'Mock: Hangi sayı çift sayıdır?', options: ['13', '21', '28', '35'], answer: 2 },
      { type: 'multiple', question: 'Mock: Bir yılda kaç ay vardır?', options: ['10', '11', '12', '13'], answer: 2 },
      { type: 'multiple', question: 'Mock: 60 + 15 – 30 işleminin sonucu nedir?', options: ['45', '40', '30', '50'], answer: 0 },
      { type: 'multiple', question: 'Mock: Gökkuşağında kaç renk vardır?', options: ['5', '6', '7', '8'], answer: 2 },
      { type: 'multiple', question: 'Mock: "Ctrl + C" bilgisayarda hangi işlevi görür?', options: ['Kapat', 'Kes', 'Kopyala', 'Yapıştır'], answer: 2 },
      { type: 'multiple', question: 'Mock: En yaygın sosyal medya platformu hangisidir?', options: ['Reddit', 'Instagram', 'TikTok', 'Tumblr'], answer: 2 },
      { type: 'multiple', question: 'Mock: Türkiye\'nin en uzun nehri hangisidir?', options: ['Fırat', 'Dicle', 'Kızılırmak', 'Meriç'], answer: 0 },
      { type: 'multiple', question: 'Mock: "Kavanoz" kelimesinin zıt anlamlısı nedir?', options: ['Kap', 'Şişe', 'Boşluk', 'Yoktur'], answer: 3 },
      { type: 'multiple', question: 'Mock: Sudoku hangi tür oyundur?', options: ['Zeka', 'Strateji', 'Refleks', 'Aksiyon'], answer: 0 },
      { type: 'multiple', question: 'Mock: Bir karenin kaç kenarı vardır?', options: ['3', '4', '5', '6'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi gezegen halkalı yapıya sahiptir?', options: ['Mars', 'Dünya', 'Satürn', 'Merkür'], answer: 2 },
      { type: 'multiple', question: 'Mock: Türkiye\'nin en doğusundaki il hangisidir?', options: ['Edirne', 'Artvin', 'Iğdır', 'Gaziantep'], answer: 2 },
      { type: 'multiple', question: 'Mock: "E=mc²" formülü kime aittir?', options: ['Newton', 'Einstein', 'Tesla', 'Galileo'], answer: 1 },
      { type: 'multiple', question: 'Mock: Aşağıdaki renklerden hangisi sıcak renktir?', options: ['Mavi', 'Yeşil', 'Kırmızı', 'Mor'], answer: 2 },
      { type: 'multiple', question: 'Mock: En büyük asal sayı aşağıdakilerden hangisidir?', options: ['97', '90', '88', '99'], answer: 0 },
      { type: 'multiple', question: 'Mock: Günümüzde yaygın kullanılan dosya sıkıştırma uzantısı hangisidir?', options: ['.doc', '.zip', '.exe', '.avi'], answer: 1 },
      { type: 'multiple', question: 'Mock: 1 kilometre kaç metredir?', options: ['100', '1000', '10', '10.000'], answer: 1 },
      { type: 'multiple', question: 'Mock: En küçük pozitif çift sayı nedir?', options: ['0', '1', '2', '4'], answer: 2 },
      { type: 'multiple', question: 'Mock: Pi sayısı yaklaşık olarak kaçtır?', options: ['2.14', '3.14', '4.14', '5.14'], answer: 1 },
      { type: 'multiple', question: 'Mock: En büyük kara hayvanı hangisidir?', options: ['Fil', 'Zürafa', 'Gergedan', 'Ayı'], answer: 0 },
      { type: 'multiple', question: 'Mock: Bir saat kaç dakikadır?', options: ['60', '100', '30', '90'], answer: 0 },
      { type: 'multiple', question: 'Mock: Hangi harf Türk alfabesinde yoktur?', options: ['Ç', 'Q', 'Ş', 'Ğ'], answer: 1 },
      { type: 'multiple', question: 'Mock: DNA\'nın açılımı nedir?', options: ['Dinamik Nükleotid Ağı', 'Deoksiribonükleik Asit', 'Dijital Nöron Alanı', 'Difüzyon Nükleer Akımı'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi element gaz halindedir?', options: ['Oksijen', 'Demir', 'Gümüş', 'Bakır'], answer: 0 },
      { type: 'multiple', question: 'Mock: Günümüzde en yaygın kullanılan mesajlaşma uygulaması hangisidir?', options: ['Signal', 'WhatsApp', 'Telegram', 'Discord'], answer: 1 },
      { type: 'multiple', question: 'Mock: 45 sayısı 3 ile bölünebilir mi?', options: ['Hayır', 'Evet', 'Bazen', 'Emin değilim'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi ülkenin bayrağı kırmızı-beyazdır?', options: ['Kanada', 'Fransa', 'Almanya', 'Hindistan'], answer: 0 },
      { type: 'multiple', question: 'Mock: Hangi gezegen Güneş\'e en yakındır?', options: ['Venüs', 'Mars', 'Merkür', 'Uranüs'], answer: 2 },
      { type: 'multiple', question: 'Mock: Kare prizmanın kaç yüzü vardır?', options: ['4', '5', '6', '8'], answer: 2 },
      { type: 'multiple', question: 'Mock: Bir üçgenin iç açıları toplamı kaç derecedir?', options: ['180', '360', '90', '270'], answer: 0 },
      { type: 'multiple', question: 'Mock: Çarpım tablosunda 6x7 kaçtır?', options: ['42', '36', '48', '40'], answer: 0 },
      { type: 'multiple', question: 'Mock: Bir bilgisayarda RAM ne işe yarar?', options: ['Sabit depolama', 'Ses işleme', 'Geçici bellek', 'İnternet bağlantısı'], answer: 2 },
      { type: 'multiple', question: 'Mock: Türkiye\'nin ilk başkenti neresidir?', options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'], answer: 3 },
      { type: 'multiple', question: 'Mock: Hangisi duyusal bir organ değildir?', options: ['Kulak', 'Dil', 'Burun', 'Mide'], answer: 3 },
      { type: 'multiple', question: 'Mock: Hangi gezegenin halkası vardır?', options: ['Dünya', 'Mars', 'Satürn', 'Venüs'], answer: 2 },
      { type: 'multiple', question: 'Mock: Bir haftada kaç gün vardır?', options: ['6', '7', '8', '9'], answer: 1 },
      { type: 'multiple', question: 'Mock: Karbon dioksit hangi sembolle gösterilir?', options: ['CO', 'CO₂', 'C₂O', 'C₂O₂'], answer: 1 },
      { type: 'multiple', question: 'Mock: İlk çağlarda kullanılan yazı türü nedir?', options: ['Latin', 'Hiyeroglif', 'Kiril', 'Arap'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi araç su üstünde hareket eder?', options: ['Araba', 'Uçak', 'Gemi', 'Tren'], answer: 2 },
      { type: 'multiple', question: 'Mock: "Photosynthesis" ne anlama gelir?', options: ['Nefes alma', 'Terleme', 'Fotosentez', 'Solunum'], answer: 2 },
      { type: 'multiple', question: 'Mock: Hangi işlem sonucu çift sayıdır?', options: ['3 + 3', '5 + 1', '4 + 2', '5 + 5'], answer: 2 },
      { type: 'multiple', question: 'Mock: 1 saat 45 dakika kaç dakikadır?', options: ['105', '100', '90', '115'], answer: 0 },
      { type: 'multiple', question: 'Mock: En küçük asal sayı nedir?', options: ['0', '1', '2', '3'], answer: 2 },
      { type: 'multiple', question: 'Mock: Güneş hangi sınıfa girer?', options: ['Yıldız', 'Gezegen', 'Uydu', 'Asteroit'], answer: 0 },
      { type: 'multiple', question: 'Mock: "Ctrl + Z" tuş kombinasyonu ne işe yarar?', options: ['Yapıştır', 'Kopyala', 'Geri al', 'Yeniden başlat'], answer: 2 },
      { type: 'multiple', question: 'Mock: Suyun donma noktası kaç °C\'dir?', options: ['0', '10', '-10', '100'], answer: 0 },
      { type: 'multiple', question: 'Mock: Türkiye\'de resmi dil nedir?', options: ['İngilizce', 'Almanca', 'Türkçe', 'Arapça'], answer: 2 },
      { type: 'multiple', question: 'Mock: Hangi gezegen Güneş Sistemi\'nin en büyüğüdür?', options: ['Uranüs', 'Neptün', 'Jüpiter', 'Mars'], answer: 2 },
      { type: 'multiple', question: 'Mock: Hangi hayvan uçamaz?', options: ['Güvercin', 'Kartal', 'Penguen', 'Serçe'], answer: 2 },
      { type: 'multiple', question: 'Mock: Türkiye kaç coğrafi bölgeden oluşur?', options: ['5', '6', '7', '8'], answer: 2 },
      { type: 'multiple', question: 'Mock: 10 sayısının küpü kaçtır?', options: ['100', '1000', '110', '10'], answer: 1 },
      { type: 'multiple', question: 'Mock: Hangi renk üç ana renkten biridir?', options: ['Mor', 'Yeşil', 'Sarı', 'Pembe'], answer: 2 },
      { type: 'multiple', question: 'Mock: İnternetin temeli olan ağ hangisidir?', options: ['LAN', 'ARPANET', 'WLAN', 'FİBER'], answer: 1 },
      { type: 'multiple', question: 'Mock: İnsan vücudundaki en uzun kemik hangisidir?', options: ['Kol', 'Omurga', 'Uyluk', 'Kaburga'], answer: 2 },
      { type: 'multiple', question: 'Mock: Hangisi bir programlama dili değildir?', options: ['Python', 'HTML', 'Java', 'Excel'], answer: 3 },
      { type: 'multiple', question: 'Mock: "Antik Roma" nerede kurulmuştur?', options: ['İspanya', 'Fransa', 'İtalya', 'Yunanistan'], answer: 2 },
      { type: 'multiple', question: 'Mock: Dünya\'nın tek doğal uydusu nedir?', options: ['Mars', 'Jüpiter', 'Ay', 'Venüs'], answer: 2 },
      { type: 'multiple', question: 'Mock: En küçük çift pozitif sayı hangisidir?', options: ['1', '2', '0', '4'], answer: 1 }
    ];

    // Eşleştirme soruları
    const matchingQuestions = [
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki ülkeleri başkentleriyle eşleştirin:', 
        leftItems: ['Türkiye', 'Fransa', 'Japonya', 'Mısır', 'Brezilya'],
        rightItems: ['Ankara', 'Paris', 'Tokyo', 'Kahire', 'Brasília'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki gezegenleri özellikleriyle eşleştirin:', 
        leftItems: ['Mars', 'Satürn', 'Venüs', 'Jüpiter', 'Merkür'],
        rightItems: ['Kırmızı gezegen', 'Halkalı gezegen', 'En sıcak gezegen', 'En büyük gezegen', 'Güneşe en yakın'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki matematik işlemlerini sonuçlarıyla eşleştirin:', 
        leftItems: ['8 x 7', '15 + 25', '100 ÷ 4', '12²', '5³'],
        rightItems: ['56', '40', '25', '144', '125'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki hayvanları yaşam alanlarıyla eşleştirin:', 
        leftItems: ['Balina', 'Kartal', 'Timsah', 'Penguen', 'Kanguru'],
        rightItems: ['Okyanus', 'Gökyüzü', 'Nehir', 'Kutuplar', 'Avustralya'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki renkleri duygularla eşleştirin:', 
        leftItems: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Mor'],
        rightItems: ['Öfke', 'Sakinlik', 'Doğa', 'Mutluluk', 'Asalet'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki bilim insanlarını buluşlarıyla eşleştirin:', 
        leftItems: ['Einstein', 'Newton', 'Tesla', 'Galileo', 'Darwin'],
        rightItems: ['Görelilik', 'Yerçekimi', 'Alternatif akım', 'Teleskop', 'Evrim teorisi'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki elementleri sembolleriyle eşleştirin:', 
        leftItems: ['Oksijen', 'Karbon', 'Hidrojen', 'Azot', 'Demir'],
        rightItems: ['O', 'C', 'H', 'N', 'Fe'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki sporları kategorileriyle eşleştirin:', 
        leftItems: ['Futbol', 'Yüzme', 'Satranç', 'Basketbol', 'Koşu'],
        rightItems: ['Takım sporu', 'Su sporu', 'Zeka sporu', 'Takım sporu', 'Atletizm'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki meslekleri araçlarıyla eşleştirin:', 
        leftItems: ['Doktor', 'Öğretmen', 'Mimar', 'Aşçı', 'Müzisyen'],
        rightItems: ['Steteskop', 'Tebeşir', 'Çizim tahtası', 'Tencere', 'Enstrüman'],
        answer: [0, 1, 2, 3, 4]
      },
      { 
        type: 'matching', 
        question: 'Mock: Aşağıdaki tarih olaylarını yıllarıyla eşleştirin:', 
        leftItems: ['İstanbul\'un fethi', 'Cumhuriyetin ilanı', 'II. Dünya Savaşı', 'Atatürk\'ün doğumu', 'Türkiye\'nin kuruluşu'],
        rightItems: ['1453', '1923', '1939', '1881', '1923'],
        answer: [0, 1, 2, 3, 1]
      }
    ];

    return [...multipleQuestions, ...matchingQuestions];
  }

  // Mock API endpoint'leri
  async fetchQuestions(count = 90) {
    // Simüle edilmiş API gecikmesi
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Rastgele soru seçme
    const shuffled = this.shuffleArray([...this.questions]);
    return shuffled.slice(0, count);
  }

  async sendResults(results) {
    // Simüle edilmiş API gecikmesi
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Sonuçları kaydetme
    this.results.push({
      ...results,
      timestamp: new Date().toISOString()
    });
    
    console.log('Mock API: Sonuçlar kaydedildi', results);
    return { success: true, message: 'Sonuçlar başarıyla kaydedildi' };
  }

  // Array karıştırma
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // API bağlantı testi
  async testConnection() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }
}

// Mock API'yi global olarak tanımla
window.mockAPI = new MockAPI(); 