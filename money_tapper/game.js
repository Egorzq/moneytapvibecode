/**
 * ДЕНЕЖНЫЙ МАГНАТ — ИГРОВАЯ ЛОГИКА
 * Мобильная игра-тапалка с пассивным доходом, прокачкой и кастомизацией
 */

// ==========================================
// КОНФИГУРАЦИЯ И КОНСТАНТЫ
// ==========================================

const CURRENCIES = {
  RUB: { symbol: '₽', name: 'Рубль', code: 'RUB' },
  USD: { symbol: '$', name: 'Доллар', code: 'USD' },
  EUR: { symbol: '€', name: 'Евро', code: 'EUR' },
  KZT: { symbol: '₸', name: 'Тенге', code: 'KZT' },
  GBP: { symbol: '£', name: 'Фунт', code: 'GBP' },
  BTC: { symbol: '₿', name: 'Биткоин', code: 'BTC' },
  USDT: { symbol: '₮', name: 'USDT', code: 'USDT' }
};

// 5 бизнесов по требованию ТЗ:
// Младший бизнес стоит от 5 000 до 10 000 руб (7 500)
const DEFAULT_BUSINESSES = [
  {
    id: 'coffee',
    name: 'Кофейня to-go',
    icon: '☕',
    desc: 'Ароматный кофе и свежая выпечка для спешащих горожан.',
    baseCost: 7500, // В диапазоне 5 000 - 10 000!
    baseIncome: 25,  // доход в сек
    count: 0
  },
  {
    id: 'carwash',
    name: 'Автомойка 24/7',
    icon: '🚗',
    desc: 'Бесконтактная мойка самообслуживания на оживленном шоссе.',
    baseCost: 35000,
    baseIncome: 140,
    count: 0
  },
  {
    id: 'barbershop',
    name: 'Барбершоп & SPA',
    icon: '✂️',
    desc: 'Премиальный салон мужского стиля с зоной отдыха.',
    baseCost: 160000,
    baseIncome: 750,
    count: 0
  },
  {
    id: 'it_company',
    name: 'IT-компания SaaS',
    icon: '💻',
    desc: 'Разработка мобильных приложений и AI-сервисов по подписке.',
    baseCost: 850000,
    baseIncome: 4200,
    count: 0
  },
  {
    id: 'bank',
    name: 'Частный Банк',
    icon: '🏛️',
    desc: 'Управление инвестициями, выдача займов и венчурный фонд.',
    baseCost: 5000000,
    baseIncome: 28000,
    count: 0
  }
];

const RANKS = [
  { threshold: 0, title: 'Новичок', icon: '🌱' },
  { threshold: 2500, title: 'Энтузиаст', icon: '💵' },
  { threshold: 25000, title: 'Предприниматель', icon: '💼' },
  { threshold: 150000, title: 'Бизнесмен', icon: '👔' },
  { threshold: 1000000, title: 'Миллионер', icon: '💎' },
  { threshold: 15000000, title: 'Мультимиллионер', icon: '🚀' },
  { threshold: 100000000, title: 'Финансовый магнат', icon: '👑' }
];

const STORAGE_KEY = 'money_tapper_save_v1';

// ==========================================
// СОСТОЯНИЕ ИГРЫ (STATE)
// ==========================================

let state = {
  balance: 0,
  tapLevel: 1,
  currency: 'RUB',
  volume: 80,         // Громкость звука 0 - 100%
  vibration: true,     // Вибрация вкл/выкл
  businesses: JSON.parse(JSON.stringify(DEFAULT_BUSINESSES)),
  stats: {
    totalEarned: 0,
    totalTaps: 0,
    playTimeSeconds: 0
  },
  lastSaved: Date.now()
};

let previousVolume = 80; // Для быстрого включения после Mute

// ==========================================
// АУДИО СИНТЕЗАТОР (WEB AUDIO API)
// ==========================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.setVolume(state.volume);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(percent) {
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.masterGain && this.ctx) {
      const normalized = Math.max(0, Math.min(1, percent / 100));
      this.masterGain.gain.setValueAtTime(normalized, this.ctx.currentTime);
    }
  }

  playTap() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Приятный высокий «дзынь / поп»
      const freq = 550 + Math.random() * 80;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playUpgrade() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4 -> C#5 -> E5 -> A5
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + index * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    } catch (e) {
      console.warn('Upgrade sound error', e);
    }
  }

  playBusinessBuy() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Звук успешной крупной покупки «кассовый аппарат / звон монет»
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc1.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, this.ctx.currentTime); // B6
      osc2.frequency.setValueAtTime(2637.02, this.ctx.currentTime + 0.08); // E7

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Buy sound error', e);
    }
  }

  playError() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Error sound error', e);
    }
  }
}

const soundManager = new SoundManager();

// ==========================================
// ФОРМУЛЫ И РАСЧЕТЫ
// ==========================================

/**
 * Расчет дохода за один тап в зависимости от уровня тапа
 * Уровень 1: 1
 * Уровень 2: 2
 * Уровень 3: 4
 * Уровень 4: 7
 * Уровень 5: 12 ...
 */
function getTapPower(level = state.tapLevel) {
  if (level <= 1) return 1;
  return Math.round(Math.pow(1.5, level - 1) + (level - 1));
}

/**
 * Стоимость улучшения силы тапа.
 * Экспоненциальное усложнение: база 100, множитель 1.8x с каждым уровнем.
 * Формула: 100 * (1.8 ^ (level - 1))
 */
function getTapUpgradeCost(level = state.tapLevel) {
  return Math.floor(100 * Math.pow(1.8, level - 1));
}

/**
 * Описание сложности текущего уровня тапа
 */
function getTapDifficultyText(level = state.tapLevel) {
  if (level <= 3) return 'Базовая';
  if (level <= 6) return 'Умеренная (+80% стоимость)';
  if (level <= 10) return 'Высокая (+80% стоимость)';
  if (level <= 15) return 'Тяжелая (+80% стоимость)';
  return 'Экстремальная (+80% стоимость)';
}

/**
 * Расчет стоимости бизнеса с учетом купленного количества
 * Стоимость масштабируется на 15% за каждую единицу
 */
function getBusinessCost(business) {
  return Math.floor(business.baseCost * Math.pow(1.15, business.count));
}

/**
 * Суммарный пассивный доход со всех бизнесов в секунду
 */
function getTotalPassiveIncome() {
  return state.businesses.reduce((sum, b) => sum + (b.count * b.baseIncome), 0);
}

/**
 * Форматирование чисел с разделителем тысяч (1 250 000)
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  const rounded = Math.floor(num);
  return rounded.toLocaleString('ru-RU');
}

/**
 * Получение текущего символа валюты
 */
function getCurrencySymbol() {
  return CURRENCIES[state.currency]?.symbol || '₽';
}

// ==========================================
// ВИБРАЦИЯ (HAPTICS)
// ==========================================

function triggerHaptic(type = 'light') {
  if (!state.vibration || !('vibrate' in navigator)) return;
  try {
    if (type === 'light') {
      navigator.vibrate(12);
    } else if (type === 'medium') {
      navigator.vibrate(25);
    } else if (type === 'success') {
      navigator.vibrate([20, 40, 30]);
    } else if (type === 'error') {
      navigator.vibrate([40, 30, 40]);
    }
  } catch (e) {
    // Игнорируем ограничения браузера
  }
}

// ==========================================
// ИНТЕРФЕЙС И РЕНДЕРИНГ
// ==========================================

// Ссылки на элементы DOM
const balanceDisplay = document.getElementById('balanceDisplay');
const tapIncomeDisplay = document.getElementById('tapIncomeDisplay');
const passiveIncomeDisplay = document.getElementById('passiveIncomeDisplay');
const rankName = document.getElementById('rankName');
const billCenterSymbol = document.getElementById('billCenterSymbol');
const tapTarget = document.getElementById('tapTarget');
const tapStage = document.getElementById('tapStage');
const particlesContainer = document.getElementById('particlesContainer');

// Элементы прогресс-бара прокачки тапа
const tapLevelBadge = document.getElementById('tapLevelBadge');
const nextTapBoostBadge = document.getElementById('nextTapBoostBadge');
const tapProgressPercent = document.getElementById('tapProgressPercent');
const tapProgressBarFill = document.getElementById('tapProgressBarFill');
const btnUpgradeTap = document.getElementById('btnUpgradeTap');
const tapUpgradeCost = document.getElementById('tapUpgradeCost');
const tapDifficultyText = document.getElementById('tapDifficultyText');

// Бизнесы
const businessesList = document.getElementById('businessesList');
const businessBadge = document.getElementById('businessBadge');

// Настройки
const currencyGrid = document.getElementById('currencyGrid');
const volumeSlider = document.getElementById('volumeSlider');
const volumePercentDisplay = document.getElementById('volumePercentDisplay');
const soundIconDisplay = document.getElementById('soundIconDisplay');
const btnToggleMute = document.getElementById('btnToggleMute');
const muteBtnIcon = document.getElementById('muteBtnIcon');
const muteBtnLabel = document.getElementById('muteBtnLabel');
const btnTestSound = document.getElementById('btnTestSound');
const vibrationToggle = document.getElementById('vibrationToggle');

// Статистика
const statTotalEarned = document.getElementById('statTotalEarned');
const statTotalTaps = document.getElementById('statTotalTaps');
const statBusinessesOwned = document.getElementById('statBusinessesOwned');
const statTimePlayed = document.getElementById('statTimePlayed');

// Сброс
const btnResetProgress = document.getElementById('btnResetProgress');
const resetModal = document.getElementById('resetModal');
const btnCancelReset = document.getElementById('btnCancelReset');
const btnConfirmReset = document.getElementById('btnConfirmReset');

// Офлайн доход
const offlineModal = document.getElementById('offlineModal');
const offlineRewardValue = document.getElementById('offlineRewardValue');
const btnCollectOffline = document.getElementById('btnCollectOffline');

// Индикатор сохранения
const saveIndicator = document.getElementById('saveIndicator');

/**
 * Обновление всех надписей валют в DOM
 */
function updateCurrencySymbols() {
  const sym = getCurrencySymbol();
  document.querySelectorAll('.currency-text').forEach(el => {
    el.textContent = sym;
  });
  if (billCenterSymbol) {
    billCenterSymbol.textContent = sym;
  }
}

/**
 * Обновление шапки (баланс, доход, ранг)
 */
function updateHeader() {
  balanceDisplay.textContent = formatNumber(state.balance);
  tapIncomeDisplay.textContent = `+${formatNumber(getTapPower())}`;
  passiveIncomeDisplay.textContent = `+${formatNumber(getTotalPassiveIncome())}`;

  // Ранг
  const currentTotal = state.stats.totalEarned;
  let activeRank = RANKS[0];
  for (const r of RANKS) {
    if (currentTotal >= r.threshold) {
      activeRank = r;
    }
  }
  rankName.textContent = `${activeRank.icon} ${activeRank.title}`;
}

/**
 * Обновление блока прокачки тапа и прогресс-бара
 */
function updateTapUpgradeCard() {
  const currentPower = getTapPower(state.tapLevel);
  const nextPower = getTapPower(state.tapLevel + 1);
  const cost = getTapUpgradeCost(state.tapLevel);
  const gain = nextPower - currentPower;

  tapLevelBadge.textContent = `Уровень ${state.tapLevel}`;
  nextTapBoostBadge.textContent = `+${formatNumber(gain)} / тап (итого: ${formatNumber(nextPower)})`;
  tapUpgradeCost.textContent = formatNumber(cost);
  tapDifficultyText.textContent = getTapDifficultyText(state.tapLevel);

  // Расчет прогресса (насколько близко игрок к покупке улучшения)
  let percent = 0;
  if (cost > 0) {
    percent = Math.min(100, Math.floor((state.balance / cost) * 100));
  }

  tapProgressPercent.textContent = `${percent}%`;
  tapProgressBarFill.style.width = `${percent}%`;

  if (state.balance >= cost) {
    btnUpgradeTap.disabled = false;
    btnUpgradeTap.classList.add('ready');
  } else {
    btnUpgradeTap.disabled = true;
    btnUpgradeTap.classList.remove('ready');
  }
}

/**
 * Рендеринг списка бизнесов
 */
function renderBusinesses() {
  businessesList.innerHTML = '';
  let canAffordAny = 0;

  state.businesses.forEach(b => {
    const cost = getBusinessCost(b);
    const canAfford = state.balance >= cost;
    if (canAfford) canAffordAny++;

    const totalIncome = b.count * b.baseIncome;

    const card = document.createElement('div');
    card.className = `business-card ${b.count > 0 ? 'owned' : ''} ${canAfford ? 'can-afford' : ''}`;
    card.innerHTML = `
      <div class="business-top-row">
        <div class="business-icon-box">${b.icon}</div>
        <div class="business-main-info">
          <div class="business-title-row">
            <span class="business-name">${b.name}</span>
            <span class="business-count-badge">${b.count > 0 ? `Lvl ${b.count}` : 'Не куплен'}</span>
          </div>
          <div class="business-desc">${b.desc}</div>
          <div class="business-income-stat">
            <span>⚡ Доход:</span>
            <span class="business-income-num">+${formatNumber(totalIncome)}</span>
            <span class="currency-text">${getCurrencySymbol()}</span>
            <span>/ сек</span>
            <span style="color: var(--text-dim); margin-left: 4px;">(+${formatNumber(b.baseIncome)} за шт.)</span>
          </div>
        </div>
      </div>
      <div class="business-bottom-row">
        <button class="btn-buy-business" data-biz-id="${b.id}" ${canAfford ? '' : 'disabled'}>
          <span>${b.count === 0 ? 'Купить бизнес' : 'Улучшить бизнес'}</span>
          <span class="btn-buy-cost">${formatNumber(cost)} <span class="currency-text">${getCurrencySymbol()}</span></span>
        </button>
      </div>
    `;

    // Слушатель покупки бизнеса
    const buyBtn = card.querySelector('.btn-buy-business');
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      buyBusiness(b.id);
    });

    businessesList.appendChild(card);
  });

  // Бейдж на вкладке «Бизнес», если можно что-то купить
  if (canAffordAny > 0) {
    businessBadge.style.display = 'block';
    businessBadge.textContent = canAffordAny;
  } else {
    businessBadge.style.display = 'none';
  }
}

/**
 * Быстрое обновление состояния кнопок покупки бизнеса без полной перерисовки DOM
 */
function updateBusinessAffordability() {
  let canAffordAny = 0;
  const cards = businessesList.querySelectorAll('.business-card');
  
  state.businesses.forEach((b, index) => {
    const cost = getBusinessCost(b);
    const canAfford = state.balance >= cost;
    if (canAfford) canAffordAny++;

    const card = cards[index];
    if (card) {
      if (canAfford) {
        card.classList.add('can-afford');
      } else {
        card.classList.remove('can-afford');
      }
      const buyBtn = card.querySelector('.btn-buy-business');
      if (buyBtn) {
        buyBtn.disabled = !canAfford;
      }
    }
  });

  if (canAffordAny > 0) {
    businessBadge.style.display = 'block';
    businessBadge.textContent = canAffordAny;
  } else {
    businessBadge.style.display = 'none';
  }
}

/**
 * Рендеринг сетки выбора валют
 */
function renderCurrencyGrid() {
  currencyGrid.innerHTML = '';
  Object.keys(CURRENCIES).forEach(code => {
    const curr = CURRENCIES[code];
    const btn = document.createElement('button');
    btn.className = `currency-btn ${state.currency === code ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="c-symbol">${curr.symbol}</span>
      <span class="c-name">${curr.code}</span>
    `;
    btn.addEventListener('click', () => {
      selectCurrency(code);
    });
    currencyGrid.appendChild(btn);
  });
}

/**
 * Обновление отображения настроек громкости
 */
function updateVolumeUI() {
  volumeSlider.value = state.volume;
  volumePercentDisplay.textContent = `${state.volume}%`;

  if (state.volume === 0) {
    soundIconDisplay.textContent = '🔇';
    muteBtnIcon.textContent = '🔊';
    muteBtnLabel.textContent = 'Включить звук';
  } else if (state.volume < 30) {
    soundIconDisplay.textContent = '🔈';
    muteBtnIcon.textContent = '🔇';
    muteBtnLabel.textContent = 'Выключить звук';
  } else if (state.volume < 70) {
    soundIconDisplay.textContent = '🔉';
    muteBtnIcon.textContent = '🔇';
    muteBtnLabel.textContent = 'Выключить звук';
  } else {
    soundIconDisplay.textContent = '🔊';
    muteBtnIcon.textContent = '🔇';
    muteBtnLabel.textContent = 'Выключить звук';
  }
}

/**
 * Обновление экрана статистики
 */
function updateStatsUI() {
  const sym = getCurrencySymbol();
  statTotalEarned.textContent = `${formatNumber(state.stats.totalEarned)} ${sym}`;
  statTotalTaps.textContent = formatNumber(state.stats.totalTaps);
  
  const totalBusinesses = state.businesses.reduce((acc, b) => acc + b.count, 0);
  statBusinessesOwned.textContent = formatNumber(totalBusinesses);

  const minutes = Math.floor(state.stats.playTimeSeconds / 60);
  statTimePlayed.textContent = `${minutes} мин`;
}

// ==========================================
// ИГРОВЫЕ ДЕЙСТВИЯ (ACTIONS)
// ==========================================

/**
 * Клик/тап по купюре
 */
function handleTap(clientX, clientY) {
  const power = getTapPower();
  state.balance += power;
  state.stats.totalEarned += power;
  state.stats.totalTaps += 1;

  // Звук и вибрация
  soundManager.playTap();
  triggerHaptic('light');

  // Анимация баланса
  balanceDisplay.classList.add('pulse-up');
  setTimeout(() => balanceDisplay.classList.remove('pulse-up'), 80);

  // Вылетающие цифры в месте клика
  createFloatingNumber(clientX, clientY, `+${formatNumber(power)} ${getCurrencySymbol()}`);

  // Обновление UI
  updateHeader();
  updateTapUpgradeCard();
  updateBusinessAffordability();
}

/**
 * Создание вылетающего текста с числом
 */
function createFloatingNumber(x, y, text) {
  if (!particlesContainer) return;

  const rect = particlesContainer.getBoundingClientRect();
  const posX = (x || (rect.left + rect.width / 2)) - rect.left;
  const posY = (y || (rect.top + rect.height / 2)) - rect.top;

  const el = document.createElement('div');
  el.className = 'floating-number';
  el.textContent = text;
  
  // Легкий разброс для естественности
  const offsetX = (Math.random() - 0.5) * 30;
  el.style.left = `${posX + offsetX}px`;
  el.style.top = `${posY}px`;

  particlesContainer.appendChild(el);

  setTimeout(() => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 850);
}

/**
 * Прокачка силы тапа
 */
function upgradeTap() {
  const cost = getTapUpgradeCost(state.tapLevel);
  if (state.balance < cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= cost;
  state.tapLevel += 1;

  soundManager.playUpgrade();
  triggerHaptic('success');

  updateHeader();
  updateTapUpgradeCard();
  updateBusinessAffordability();
  saveGameState();
}

/**
 * Покупка / прокачка бизнеса
 */
function buyBusiness(businessId) {
  const business = state.businesses.find(b => b.id === businessId);
  if (!business) return;

  const cost = getBusinessCost(business);
  if (state.balance < cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= cost;
  business.count += 1;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderBusinesses();
  updateTapUpgradeCard();
  updateStatsUI();
  saveGameState();
}

/**
 * Смена отображаемой валюты
 */
function selectCurrency(code) {
  if (!CURRENCIES[code]) return;
  state.currency = code;

  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  updateTapUpgradeCard();
  renderBusinesses();
  updateStatsUI();

  soundManager.playTap();
  triggerHaptic('light');
  saveGameState();
}

// ==========================================
// НАВИГАЦИЯ МЕЖДУ ВКЛАДКАМИ
// ==========================================

const screens = {
  screenWallet: document.getElementById('screenWallet'),
  screenBusiness: document.getElementById('screenBusiness'),
  screenSettings: document.getElementById('screenSettings')
};

const navTabs = {
  screenWallet: document.getElementById('navTabWallet'),
  screenBusiness: document.getElementById('navTabBusiness'),
  screenSettings: document.getElementById('navTabSettings')
};

function switchScreen(targetScreenId) {
  // Переключение экранов
  Object.keys(screens).forEach(id => {
    if (id === targetScreenId) {
      screens[id].classList.add('active');
    } else {
      screens[id].classList.remove('active');
    }
  });

  // Переключение активного состояния табов
  Object.keys(navTabs).forEach(id => {
    if (id === targetScreenId) {
      navTabs[id].classList.add('active');
    } else {
      navTabs[id].classList.remove('active');
    }
  });

  // При открытии настроек обновляем статистику
  if (targetScreenId === 'screenSettings') {
    updateStatsUI();
  }
  // При открытии бизнеса перерисовываем карточки
  if (targetScreenId === 'screenBusiness') {
    renderBusinesses();
  }

  soundManager.playTap();
  triggerHaptic('light');
}

// Навешивание слушателей на табы
document.querySelectorAll('.nav-tab, .nav-tab-center').forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.getAttribute('data-screen');
    if (screenId) {
      switchScreen(screenId);
    }
  });
});

// ==========================================
// ИГРОВОЙ ЦИКЛ (TICK LOOP 60 FPS)
// ==========================================

let lastTickTime = performance.now();
let secondAccumulator = 0;

function gameLoop(currentTime) {
  const delta = (currentTime - lastTickTime) / 1000;
  lastTickTime = currentTime;

  const passivePerSec = getTotalPassiveIncome();
  if (passivePerSec > 0 && delta > 0) {
    const earned = passivePerSec * delta;
    state.balance += earned;
    state.stats.totalEarned += earned;

    updateHeader();
    updateTapUpgradeCard();
    updateBusinessAffordability();
  }

  // Обновление таймера времени игры раз в секунду
  secondAccumulator += delta;
  if (secondAccumulator >= 1) {
    state.stats.playTimeSeconds += Math.floor(secondAccumulator);
    secondAccumulator = 0;
  }

  requestAnimationFrame(gameLoop);
}

// ==========================================
// СОХРАНЕНИЕ И ЗАГРУЗКА (LOCALSTORAGE)
// ==========================================

function saveGameState() {
  try {
    state.lastSaved = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Мигание индикатора
    if (saveIndicator) {
      saveIndicator.classList.add('saving');
      setTimeout(() => saveIndicator.classList.remove('saving'), 400);
    }
  } catch (e) {
    console.error('Save failed', e);
  }
}

function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);
    if (saved) {
      state.balance = typeof saved.balance === 'number' ? saved.balance : 0;
      state.tapLevel = typeof saved.tapLevel === 'number' ? saved.tapLevel : 1;
      state.currency = saved.currency && CURRENCIES[saved.currency] ? saved.currency : 'RUB';
      state.volume = typeof saved.volume === 'number' ? saved.volume : 80;
      state.vibration = typeof saved.vibration === 'boolean' ? saved.vibration : true;
      
      if (saved.stats) {
        state.stats.totalEarned = saved.stats.totalEarned || 0;
        state.stats.totalTaps = saved.stats.totalTaps || 0;
        state.stats.playTimeSeconds = saved.stats.playTimeSeconds || 0;
      }

      // Мерджим бизнесы
      if (Array.isArray(saved.businesses)) {
        state.businesses.forEach(defaultBiz => {
          const found = saved.businesses.find(b => b.id === defaultBiz.id);
          if (found && typeof found.count === 'number') {
            defaultBiz.count = found.count;
          }
        });
      }

      // Расчет офлайн-дохода
      if (saved.lastSaved) {
        const offlineSeconds = (Date.now() - saved.lastSaved) / 1000;
        // Ограничиваем офлайн доход 8 часами (28800 сек), и только если прошло больше 15 секунд
        if (offlineSeconds > 15) {
          const validSeconds = Math.min(offlineSeconds, 28800);
          const passivePerSec = getTotalPassiveIncome();
          const offlineEarned = Math.floor(passivePerSec * validSeconds);

          if (offlineEarned > 0) {
            state.balance += offlineEarned;
            state.stats.totalEarned += offlineEarned;
            showOfflineModal(offlineEarned);
          }
        }
      }
    }
  } catch (e) {
    console.error('Load failed', e);
  }
}

function showOfflineModal(amount) {
  offlineRewardValue.textContent = `+${formatNumber(amount)}`;
  offlineModal.classList.add('active');
}

btnCollectOffline.addEventListener('click', () => {
  offlineModal.classList.remove('active');
  soundManager.playUpgrade();
  triggerHaptic('success');
  updateHeader();
  updateTapUpgradeCard();
});

// ==========================================
// НАСТРОЙКИ: ГРОМКОСТЬ, ЗВУК, ВИБРАЦИЯ, СБРОС
// ==========================================

// Слайдер громкости
volumeSlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value, 10);
  state.volume = val;
  if (val > 0) previousVolume = val;
  soundManager.setVolume(val);
  updateVolumeUI();
});

volumeSlider.addEventListener('change', () => {
  soundManager.playTap();
  saveGameState();
});

// Быстрая кнопка Mute / Unmute
btnToggleMute.addEventListener('click', () => {
  if (state.volume > 0) {
    previousVolume = state.volume;
    state.volume = 0;
  } else {
    state.volume = previousVolume > 0 ? previousVolume : 80;
  }
  soundManager.setVolume(state.volume);
  updateVolumeUI();
  soundManager.playTap();
  saveGameState();
});

// Тест звука
btnTestSound.addEventListener('click', () => {
  soundManager.playUpgrade();
  triggerHaptic('light');
});

// Переключатель вибрации
vibrationToggle.addEventListener('change', (e) => {
  state.vibration = e.target.checked;
  if (state.vibration) {
    triggerHaptic('medium');
  }
  saveGameState();
});

// Сброс прогресса
btnResetProgress.addEventListener('click', () => {
  resetModal.classList.add('active');
});

btnCancelReset.addEventListener('click', () => {
  resetModal.classList.remove('active');
});

btnConfirmReset.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  resetModal.classList.remove('active');

  // Сброс состояния к начальному
  state.balance = 0;
  state.tapLevel = 1;
  state.currency = 'RUB';
  state.volume = 80;
  state.vibration = true;
  state.businesses = JSON.parse(JSON.stringify(DEFAULT_BUSINESSES));
  state.stats = { totalEarned: 0, totalTaps: 0, playTimeSeconds: 0 };

  soundManager.setVolume(state.volume);
  vibrationToggle.checked = true;

  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  updateTapUpgradeCard();
  renderBusinesses();
  updateStatsUI();
  switchScreen('screenWallet');

  soundManager.playUpgrade();
});

// ==========================================
// СЛУШАТЕЛИ ТАПА И УЛУЧШЕНИЙ
// ==========================================

// Тап по купюре (поддержка touch и mouse)
tapTarget.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleTap(e.clientX, e.clientY);
});

// Улучшение тапа
btnUpgradeTap.addEventListener('click', () => {
  upgradeTap();
});

// Периодическое автосохранение раз в 3 секунды
setInterval(saveGameState, 3000);
window.addEventListener('beforeunload', saveGameState);

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ИГРЫ
// ==========================================

function initGame() {
  loadGameState();
  
  // Первоначальный рендеринг
  vibrationToggle.checked = state.vibration;
  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  updateTapUpgradeCard();
  renderBusinesses();

  // Запуск аудиоконтекста по первому взаимодействию пользователя
  const unlockAudio = () => {
    soundManager.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // Запуск игрового цикла
  lastTickTime = performance.now();
  requestAnimationFrame(gameLoop);
}

// Старт после загрузки документа
document.addEventListener('DOMContentLoaded', initGame);
