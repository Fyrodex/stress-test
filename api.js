// API endpoint'leri ve soru yönetimi
const API_BASE_URL = 'http://localhost:3001'; // Yerel API sunucusu

// Soru havuzu API'si
class QuestionAPI {
  constructor() {
    // Cache sistemini kaldırdık - her seferinde yeni sorular
    this.sessionId = this.ensureSessionId();
  }

  // API'den soru çekme - her seferinde yeni sorular
  async fetchQuestions(count = 90) {
    try {
      // Her seferinde API'den yeni sorular çek
      const url = `${API_BASE_URL}/questions?count=${count}&t=${Date.now()}`;
      const response = await fetch(url , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success && Array.isArray(responseData.questions) && responseData.questions.length > 0) {
        console.log(`API'den ${responseData.questions.length} yeni soru yüklendi`);
        return responseData.questions;
      } else {
        throw new Error('API boş liste döndü');
      }
      
    } catch (error) {
      console.error('API hatası:', error);
      // 1) İstemci tarafı dinamik jeneratör: her seferinde yeni içerik üret
      try {
        const dynamicQs = this.generateDynamicQuestions(count);
        if (Array.isArray(dynamicQs) && dynamicQs.length > 0) {
          console.log(`İstemci jeneratöründen ${dynamicQs.length} soru üretildi`);
          return dynamicQs;
        }
      } catch (e) {
        console.warn('İstemci jeneratöründe sorun, Mock API deneniyor...', e);
      }

      // 2) Mock API
      if (window.mockAPI && typeof window.mockAPI.fetchQuestions === 'function') {
        const mockQs = await window.mockAPI.fetchQuestions(count);
        console.log(`Mock API'den ${mockQs.length} soru alındı`);
        return mockQs;
      }

      // 3) Son çare: yerel havuzdan karışık seç
      return this.getRandomQuestions(QUESTION_POOL, count);
    }
  }

  // Kalıcı sessionId üret ve sakla
  ensureSessionId() {
    try {
      const key = 'questionApiSessionId';
      let sid = localStorage.getItem(key);
      if (!sid) {
        sid = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(key, sid);
      }
      return sid;
    } catch (e) {
      // localStorage yoksa anlık üret
      return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    }
  }

  // Rastgele soru seçme
  getRandomQuestions(questions, count) {
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, count);
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

  // İstemci tarafı dinamik soru üretici (sunucu yoksa farklı içerik için)
  generateDynamicQuestions(count = 90) {
    const questions = [];
    const seenTexts = new Set();
    let guard = 0;
    while (questions.length < count && guard < count * 10) {
      guard++;
      const makeMultiple = Math.random() < 0.75; // %75 çoktan seçmeli
      const q = makeMultiple ? this.generateRandomMultiple() : this.generateRandomMatching();
      // Metin bazlı benzersizlik
      if (!seenTexts.has(q.question)) {
        seenTexts.add(q.question);
        questions.push(q);
      }
    }
    // Yeterli değilse, kalanları farklı varyasyonlarla doldur
    while (questions.length < count) {
      questions.push(this.generateRandomMultiple());
    }
    return questions;
  }

  generateRandomMultiple() {
    const kind = Math.floor(Math.random() * 4);
    if (kind === 0) {
      // Toplama
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 90) + 10;
      const result = a + b;
      const wrongs = this.uniqueWrongs([result], () => result + this.randInt(-15, 20), 3);
      const options = this.shuffleArray([result, ...wrongs]).map(String);
      return { type: 'multiple', question: `${a} + ${b} = ?`, options, answer: String(result) };
    }
    if (kind === 1) {
      // Çarpma
      const a = Math.floor(Math.random() * 12) + 2;
      const b = Math.floor(Math.random() * 12) + 2;
      const result = a * b;
      const wrongs = this.uniqueWrongs([result], () => result + this.randInt(-12, 18), 3);
      const options = this.shuffleArray([result, ...wrongs]).map(String);
      return { type: 'multiple', question: `${a} × ${b} = ?`, options, answer: String(result) };
    }
    if (kind === 2) {
      // Coğrafya: ülke-başkent
      const pairs = [
        ['Türkiye', 'Ankara'], ['Almanya', 'Berlin'], ['Fransa', 'Paris'], ['İtalya', 'Roma'],
        ['İspanya', 'Madrid'], ['Portekiz', 'Lizbon'], ['Hollanda', 'Amsterdam'], ['Belçika', 'Brüksel'],
        ['Avusturya', 'Viyana'], ['İsviçre', 'Bern']
      ];
      const [country, capital] = pairs[Math.floor(Math.random() * pairs.length)];
      const wrongCaps = this.shuffleArray(pairs.filter(p => p[1] !== capital)).slice(0, 3).map(p => p[1]);
      const options = this.shuffleArray([capital, ...wrongCaps]);
      return { type: 'multiple', question: `${country} ülkesinin başkenti neresidir?`, options, answer: capital };
    }
    // Bilim: periyodik tablo sembolü
    const elements = [
      ['H', 'Hidrojen'], ['He', 'Helyum'], ['Li', 'Lityum'], ['Be', 'Berilyum'], ['B', 'Bor'], ['C', 'Karbon'],
      ['N', 'Azot'], ['O', 'Oksijen'], ['F', 'Flor'], ['Ne', 'Neon'], ['Na', 'Sodyum'], ['Mg', 'Magnezyum'],
      ['Al', 'Alüminyum'], ['Si', 'Silikon'], ['P', 'Fosfor'], ['S', 'Kükürt'], ['Cl', 'Klor'], ['Ar', 'Argon']
    ];
    const [sym, elem] = elements[Math.floor(Math.random() * elements.length)];
    const wrongs = this.shuffleArray(elements.filter(e => e[1] !== elem)).slice(0, 3).map(e => e[1]);
    const options = this.shuffleArray([elem, ...wrongs]);
    return { type: 'multiple', question: `Hangi element periyodik tabloda "${sym}" sembolü ile gösterilir?`, options, answer: elem };
  }

  generateRandomMatching() {
    const kind = Math.floor(Math.random() * 3);
    if (kind === 0) {
      const left = ['Kırmızı + Mavi', 'Mavi + Sarı', 'Kırmızı + Sarı', 'Kırmızı + Yeşil'];
      const right = ['Mor', 'Yeşil', 'Turuncu', 'Kahverengi'];
      return { type: 'matching', question: 'Aşağıdaki renk karışımlarını sonuçlarıyla eşleştirin:', leftItems: left, rightItems: right, answer: 'Kırmızı + Mavi-Mor,Mavi + Sarı-Yeşil,Kırmızı + Sarı-Turuncu,Kırmızı + Yeşil-Kahverengi' };
    }
    if (kind === 1) {
      const left = ['Köpek', 'Kartal', 'Balık', 'Kurbağa'];
      const right = ['Memeli', 'Kuş', 'Balık', 'Amfibi'];
      return { type: 'matching', question: 'Aşağıdaki hayvanları sınıflarıyla eşleştirin:', leftItems: left, rightItems: right, answer: 'Köpek-Memeli,Kartal-Kuş,Balık-Balık,Kurbağa-Amfibi' };
    }
    const left = ['Merkür', 'Venüs', 'Dünya', 'Mars'];
    const right = ['1. sıra', '2. sıra', '3. sıra', '4. sıra'];
    return { type: 'matching', question: 'Gezegenleri Güneş’e uzaklığa göre sıralamasıyla eşleştirin:', leftItems: left, rightItems: right, answer: 'Merkür-1. sıra,Venüs-2. sıra,Dünya-3. sıra,Mars-4. sıra' };
  }

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  uniqueWrongs(excludeList, generator, needed) {
    const set = new Set(excludeList);
    const out = [];
    let guard = 0;
    while (out.length < needed && guard < 100) {
      guard++;
      const val = generator();
      if (!set.has(val)) {
        set.add(val);
        out.push(val);
      }
    }
    // Son çare: artan değerlerle doldur
    while (out.length < needed) out.push((out[out.length - 1] || 0) + 1);
    return out;
  }

  // Test sonuçlarını API'ye gönderme
  async sendResults(results) {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          totalScore: results.totalScore,
          stageScores: results.stageScores,
          correctAnswers: results.correctAnswers,
          wrongAnswers: results.wrongAnswers,
          timeSpent: results.timeSpent,
          deviceInfo: {
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            language: navigator.language
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Results API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Sonuçlar başarıyla gönderildi:', result);
      return result;

    } catch (error) {
      console.error('Sonuç gönderme hatası:', error);
      // Hata durumunda yerel depolama
      this.saveResultsLocally(results);
      return null;
    }
  }

  // Yerel depolama
  saveResultsLocally(results) {
    try {
      const localResults = JSON.parse(localStorage.getItem('stressTestResults') || '[]');
      localResults.push({
        ...results,
        timestamp: new Date().toISOString()
      });
      
      // Son 50 sonucu tut
      if (localResults.length > 50) {
        localResults.splice(0, localResults.length - 50);
      }
      
      localStorage.setItem('stressTestResults', JSON.stringify(localResults));
      console.log('Sonuçlar yerel olarak kaydedildi');
    } catch (error) {
      console.error('Yerel kaydetme hatası:', error);
    }
  }

  // Yerel sonuçları getirme
  getLocalResults() {
    try {
      return JSON.parse(localStorage.getItem('stressTestResults') || '[]');
    } catch (error) {
      console.error('Yerel sonuç okuma hatası:', error);
      return [];
    }
  }

  // Cache'i temizleme (artık cache yok)
  clearCache() {
    console.log('Cache sistemi kaldırıldı - her seferinde yeni sorular');
  }

  // API bağlantı testi
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('API bağlantı testi hatası:', error);
      return false;
    }
  }
}

// Global API instance
const questionAPI = new QuestionAPI();

// Export for use in other files
window.questionAPI = questionAPI; 