const TOTAL_QUESTIONS = 90;
const QUESTIONS_PER_STAGE = 30;
const STRESS_LEVELS = ['normal', 'medium', 'high'];
let selectedQuestions = [];
let currentStage = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let errorCount = 0;
let correctCount = 0;
let currentQuestionAnswered = false;
let timer = null;
let timeLeft = 0;
// Add stage-specific score tracking
let stageScores = [0, 0, 0]; // [normal, medium, high]
let stageErrors = [0, 0, 0]; // [normal, medium, high]
let stageCorrects = [0, 0, 0]; // [normal, medium, high]

const UI_TEXTS = {
    appTitle: 'Stres Testi',
    next: 'Sonraki',
    errorRate: 'Hata Oranı',
    timer: 'Süre',
    restart: 'Tekrar Başla',
    resultTitle: 'Test Bitti!',
    stage: 'Aşama',
    correct: 'Doğru',
    wrong: 'Hata',
    totalCorrect: 'Toplam Doğru',
    totalWrong: 'Toplam Hata',
    totalErrorRate: 'Toplam Hata Oranı',
    motivation: [
      'Harika! Stres altında bile çok başarılısın.',
      'Gayet iyi! Biraz daha dikkatle daha iyi olabilirsin.',
      'Fena değil, stres seviyeni yönetmeye çalış.',
      'Stres altında zorlandın, ama denemeye devam!'
    ]
};
function shuffleArray(arr) {
  return arr.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
}
// Gelen soruları arayüz için normalize eder: seçenekleri karıştırır ve doğru cevabı indeks olarak ayarlar
function prepareQuestionsForUI(questions) {
  const shuffleInPlace = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return questions.map((q) => {
    const normalized = { ...q };

    if (normalized.type === 'multiple' && Array.isArray(normalized.options)) {
      let correctIndex;
      if (typeof normalized.answer === 'number') {
        correctIndex = normalized.answer;
      } else if (typeof normalized.answer === 'string') {
        correctIndex = normalized.options.findIndex((opt) => opt === normalized.answer);
      }

      // Emniyet: bulunamazsa ilk seçenek doğru varsayılır
      if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex >= normalized.options.length) {
        correctIndex = 0;
      }

      // Seçenekleri karıştır ve doğru cevabın yeni indeksini hesapla
      const optionsWithFlag = normalized.options.map((opt, idx) => ({ text: opt, isCorrect: idx === correctIndex }));
      shuffleInPlace(optionsWithFlag);
      normalized.options = optionsWithFlag.map((o) => o.text);
      normalized.answer = optionsWithFlag.findIndex((o) => o.isCorrect);
    }

    if (normalized.type === 'matching' && normalized.leftItems && normalized.rightItems) {
      // Sunucu metin tabanlı eşleştirme döndürebilir: "left-right,left2-right2,..."
      if (!Array.isArray(normalized.answer) && typeof normalized.answer === 'string') {
        try {
          const pairs = normalized.answer.split(',').map((p) => p.trim());
          const mapping = Array(normalized.leftItems.length).fill(0);
          pairs.forEach((pair) => {
            const [leftText, rightText] = pair.split('-');
            const l = normalized.leftItems.indexOf(leftText);
            const r = normalized.rightItems.indexOf(rightText);
            if (l >= 0 && r >= 0) mapping[l] = r;
          });
          normalized.answer = mapping;
        } catch (e) {
          // Bir sorun olursa kimlik eşlemesi kullan
          normalized.answer = normalized.leftItems.map((_, i) => i);
        }
      }
      // Eğer cevap zaten dizi ise dokunma
    }

    return normalized;
  });
}
async function pickQuestions() {
  try {
    // API'den sorular çekmeye çalış
    if (window.questionAPI) {
      console.log('API\'den sorular çekiliyor...');
      const qs = await window.questionAPI.fetchQuestions(90);
      return prepareQuestionsForUI(qs);
    } else {
      console.log('API mevcut değil, yerel sorular kullanılıyor...');
      const qs = shuffleArray(QUESTION_POOL).slice(0, 90);
      return prepareQuestionsForUI(qs);
    }
  } catch (error) {
    console.error('Soru çekme hatası:', error);
    // Hata durumunda yerel soruları kullan
    const qs = shuffleArray(QUESTION_POOL).slice(0, 90);
    return prepareQuestionsForUI(qs);
  }
}
function getStage() {
  if (currentQuestionIndex < 30) return 0;
  if (currentQuestionIndex < 60) return 1;
  return 2;
}
function updateProgress() {
  const percent = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
  document.getElementById('progress').style.width = percent + '%';
  document.getElementById('progress-percent').textContent = ' %' + Math.round(percent);
}
function startTimer(duration) {
  clearInterval(timer);
  timeLeft = duration;
  const timerDiv = document.getElementById('timer');
  const timerSlider = document.getElementById('timer-slider');
  const timerText = document.getElementById('timer-text');
  
  timerDiv.style.display = 'none';
  
  // Update timer in question area
  if (timerText) {
    timerText.textContent = formatTime(timeLeft);
  }
  
  // Update timer progress circle
  const timerProgress = document.querySelector('.timer-progress');
  if (timerProgress) {
    const circumference = 2 * Math.PI * 54; // r=54
    const progress = (timeLeft / duration) * circumference;
    timerProgress.style.strokeDashoffset = circumference - progress;
  }
  
  timer = setInterval(() => {
    timeLeft--;
    
    // Update timer in question area
    if (timerText) {
      timerText.textContent = formatTime(timeLeft);
    }
    
    // Update timer progress circle
    const timerProgress = document.querySelector('.timer-progress');
    if (timerProgress) {
      const circumference = 2 * Math.PI * 54; // r=54
      const progress = (timeLeft / duration) * circumference;
      timerProgress.style.strokeDashoffset = circumference - progress;
    }
    
    if (timeLeft <= 10) {
      if (timerText) timerText.classList.add('blink');
    } else {
      if (timerText) timerText.classList.remove('blink');
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (timerText) timerText.classList.remove('blink');
      autoNextQuestion();
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
  const timerDiv = document.getElementById('timer');
  const timerFloating = document.getElementById('timer-floating');
  const timerText = document.getElementById('timer-text');
  
  timerDiv.style.display = 'none';
  timerDiv.classList.remove('blink');
  timerFloating.style.display = 'none';
  timerFloating.classList.remove('blink');
  
  if (timerText) {
    timerText.classList.remove('blink');
  }
}
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function setStressLevel(level) {
  document.body.className = `stress-${level}`;
  if (!window.stressIntervals) {
    window.stressIntervals = [];
  }
  if (level === 'medium') {
    startTimer(35); 
    const mediumFlashInterval = setInterval(() => {
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.background = 'rgba(255, 23, 68, 0.02)';
      flash.style.pointerEvents = 'none';
      flash.style.zIndex = '9997';
      flash.style.animation = 'flashEffect 0.4s ease-out';
      document.body.appendChild(flash);
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, 400);
    }, 8000);
    window.stressIntervals.push(mediumFlashInterval);
  } else if (level === 'high') {
    console.log('3. AŞAMA BAŞLADI - PROFESYONEL DİKKAT DAĞITICI UNSURLAR EKLENİYOR!');
    addAdvancedDistractors(); 
    startTimer(15); 
    const highFlashInterval = setInterval(() => {
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.background = 'rgba(255, 23, 68, 0.08)';
      flash.style.pointerEvents = 'none';
      flash.style.zIndex = '9997';
      flash.style.animation = 'flashEffect 0.2s ease-out';
      document.body.appendChild(flash);
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, 200);
    }, 3000);
    const screenFlashInterval = setInterval(() => {
      document.body.style.backgroundColor = 'rgba(255, 23, 68, 0.05)';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 150);
    }, 2500);
    window.stressIntervals.push(highFlashInterval, screenFlashInterval);
  }
}
function addWarning(text) {
  removeWarnings();
  const warn = document.createElement('div');
  warn.className = 'stress-warning';
  warn.textContent = text;
  warn.style.position = 'fixed';
  warn.style.top = '20px';
  warn.style.left = '50%';
  warn.style.transform = 'translateX(-50%)';
  warn.style.zIndex = '10000';
  warn.style.pointerEvents = 'none';
  document.body.appendChild(warn);
}
function removeWarnings() {
  document.querySelectorAll('.stress-warning').forEach(e => e.remove());
}
function shakeContainerOnce() {
  const el = document.getElementById('app-container');
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 600);
}
/* ŞEKİLLER KALDIRILDI - 3. AŞAMA İÇİN DAHA GÜZEL EFEKTLER KULLANILDI */
function addAdvancedDistractors() {
  document.querySelectorAll('.distract').forEach(e => e.remove());
  console.log('PROFESYONEL DİKKAT DAĞITICI EFEKTLER EKLENİYOR!');
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.style.background = `
      radial-gradient(circle at 20% 20%, rgba(255, 23, 68, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(0, 230, 118, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 109, 0, 0.05) 0%, transparent 70%),
      linear-gradient(135deg, rgba(255, 23, 68, 0.05) 0%, rgba(0, 230, 118, 0.05) 50%, rgba(255, 109, 0, 0.05) 100%)
    `;
    appContainer.style.animation = 'containerPattern 8s ease-in-out infinite';
  }
  const timer = document.getElementById('timer');
  if (timer) {
    timer.style.animation = 'timerPulse 2s ease-in-out infinite';
    timer.style.boxShadow = '0 0 30px rgba(255, 23, 68, 0.8)';
  }
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.style.animation = 'scorePulse 3s ease-in-out infinite';
    scoreDisplay.style.boxShadow = '0 0 25px rgba(0, 230, 118, 0.6)';
  }
  const buttons = document.querySelectorAll('#question-area button');
  buttons.forEach(button => {
    button.style.animation = 'buttonGlow 4s ease-in-out infinite';
    button.style.boxShadow = '0 0 20px rgba(255, 109, 0, 0.5)';
  });
  const flashInterval = setInterval(() => {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(255, 23, 68, 0.03)';
    flash.style.zIndex = '9990';
    flash.style.pointerEvents = 'none';
    flash.style.animation = 'flashEffect 0.3s ease-out';
    document.body.appendChild(flash);
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 300);
  }, 4000);
  const screenFlashInterval = setInterval(() => {
    document.body.style.backgroundColor = 'rgba(255, 23, 68, 0.02)';
    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, 200);
  }, 3000);
  const hueInterval = setInterval(() => {
    const hueShift = (Math.random() - 0.5) * 30;
    document.body.style.filter = `hue-rotate(${hueShift}deg)`;
    setTimeout(() => {
      document.body.style.filter = '';
    }, 1000);
  }, 5000);
  if (!window.stressIntervals) {
    window.stressIntervals = [];
  }
  window.stressIntervals.push(flashInterval, screenFlashInterval, hueInterval);
}
function removeDistractors() {
  document.querySelectorAll('.distract').forEach(e => e.remove());
}
function autoNextQuestion() {
  if (currentQuestionIndex >= TOTAL_QUESTIONS) return;
  currentQuestionAnswered = false;
  userAnswers[currentQuestionIndex] = null;
  currentQuestionIndex++;
  updateProgress();
  if ((currentQuestionIndex === 30 || currentQuestionIndex === 60) && currentQuestionIndex < TOTAL_QUESTIONS) {
    currentStage++;
    setStressLevel(STRESS_LEVELS[currentStage]);
  }
  if (currentQuestionIndex < TOTAL_QUESTIONS) {
    showQuestion();
  } else {
    showResult();
  }
}
function showWarning(msg) {
  const warn = document.getElementById('answer-warning');
  warn.textContent = msg;
  warn.style.display = 'block';
}
function hideWarning() {
  const warn = document.getElementById('answer-warning');
  warn.textContent = '';
  warn.style.display = 'none';
}
function showQuestion() {
  stopTimer();
  removeDistractors();
  hideWarning();
  updateProgress();
  updateScoreDisplay();
  currentQuestionAnswered = false; 
  setStressLevel(STRESS_LEVELS[currentStage]);
  
  // 1. aşama için özel class ekle
  const questionArea = document.getElementById('question-area');
  questionArea.classList.remove('stage-0', 'stage-1', 'stage-2');
  questionArea.classList.add(`stage-${currentStage}`);
  
  let matches = [];
  const q = selectedQuestions[currentQuestionIndex];
  const questionText = document.getElementById('question-text');
  const optionsDiv = document.getElementById('options');
  const matchingArea = document.getElementById('matching-area');
  const nextBtn = document.getElementById('next-btn');
  
  nextBtn.disabled = true;
  optionsDiv.innerHTML = '';
  matchingArea.style.display = 'none';
  nextBtn.textContent = 'Sonraki';
  
  // Create timer display above the title (only for stage 1 and 2)
  const header = document.querySelector('header');
  let existingTimer = document.querySelector('.question-timer');
  if (!existingTimer) {
    existingTimer = document.createElement('div');
    existingTimer.className = 'question-timer';
    existingTimer.innerHTML = `
      <div class="timer-container">
        <div class="timer-circle">
          <svg class="timer-svg" width="120" height="120">
            <circle class="timer-bg" cx="60" cy="60" r="54" stroke-width="8"/>
            <circle class="timer-progress" cx="60" cy="60" r="54" stroke-width="8"/>
          </svg>
          <div class="timer-text-container">
            <span id="timer-text">01:00</span>
          </div>
        </div>
      </div>
    `;
    header.insertBefore(existingTimer, header.querySelector('h1'));
  }
  
  // Show timer only for stage 1 (medium) and stage 2 (high)
  if (currentStage === 0) {
    // Normal stage - hide timer
    if (existingTimer) existingTimer.style.display = 'none';
  } else {
    // Medium and High stages - show timer
    if (existingTimer) existingTimer.style.display = 'block';
  }
  
  if (q.type === 'multiple') {
    questionText.textContent = typeof q.question === 'object' ? q.question.tr : q.question;
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = typeof opt === 'object' ? opt.tr : opt;
      if (userAnswers[currentQuestionIndex] === idx) {
        btn.classList.add('selected');
        nextBtn.disabled = false;
      }
      btn.onclick = () => {
        if (currentQuestionAnswered || btn.disabled) return; // Prevent multiple clicks
        
        currentQuestionAnswered = true;
        // Disable all buttons immediately
        document.querySelectorAll('.option-btn').forEach(b => {
          b.disabled = true;
          b.classList.remove('selected', 'correct', 'incorrect');
        });
        
        btn.classList.add('selected');
        if (idx === q.answer) {
          btn.classList.add('correct');
          correctCount++;
          stageCorrects[currentStage]++;
        } else {
          btn.classList.add('incorrect');
          errorCount++;
          stageErrors[currentStage]++;
          // Show correct answer
          document.querySelectorAll('.option-btn').forEach((b, i) => {
            if (i === q.answer) {
              b.classList.add('correct');
            }
          });
        }
        nextBtn.disabled = false;
        btn.dataset.selected = idx;
        hideWarning();
        updateScoreDisplay();
      };
      optionsDiv.appendChild(btn);
    });
  } else if (q.type === 'matching') {
    questionText.textContent = typeof q.question === 'object' ? q.question.tr : q.question;
    optionsDiv.innerHTML = '';
    matchingArea.style.display = 'flex';
    matchingArea.innerHTML = '';
    matchingArea.className = 'matching-flex';
    
    const leftCol = document.createElement('div');
    leftCol.className = 'matching-col left';
    const rightCol = document.createElement('div');
    rightCol.className = 'matching-col right';
    
    const leftItems = q.leftItems;
    const rightItems = shuffleArray([...q.rightItems]);
    let selectedLeft = null;
    let selectedRight = null;
    let matchedLeft = Array(leftItems.length).fill(false);
    let matchedRight = Array(rightItems.length).fill(false);
    
    leftItems.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = item;
      btn.onclick = () => {
        if (matchedLeft[i] || currentQuestionAnswered || btn.disabled) return;
        document.querySelectorAll('.matching-col.left .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedLeft = i;
        tryMatch();
      };
      leftCol.appendChild(btn);
    });
    
    rightItems.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = item;
      btn.onclick = () => {
        if (matchedRight[i] || currentQuestionAnswered || btn.disabled) return;
        document.querySelectorAll('.matching-col.right .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedRight = i;
        tryMatch();
      };
      rightCol.appendChild(btn);
    });
    
    matchingArea.appendChild(leftCol);
    matchingArea.appendChild(rightCol);
    
    function tryMatch() {
      if (selectedLeft !== null && selectedRight !== null) {
        const leftVal = leftItems[selectedLeft];
        const rightVal = rightItems[selectedRight];
        const correctRightItem = q.rightItems[q.answer[selectedLeft]];
        const leftBtn = leftCol.children[selectedLeft];
        const rightBtn = rightCol.children[selectedRight];
        
        if (rightVal === correctRightItem && !matchedLeft[selectedLeft] && !matchedRight[selectedRight]) {
          leftBtn.classList.add('correct');
          rightBtn.classList.add('correct');
          matches.push({ left: selectedLeft, right: selectedRight, correct: true });
        } else {
          leftBtn.classList.add('incorrect');
          rightBtn.classList.add('incorrect');
          matches.push({ left: selectedLeft, right: selectedRight, correct: false });
        }
        
        matchedLeft[selectedLeft] = true;
        matchedRight[selectedRight] = true;
        
        setTimeout(() => {
          leftBtn.classList.remove('selected');
          rightBtn.classList.remove('selected');
          leftBtn.disabled = true;
          rightBtn.disabled = true;
        }, 300);
        
        selectedLeft = null;
        selectedRight = null;
        
        if (matches.length === leftItems.length) {
          currentQuestionAnswered = true;
          document.querySelectorAll('.matching-col .option-btn').forEach(b => b.disabled = true);
          document.getElementById('next-btn').disabled = false;
          
          // Calculate score for matching question
          let correct = 0;
          let wrong = 0;
          for (let i = 0; i < matches.length; i++) {
            if (matches[i].correct) {
              correct++;
            } else {
              wrong++;
            }
          }
          if (correct > wrong) {
            correctCount++;
            stageCorrects[currentStage]++;
          } else {
            errorCount++;
            stageErrors[currentStage]++;
          }
          updateScoreDisplay();
        }
      }
    }
  }
  
  nextBtn.onclick = () => {
    const q = selectedQuestions[currentQuestionIndex];
    let answered = false;
    let userAnswer = null;
    
    if (q.type === 'multiple') {
      const selectedBtn = document.querySelector('.option-btn.selected');
      if (selectedBtn) {
        answered = true;
        userAnswer = parseInt(selectedBtn.dataset.selected);
      }
    } else if (q.type === 'matching') {
      const allMatched = document.querySelectorAll('.matching-col .option-btn:disabled').length === q.leftItems.length * 2;
      if (allMatched) {
        answered = true;
      }
    }
    
    if (!answered) {
      showWarning('Lütfen bir cevap seçin.');
      return;
    }
    
    hideWarning();
    userAnswers[currentQuestionIndex] = userAnswer;
    currentQuestionIndex++;
    updateProgress();
    
    if ((currentQuestionIndex === 30 || currentQuestionIndex === 60) && currentQuestionIndex < TOTAL_QUESTIONS) {
      currentStage++;
      setStressLevel(STRESS_LEVELS[currentStage]);
    }
    
    if (currentQuestionIndex < TOTAL_QUESTIONS) {
      showQuestion();
    } else {
      showResult();
    }
  };
}
function downloadResultCSV(totalScore, stageScores) {
  const now = new Date();
  const dateStr = now.toISOString();
  const csv = `tarih,toplam_puan,normal_asama,orta_asama,yuksek_asama\n${dateStr},${totalScore},${stageScores[0]},${stageScores[1]},${stageScores[2]}\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'results.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
async function saveResultToServer(totalScore, stageScores) {
  try {
    const results = {
      totalScore,
      stageScores,
      correctAnswers: correctCount,
      wrongAnswers: errorCount,
      timeSpent: Date.now() - window.testStartTime || 0,
      userAnswers: userAnswers
    };
    
    // API'ye gönderme
    if (window.questionAPI) {
      await window.questionAPI.sendResults(results);
    } else {
      // Fallback - yerel kaydetme
      const localResults = JSON.parse(localStorage.getItem('stressTestResults') || '[]');
      localResults.push({
        ...results,
        date: new Date().toISOString()
      });
      localStorage.setItem('stressTestResults', JSON.stringify(localResults));
    }
  } catch (error) {
    console.error('Sonuç kaydetme hatası:', error);
  }
}
function showResult() {
  stopTimer();
  removeDistractors();
  removeWarnings();
  const resultLoading = document.getElementById('result-loading');
  const mainContainer = document.getElementById('app-container');
  if (resultLoading && mainContainer) {
    document.body.style.animation = 'none';
    document.body.style.transform = 'none';
    document.body.style.transition = 'none';
    document.body.style.filter = 'none';
    if (window.stressIntervals) {
      window.stressIntervals.forEach(interval => clearInterval(interval));
      window.stressIntervals = [];
    }
    document.body.classList.remove('stress-high', 'stress-medium', 'stress-normal');
    mainContainer.style.display = 'none';
    resultLoading.style.display = 'flex';
    setTimeout(() => {
      showFinalResult();
    }, 3000);
  } else {
    showFinalResult();
  }
}
function showFinalResult() {
  const resultLoading = document.getElementById('result-loading');
  const mainContainer = document.getElementById('app-container');
  if (resultLoading) {
    resultLoading.style.display = 'none';
  }
  if (mainContainer) {
    mainContainer.style.display = '';
  }
  document.body.style.animation = '';
  document.body.style.filter = '';
  document.body.style.backgroundColor = '';
  document.body.className = '';
  document.body.style.background = 'linear-gradient(135deg, #e3f0ff 0%, #f6f8fa 100%)'; 
  if (window.stressIntervals) {
    window.stressIntervals.forEach(interval => clearInterval(interval));
    window.stressIntervals = [];
  }
  document.querySelectorAll('[style*="flash"]').forEach(el => el.remove());
  document.body.style.animation = 'none';
  document.body.style.transform = 'none';
  document.body.style.transition = 'none';
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.style.animation && el.style.animation.includes('stress')) {
      el.style.animation = 'none';
    }
    if (el.style.animation && el.style.animation.includes('shake')) {
      el.style.animation = 'none';
    }
    if (el.style.animation && el.style.animation.includes('flash')) {
      el.style.animation = 'none';
    }
    if (el.style.animation && el.style.animation.includes('pulse')) {
      el.style.animation = 'none';
    }
  });
  document.body.classList.remove('stress-high', 'stress-medium', 'stress-normal');
  document.body.classList.add('result-screen');
  const overlays = document.querySelectorAll('body::before, body::after');
  overlays.forEach(overlay => {
    if (overlay) {
      overlay.style.display = 'none';
    }
  });
  if (window.stressIntervals) {
    window.stressIntervals.forEach(interval => clearInterval(interval));
    window.stressIntervals = [];
  }
  document.querySelectorAll('[style*="flash"]').forEach(el => el.remove());
  mainContainer.style.animation = '';
  mainContainer.style.filter = '';
  const header = document.querySelector('header');
  if (header) {
    header.style.display = 'none';
  }
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.display = 'none';
  }
  const questionArea = document.getElementById('question-area');
  if (questionArea) {
    questionArea.innerHTML = '';
    questionArea.style.marginTop = '50px'; 
  }
  const timer = document.getElementById('timer');
  if (timer) {
    timer.style.display = 'none';
    timer.style.animation = '';
  }
  const floatingTimer = document.getElementById('timer-floating');
  if (floatingTimer) {
    floatingTimer.style.display = 'none';
  }
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.style.display = 'none';
  }
  let html = `<div class='result-summary'><div style='font-size:3.5rem;margin-bottom:18px;filter:drop-shadow(0 2px 12px #4fc3f7aa);animation:resultIconPulse 1.5s infinite alternate;'>📊</div><h2>${UI_TEXTS.resultTitle}</h2>`;
  let totalScore = 0;
  let stageScores = [0, 0, 0];
  let stageCounts = [0, 0, 0];
  
  for (let i = 0; i < userAnswers.length; i++) {
    const answer = userAnswers[i];
    if (typeof answer === 'number' && answer >= 0 && answer <= 4) {
      totalScore += (answer + 1);
      if (i < 30) stageScores[0] += (answer + 1), stageCounts[0]++;
      else if (i < 60) stageScores[1] += (answer + 1), stageCounts[1]++;
      else stageScores[2] += (answer + 1), stageCounts[2]++;
    }
  }
  
  saveResultToServer(totalScore, stageScores);
  
  let stressLevel = '';
  let stressMsg = '';
  if (totalScore <= 150) {
    stressLevel = 'Düşük Stres';
    stressMsg = 'Stres düzeyiniz düşük. Gayet iyi gidiyorsunuz!';
  } else if (totalScore <= 300) {
    stressLevel = 'Orta Stres';
    stressMsg = 'Orta düzeyde stres belirtileri gösteriyorsunuz. Dikkatli olun ve gevşeme tekniklerini uygulayın.';
  } else {
    stressLevel = 'Yüksek Stres';
    stressMsg = 'Stres düzeyiniz yüksek. Destek almayı ve stres yönetimi tekniklerini uygulamayı düşünebilirsiniz.';
  }
  
  html += `<div style='font-size:1.3rem;font-weight:bold;margin-bottom:10px;'>Toplam Puan: ${totalScore} / 450</div>`;
  html += `<div style='font-size:1.15rem;margin-bottom:10px;'>Seviye: <b>${stressLevel}</b></div>`;
  html += `<div style='margin-bottom:18px;'>${stressMsg}</div>`;
  
  // Add detailed stage results
  html += `<div style='margin-bottom:20px;'><h3 style='color:#4fc3f7;margin-bottom:10px;'>Aşama Detayları:</h3>`;
  html += `<div style='background:rgba(255,255,255,0.1);border-radius:12px;padding:16px;margin-bottom:10px;'>`;
  html += `<div style='margin-bottom:8px;'><b>Normal Aşama (1-30):</b></div>`;
  html += `<div style='margin-left:16px;margin-bottom:4px;'>Doğru: <span style='color:#4caf50;font-weight:bold;'>${stageCorrects[0]}</span> | Yanlış: <span style='color:#f44336;font-weight:bold;'>${stageErrors[0]}</span></div>`;
  html += `<div style='margin-left:16px;margin-bottom:8px;'>Puan: <b>${stageScores[0]}</b> / ${stageCounts[0]*5}</div>`;
  
  html += `<div style='margin-bottom:8px;'><b>Orta Aşama (31-60):</b></div>`;
  html += `<div style='margin-left:16px;margin-bottom:4px;'>Doğru: <span style='color:#4caf50;font-weight:bold;'>${stageCorrects[1]}</span> | Yanlış: <span style='color:#f44336;font-weight:bold;'>${stageErrors[1]}</span></div>`;
  html += `<div style='margin-left:16px;margin-bottom:8px;'>Puan: <b>${stageScores[1]}</b> / ${stageCounts[1]*5}</div>`;
  
  html += `<div style='margin-bottom:8px;'><b>Yüksek Aşama (61-90):</b></div>`;
  html += `<div style='margin-left:16px;margin-bottom:4px;'>Doğru: <span style='color:#4caf50;font-weight:bold;'>${stageCorrects[2]}</span> | Yanlış: <span style='color:#f44336;font-weight:bold;'>${stageErrors[2]}</span></div>`;
  html += `<div style='margin-left:16px;margin-bottom:4px;'>Puan: <b>${stageScores[2]}</b> / ${stageCounts[2]*5}</div>`;
  html += `</div></div>`;
  
  html += `<button id='restart-btn'>${UI_TEXTS.restart}</button>`;
  html += `</div></div>`;
  
  if (questionArea) {
    questionArea.innerHTML = html;
    questionArea.style.marginTop = '0px';
    questionArea.style.marginBottom = '100px';
  }
  
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('timer').style.display = 'none';
  document.getElementById('restart-btn').onclick = () => {
    try {
      // Başlangıç ekranına dön ve kullanıcı "Teste Başla" ile devam etsin
      document.body.classList.remove('result-screen');
      removeScoreDisplay();
      currentStage = 0;
      currentQuestionIndex = 0;
      userAnswers = [];
      errorCount = 0;
      correctCount = 0;
      currentQuestionAnswered = false;
      stageScores = [0, 0, 0];
      stageErrors = [0, 0, 0];
      stageCorrects = [0, 0, 0];
      const startScreen = document.getElementById('start-screen');
      const appContainer = document.getElementById('app-container');
      const resultLoading = document.getElementById('result-loading');
      if (resultLoading) resultLoading.style.display = 'none';
      if (appContainer) appContainer.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      if (window._stopStars) { try { window._stopStars(); } catch (_) {} }
      window._stopStars = startStarsAnimation();
      const startBtn = document.getElementById('start-btn');
      if (startBtn) startBtn.onclick = startNewTest;
    } catch (err) {
      console.error('Başlangıç ekranına dönüş hatası:', err);
    }
  };
  document.getElementById('prev-btn').style.display = 'none';
}
function updateScoreDisplay() {
  const scoreDiv = document.getElementById('score-display');
  if (scoreDiv) {
    scoreDiv.innerHTML = `Doğru: <span style="color: #4caf50; font-weight: bold;">${correctCount}</span> | Yanlış: <span style="color: #f44336; font-weight: bold;">${errorCount}</span>`;
  }
}
function createScoreDisplay() {
  const scoreDiv = document.createElement('div');
  scoreDiv.id = 'score-display';
  scoreDiv.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(34, 37, 38, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 20px;
    font-size: 1.1rem;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  `;
  scoreDiv.innerHTML = `Doğru: <span style="color: #4caf50; font-weight: bold;">0</span> | Yanlış: <span style="color: #f44336; font-weight: bold;">0</span>`;
  document.body.appendChild(scoreDiv);
}
function removeScoreDisplay() {
  const scoreDiv = document.getElementById('score-display');
  if (scoreDiv && scoreDiv.parentNode) {
    scoreDiv.parentNode.removeChild(scoreDiv);
  }
}

// Başlangıç ve Tekrar Başla için ortak akış
async function startNewTest() {
  try {
    // Genel temizleme
    stopTimer();
    removeDistractors();
    removeWarnings();
    removeScoreDisplay();
    document.body.classList.remove('result-screen', 'stress-high', 'stress-medium', 'stress-normal');

    // Ekran düzeni
    const startScreen = document.getElementById('start-screen');
    const appContainer = document.getElementById('app-container');
    const resultLoading = document.getElementById('result-loading');
    if (resultLoading) resultLoading.style.display = 'none';
    if (startScreen) startScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = '';

    // Loader kapat
    const loader = document.getElementById('loader-bg');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }

    // Arka plan animasyonu durdur
    if (window._stopStars) { try { window._stopStars(); } catch (_) {} }
    window._stopStars = null;
    const starsCanvas = document.getElementById('stars-bg');
    if (starsCanvas) starsCanvas.style.display = 'none';

    // Sonuç ekranı question-area içeriğini değiştirdiği için iskeleti geri kur
    const questionArea = document.getElementById('question-area');
    if (questionArea) {
      questionArea.innerHTML = `
        <div id="question-text">Soru burada görünecek</div>
        <div id="options"></div>
        <div id="matching-area" style="display:none;"></div>
        <div id="answer-warning" style="display:none; color:#d32f2f; font-weight:bold; margin-top:10px;"></div>
      `;
    }

    // Inline stilleri ve olası yüksek/orta seviye efektlerini sıfırla
    document.body.style.animation = '';
    document.body.style.filter = '';
    document.body.style.background = '';
    document.body.style.backgroundColor = '';
    const timerWidget = document.querySelector('.question-timer');
    if (timerWidget) timerWidget.style.display = 'none';

    // State sıfırla
    currentStage = 0;
    currentQuestionIndex = 0;
    userAnswers = [];
    errorCount = 0;
    correctCount = 0;
    currentQuestionAnswered = false;
    stageScores = [0, 0, 0];
    stageErrors = [0, 0, 0];
    stageCorrects = [0, 0, 0];
    window.testStartTime = Date.now();

    // UI reset
    const prog = document.getElementById('progress');
    const progPct = document.getElementById('progress-percent');
    if (prog) prog.style.width = '0%';
    if (progPct) progPct.textContent = ' %0';
    const nextBtn = document.getElementById('next-btn');
    const timer = document.getElementById('timer');
    const prevBtn = document.getElementById('prev-btn');
    if (nextBtn) nextBtn.style.display = 'block';
    if (timer) timer.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';

    // Stres seviyesini normal'e getir (body class)
    document.body.classList.remove('stress-high', 'stress-medium', 'stress-normal');
    document.body.classList.add('stress-normal');

    // Soruları yükle ve başlat
    console.log('🔄 Yeni sorular yükleniyor...');
    selectedQuestions = await pickQuestions();
    console.log(`✅ ${selectedQuestions.length} yeni soru yüklendi`);
    setStressLevel(STRESS_LEVELS[0]);
    showQuestion();
    updateProgress();
    createScoreDisplay();
  } catch (err) {
    console.error('startNewTest hatası:', err);
  }
}
function startStarsAnimation() {
  const canvas = document.getElementById('stars-bg');
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  let meteors = Array.from({length: 18}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    len: 80 + Math.random() * 60,
    speed: 3 + Math.random() * 3,
    angle: Math.PI / 2.5 + (Math.random() - 0.5) * 0.2
  }));
  let running = true;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const m of meteors) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = '#6cf6ff';
      ctx.shadowColor = '#6cf6ff';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
      ctx.stroke();
      ctx.restore();
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      if (m.x > w + 100 || m.y > h + 100) {
        m.x = Math.random() * w - 100;
        m.y = -Math.random() * 80;
        m.len = 80 + Math.random() * 60;
        m.speed = 3 + Math.random() * 3;
        m.angle = Math.PI / 2.5 + (Math.random() - 0.5) * 0.2;
      }
    }
    if (running) requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });
  return () => { running = false; ctx.clearRect(0,0,w,h); };
}
window.addEventListener('DOMContentLoaded', () => {
  // Test başlangıç zamanını kaydet
  window.testStartTime = Date.now();
  
  // Sayfa yenilendiğinde cache'i temizle
  if (window.questionAPI) {
    window.questionAPI.clearCache();
  }
  
  // Zoom kontrolü
  const preventZoom = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };
  
  document.addEventListener('keydown', preventZoom);
  document.addEventListener('wheel', preventZoom, { passive: false });
  
  const startScreen = document.getElementById('start-screen');
  const appContainer = document.getElementById('app-container');
  if (startScreen && appContainer) {
    appContainer.style.display = 'none';
    startScreen.style.display = 'flex';
    if (window._stopStars) { try { window._stopStars(); } catch (_) {} }
    window._stopStars = startStarsAnimation();
    const startBtn = document.getElementById('start-btn');
    startBtn.onclick = startNewTest;
    return; 
  }
  const loader = document.getElementById('loader-bg');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 800);
    }, 3000);
  }
  selectedQuestions = pickQuestions();
  setStressLevel(STRESS_LEVELS[0]);
  showQuestion();
  updateProgress();
  createScoreDisplay(); 
  document.getElementById('prev-btn').onclick = () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion();
    }
  };
});
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`;
document.head.appendChild(style); 
