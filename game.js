/**
 * ДЕНЕЖНЫЙ МАГНАТ — ИГРОВАЯ ЛОГИКА (ВЕРСИЯ 2.0)
 * Включает: 8 бизнесов, Недвижимость и Авто, Лидерборд Forbes, Перерождение (до 10x)
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

// 8 бизнесов (от 7 500 до 600 млн руб)
const DEFAULT_BUSINESSES = [
  {
    id: 'coffee',
    name: 'Кофейня to-go',
    icon: '☕',
    desc: 'Ароматный кофе и свежая выпечка для спешащих горожан.',
    baseCost: 7500, // Младший бизнес 5 000 - 10 000
    baseIncome: 25,
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
  },
  {
    id: 'hotel_chain',
    name: 'Сеть отелей 5★',
    icon: '🏨',
    desc: 'Роскошные курортные отели с казино и вертолетными площадками.',
    baseCost: 25000000,
    baseIncome: 160000,
    count: 0
  },
  {
    id: 'oil_company',
    name: 'Нефтяная корпорация',
    icon: '🛢️',
    desc: 'Добыча, переработка черного золота и международный экспорт.',
    baseCost: 150000000,
    baseIncome: 1100000,
    count: 0
  },
  {
    id: 'space_corp',
    name: 'Аэрокосмическая фирма',
    icon: '🚀',
    desc: 'Орбитальные полеты, добыча ресурсов на астероидах и спутники.',
    baseCost: 600000000,
    baseIncome: 5000000,
    count: 0
  }
];

// Каталог элитного имущества (автомобили и недвижимость)
const DEFAULT_REAL_ESTATE = [
  {
    id: 'sedan',
    category: 'Автомобиль',
    name: 'Бизнес-седан V6',
    icon: '🚗',
    desc: 'Комфортный немецкий седан для деловых поездок по городу.',
    cost: 500000,
    owned: false
  },
  {
    id: 'sportscar',
    category: 'Автомобиль',
    name: 'Спорткупе GT',
    icon: '🏎️',
    desc: 'Итальянский суперкар с рычащим двигателем и разгоном до сотни за 2.9 сек.',
    cost: 3500000,
    owned: false
  },
  {
    id: 'hypercar',
    category: 'Автомобиль',
    name: 'Cyber-гиперкар 1500 л.с.',
    icon: '⚡',
    desc: 'Эксклюзивный электрический болид из титана и карбона.',
    cost: 25000000,
    owned: false
  },
  {
    id: 'penthouse',
    category: 'Недвижимость',
    name: 'Пентхаус в небоскребе',
    icon: '🏢',
    desc: 'Двухуровневые апартаменты на 85-м этаже с панорамным видом на всю столицу.',
    cost: 75000000,
    owned: false
  },
  {
    id: 'mansion',
    category: 'Недвижимость',
    name: 'Загородная резиденция',
    icon: '🏡',
    desc: 'Особняк в закрытом поселке с парком, озером и охраной.',
    cost: 200000000,
    owned: false
  },
  {
    id: 'superyacht',
    category: 'Роскошь',
    name: '80м Суперяхта с вертолетом',
    icon: '🛥️',
    desc: 'Личный круизный лайнер с бассейнами, кинотеатром и вертолетной площадкой.',
    cost: 450000000,
    owned: false
  },
  {
    id: 'island',
    category: 'Недвижимость',
    name: 'Личный тропический остров',
    icon: '🏝️',
    desc: 'Собственный райский уголок в Тихом океане с автономным энергоснабжением.',
    cost: 800000000,
    owned: false
  }
];

// Конфигурация мега-бизнеса: Авиакомпания
// Супер дорогой бизнес с кастомным названием и флотом самолетов с почасовым доходом
const DEFAULT_AIRLINE = {
  founded: false,
  name: 'SkyWings Airlines',
  baseCost: 2000000000, // 2 млрд рублей
  flightElapsed: 0,     // секунды текущего 1-часового рейса (0..3600)
  uncollectedRevenue: 0,
  totalFlights: 0,
  planes: [
    {
      id: 'falcon',
      name: 'Бизнес-джет Falcon Elite',
      icon: '🛩️',
      category: 'Бизнес-авиация',
      desc: 'Скоростной реактивный джет для VIP-персон и экспресс-рейсов.',
      cost: 150000000,          // 150 млн
      incomePerHour: 40000000,  // +40 млн / час
      count: 0
    },
    {
      id: 'skyjet',
      name: 'Региональный лайнер SkyJet-200',
      icon: '✈️',
      category: 'Региональные рейсы',
      desc: 'Надежный пассажирский самолет для ближнемагистральных перелетов.',
      cost: 650000000,          // 650 млн
      incomePerHour: 190000000, // +190 млн / час
      count: 0
    },
    {
      id: 'aerostream',
      name: 'Магистральный AeroStream-350',
      icon: '🛫',
      category: 'Международные рейсы',
      desc: 'Широкофюзеляжный межконтинентальный флагман с премиум-каютами.',
      cost: 2800000000,         // 2.8 млрд
      incomePerHour: 900000000, // +900 млн / час
      count: 0
    },
    {
      id: 'titan',
      name: 'Двухпалубный Titan-800',
      icon: '🌐',
      category: 'Трансокеанский гигант',
      desc: 'Крупнейший пассажирский аэробус на 850 пассажиров с залами отдыха.',
      cost: 12000000000,         // 12 млрд
      incomePerHour: 4200000000, // +4.2 млрд / час
      count: 0
    },
    {
      id: 'supersonic',
      name: 'Сверхзвуковой Mach-3 VIP',
      icon: '⚡',
      category: 'Сверхзвуковой люкс',
      desc: 'Полеты из Лондона в Нью-Йорк за 2.5 часа. Высшая точка авиационной роскоши.',
      cost: 45000000000,          // 45 млрд
      incomePerHour: 18000000000, // +18 млрд / час
      count: 0
    }
  ]
};

// Вымышленный лидерборд богатейших людей (Forbes)
// Первое место ровно 1 000 000 000 рублей по требованию ТЗ!
const LEADERBOARD_BOTS = [
  { id: 'b1', name: 'Александр Громов', company: 'Global Energy Corp', worth: 1000000000, avatar: '👑' },
  { id: 'b2', name: 'Виктория Ротшильд', company: 'Rothschild Financial', worth: 750000000, avatar: '💎' },
  { id: 'b3', name: 'Герман фон Бауэр', company: 'Bauer Heavy Industries', worth: 520000000, avatar: '🏭' },
  { id: 'b4', name: 'Маркус Вэйлор', company: 'Quantum AI Systems', worth: 340000000, avatar: '🤖' },
  { id: 'b5', name: 'Елена Морозова', company: 'Morozov Retail Group', worth: 210000000, avatar: '🏬' },
  { id: 'b6', name: 'Дэвид Чэнь', company: 'Dragon Oceanic Logistics', worth: 130000000, avatar: '🚢' },
  { id: 'b7', name: 'Роман Заславский', company: 'Zaslavsky Gold Mines', worth: 80000000, avatar: '⛏️' },
  { id: 'b8', name: 'София Бельмонте', company: 'Haute Couture Group', worth: 45000000, avatar: '✨' },
  { id: 'b9', name: 'Артем Смирнов', company: 'PharmLife Biotech', worth: 20000000, avatar: '🧪' },
  { id: 'b10', name: 'Кристиан Вульф', company: 'Wolf Express Delivery', worth: 10000000, avatar: '📦' }
];

// Требования капитала для каждого из 10 перерождений
const REBIRTH_REQUIREMENTS = [
  15000000,   // 1: 15 млн
  40000000,   // 2: 40 млн
  100000000,  // 3: 100 млн
  200000000,  // 4: 200 млн
  350000000,  // 5: 350 млн
  550000000,  // 6: 550 млн
  800000000,  // 7: 800 млн
  1100000000, // 8: 1.1 млрд
  1500000000, // 9: 1.5 млрд
  2000000000  // 10: 2.0 млрд
];

const RANKS = [
  { threshold: 0, title: 'Новичок', icon: '🌱' },
  { threshold: 2500, title: 'Энтузиаст', icon: '💵' },
  { threshold: 25000, title: 'Предприниматель', icon: '💼' },
  { threshold: 150000, title: 'Бизнесмен', icon: '👔' },
  { threshold: 1000000, title: 'Миллионер', icon: '💎' },
  { threshold: 15000000, title: 'Мультимиллионер', icon: '🚀' },
  { threshold: 100000000, title: 'Олигарх', icon: '🏛️' },
  { threshold: 1000000000, title: 'Финансовый магнат', icon: '👑' }
];

const STORAGE_KEY = 'money_tapper_save_v2';

// ==========================================
// СОСТОЯНИЕ ИГРЫ (STATE)
// ==========================================

let state = {
  balance: 0,
  tapLevel: 1,
  rebirthCount: 0, // от 0 до 10 (максимум)
  currency: 'RUB',
  volume: 80,
  vibration: true,
  businesses: JSON.parse(JSON.stringify(DEFAULT_BUSINESSES)),
  realEstate: JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE)),
  airline: JSON.parse(JSON.stringify(DEFAULT_AIRLINE)),
  stats: {
    totalEarned: 0,
    totalTaps: 0,
    playTimeSeconds: 0
  },
  lastSaved: Date.now()
};

let previousVolume = 80;

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
    } catch (e) {}
  }

  playUpgrade() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
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
    } catch (e) {}
  }

  playBusinessBuy() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, this.ctx.currentTime);
      osc1.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(2637.02, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);
      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playRebirthPortal() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Эпичный космический восходящий арпеджио-аккорд
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch (e) {}
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
    } catch (e) {}
  }
}

const soundManager = new SoundManager();

// ==========================================
// ФОРМУЛЫ И РАСЧЕТЫ
// ==========================================

/**
 * Расчет глобального множителя перерождения
 * Максимум 10 перерождений и максимум 10x!
 * Rebirth 0 -> 1.0x
 * Rebirth 1 -> 1.9x
 * ...
 * Rebirth 10 -> 10.0x
 */
function getRebirthMultiplier(count = state.rebirthCount) {
  if (count <= 0) return 1.0;
  if (count >= 10) return 10.0;
  return Number((1.0 + count * 0.9).toFixed(1));
}

// ==========================================
// КОНФИГУРАЦИЯ ТЕМ ОФОРМЛЕНИЯ КЛИКА (1..100)
// ==========================================
const CLICK_THEMES = [
  { minLvl: 1,  maxLvl: 9,   tier: 'Ранг 1', name: 'Изумрудный Новичок', icon: '🌱', hue: 155, desc: 'Начальная энергия финансового роста. Чистый изумрудный поток.' },
  { minLvl: 10, maxLvl: 19,  tier: 'Ранг 2', name: 'Неоновый Киберпанк', icon: '⚡', hue: 190, desc: 'Высокотехнологичный неоновый заряд для скоростных тапов.' },
  { minLvl: 20, maxLvl: 29,  tier: 'Ранг 3', name: 'Золотой Синдикат',   icon: '👑', hue: 45,  desc: 'Истинный блеск чистого золота и премиального влияния.' },
  { minLvl: 30, maxLvl: 39,  tier: 'Ранг 4', name: 'Рубиновый Шторм',    icon: '🔥', hue: 350, desc: 'Пылкая мощь рубинового пламени, сжигающего любые преграды.' },
  { minLvl: 40, maxLvl: 49,  tier: 'Ранг 5', name: 'Аметистовый Мистик',  icon: '🔮', hue: 275, desc: 'Магическая фиолетовая аура тайных мировых инвестиций.' },
  { minLvl: 50, maxLvl: 59,  tier: 'Ранг 6', name: 'Ледяной Сапфир',     icon: '❄️', hue: 215, desc: 'Холодный расчет и несокрушимая кристальная мощь сапфира.' },
  { minLvl: 60, maxLvl: 69,  tier: 'Ранг 7', name: 'Солнечный Феникс',   icon: '☀️', hue: 25,  desc: 'Ослепительная солнечная вспышка возрождающегося капитала.' },
  { minLvl: 70, maxLvl: 79,  tier: 'Ранг 8', name: 'Платиновый Титан',   icon: '⚙️', hue: 230, desc: 'Сверхпрочный титановый сплав для непоколебимых магнатов.' },
  { minLvl: 80, maxLvl: 89,  tier: 'Ранг 9', name: 'Квантовый Космос',   icon: '🌌', hue: 290, desc: 'Энергия далеких галактик и квантовая сингулярность богатства.' },
  { minLvl: 90, maxLvl: 100, tier: 'Ранг 10', name: 'Божественный Абсолют', icon: '✨', hue: 50, desc: 'Высшая точка вселенского изобилия. Абсолютный триумф!' }
];

function getThemeForLevel(level = state.tapLevel) {
  const clamped = Math.max(1, Math.min(100, level));
  const found = CLICK_THEMES.find(t => clamped >= t.minLvl && clamped <= t.maxLvl);
  return found || CLICK_THEMES[0];
}

/**
 * Применение динамического оформления игры на каждом уровне
 */
function applyTheme(level = state.tapLevel) {
  const currentLevel = Math.max(1, Math.min(100, level));
  const theme = getThemeForLevel(currentLevel);
  const dynamicHue = Math.round((theme.hue + (currentLevel - theme.minLvl) * 4) % 360);

  const root = document.documentElement;
  root.style.setProperty('--theme-hue', `${dynamicHue}deg`);
  root.style.setProperty('--theme-primary', `hsl(${dynamicHue}, 88%, 52%)`);
  root.style.setProperty('--theme-glow', `hsla(${dynamicHue}, 90%, 52%, 0.35)`);
  root.style.setProperty('--theme-glow-strong', `hsla(${dynamicHue}, 100%, 60%, 0.6)`);
  root.style.setProperty('--theme-gradient', `linear-gradient(135deg, hsl(${dynamicHue}, 85%, 46%) 0%, hsl(${(dynamicHue + 40) % 360}, 90%, 56%) 100%)`);

  // Обновление карточки темы на экране Кошелька
  const coreCenterIcon = document.getElementById('coreCenterIcon');
  const walletThemeBadge = document.getElementById('walletThemeBadge');
  const walletPowerVal = document.getElementById('walletPowerVal');

  if (coreCenterIcon) coreCenterIcon.textContent = theme.icon;
  if (walletThemeBadge) walletThemeBadge.textContent = `Стиль: ${theme.name} (ур. ${currentLevel})`;
  if (walletPowerVal) walletPowerVal.textContent = `+${formatNumber(getTapPower(currentLevel))}`;
}

/**
 * Сила тапа: от +1 до +100 с множителем перерождения (до 10x!)
 */
function getTapPower(level = state.tapLevel) {
  const base = Math.max(1, Math.min(100, level));
  const mult = getRebirthMultiplier();
  return Math.max(1, Math.round(base * mult));
}

function getBaseTapPower(level = state.tapLevel) {
  return Math.max(1, Math.min(100, level));
}

/**
 * Стоимость прокачки клика:
 * Уровень 1 -> 2: ровно 1 000 000 (1 миллион рублей по ТЗ!)
 * Уровни 2..99: прогрессивный рост до 100 уровня
 * Уровень 100: МАКСИМУМ (Infinity)
 */
function getTapUpgradeCost(level = state.tapLevel) {
  if (level >= 100) return Infinity;
  if (level === 1) return 1000000;
  return Math.floor(1000000 * Math.pow(level, 1.75));
}

function getBusinessCost(business) {
  return Math.floor(business.baseCost * Math.pow(1.15, business.count));
}

/**
 * Суммарный пассивный доход в секунду (базовый доход всех бизнесов * множитель перерождения)
 */
function getTotalPassiveIncome() {
  const base = state.businesses.reduce((sum, b) => sum + (b.count * b.baseIncome), 0);
  const mult = getRebirthMultiplier();
  return Math.round(base * mult);
}

/**
 * Расчет чистого капитала (Net Worth):
 * Наличный баланс + стоимость купленной недвижимости + суммарная стоимость купленных бизнесов
 */
function calculateNetWorth() {
  let total = state.balance;
  
  // Недвижимость
  state.realEstate.forEach(item => {
    if (item.owned) {
      total += item.cost;
    }
  });

  // Бизнесы
  state.businesses.forEach(b => {
    if (b.count > 0) {
      let invested = 0;
      for (let i = 0; i < b.count; i++) {
        invested += Math.floor(b.baseCost * Math.pow(1.15, i));
      }
      total += invested;
    }
  });

  // Авиакомпания и флот
  if (state.airline && state.airline.founded) {
    total += state.airline.baseCost;
    state.airline.planes.forEach(p => {
      let pInvested = 0;
      for (let i = 0; i < p.count; i++) {
        pInvested += Math.floor(p.cost * Math.pow(1.15, i));
      }
      total += pInvested;
    });
  }

  return Math.floor(total);
}

/**
 * Расчет стоимости покупки самолета (с ростом 15% за единицу)
 */
function getPlaneCost(plane) {
  return Math.floor(plane.cost * Math.pow(1.15, plane.count));
}

/**
 * Расчет суммарного почасового дохода авиакомпании (с учетом множителя перерождения)
 */
function getAirlineHourlyIncome() {
  if (!state.airline || !state.airline.founded) return 0;
  const base = state.airline.planes.reduce((sum, p) => sum + (p.count * p.incomePerHour), 0);
  const mult = getRebirthMultiplier();
  return Math.round(base * mult);
}

/**
 * Всего бортов в авиапарке
 */
function getTotalPlanesCount() {
  if (!state.airline || !state.airline.planes) return 0;
  return state.airline.planes.reduce((sum, p) => sum + p.count, 0);
}

/**
 * Требование капитала для следующего перерождения
 */
function getNextRebirthRequirement() {
  if (state.rebirthCount >= 10) return Infinity;
  return REBIRTH_REQUIREMENTS[state.rebirthCount];
}

function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  const rounded = Math.floor(num);
  return rounded.toLocaleString('ru-RU');
}

function getCurrencySymbol() {
  return CURRENCIES[state.currency]?.symbol || '₽';
}

function triggerHaptic(type = 'light') {
  if (!state.vibration || !('vibrate' in navigator)) return;
  try {
    if (type === 'light') navigator.vibrate(12);
    else if (type === 'medium') navigator.vibrate(25);
    else if (type === 'success') navigator.vibrate([20, 40, 30]);
    else if (type === 'error') navigator.vibrate([40, 30, 40]);
  } catch (e) {}
}

// ==========================================
// ИНТЕРФЕЙС И DOM
// ==========================================

// Шапка
const balanceDisplay = document.getElementById('balanceDisplay');
const tapIncomeDisplay = document.getElementById('tapIncomeDisplay');
const passiveIncomeDisplay = document.getElementById('passiveIncomeDisplay');
const rankName = document.getElementById('rankName');
const rankIcon = document.getElementById('rankIcon');
const headerMultiplierVal = document.getElementById('headerMultiplierVal');
const billCenterSymbol = document.getElementById('billCenterSymbol');
const tapTarget = document.getElementById('tapTarget');
const particlesContainer = document.getElementById('particlesContainer');

// Элементы экрана Кошелька и тапалки по фону
const walletTapArea = document.getElementById('walletTapArea');
const ripplesContainer = document.getElementById('ripplesContainer');
const wealthCore = document.getElementById('wealthCore');
const coreCenterIcon = document.getElementById('coreCenterIcon');
const coreCenterSymbol = document.getElementById('coreCenterSymbol');
const walletThemeBadge = document.getElementById('walletThemeBadge');
const walletPowerVal = document.getElementById('walletPowerVal');
const btnGoEarnings = document.getElementById('btnGoEarnings');
const btnHeaderSettings = document.getElementById('btnHeaderSettings');

// Элементы экрана Заработок (прокачка клика +1..+100 и темы)
const earningsPowerBig = document.getElementById('earningsPowerBig');
const earningsLevelPill = document.getElementById('earningsLevelPill');
const effectiveTapPowerVal = document.getElementById('effectiveTapPowerVal');
const themePreviewIcon = document.getElementById('themePreviewIcon');
const themeTierTag = document.getElementById('themeTierTag');
const themeNameTitle = document.getElementById('themeNameTitle');
const themeDesc = document.getElementById('themeDesc');
const earningsProgressPercent = document.getElementById('earningsProgressPercent');
const earningsProgressBarFill = document.getElementById('earningsProgressBarFill');
const btnUpgradeClick = document.getElementById('btnUpgradeClick');
const upgradeActionLabel = document.getElementById('upgradeActionLabel');
const clickUpgradeCostText = document.getElementById('clickUpgradeCostText');
const upgradeSkinHint = document.getElementById('upgradeSkinHint');

// Бизнесы
const businessesList = document.getElementById('businessesList');
const businessBadge = document.getElementById('businessBadge');

// Авиакомпания и флот
const airlineMegacard = document.getElementById('airlineMegacard');
const hangarModal = document.getElementById('hangarModal');
const btnCloseHangar = document.getElementById('btnCloseHangar');
const hangarAirlineTitle = document.getElementById('hangarAirlineTitle');
const hangarTotalPlanes = document.getElementById('hangarTotalPlanes');
const hangarHourlyIncome = document.getElementById('hangarHourlyIncome');
const planesList = document.getElementById('planesList');
const airlineRenameModal = document.getElementById('airlineRenameModal');
const inputAirlineName = document.getElementById('inputAirlineName');
const btnCancelRenameAirline = document.getElementById('btnCancelRenameAirline');
const btnSaveAirlineName = document.getElementById('btnSaveAirlineName');

// Недвижимость & Лидерборд
const netWorthDisplay = document.getElementById('netWorthDisplay');
const netWorthRankChip = document.getElementById('netWorthRankChip');
const leaderboardRankText = document.getElementById('leaderboardRankText');
const realEstateList = document.getElementById('realEstateList');
const realEstateBadge = document.getElementById('realEstateBadge');
const leaderboardTable = document.getElementById('leaderboardTable');
const subtabCatalog = document.getElementById('subtabCatalog');
const subtabLeaderboard = document.getElementById('subtabLeaderboard');
const catalogSection = document.getElementById('catalogSection');
const leaderboardSection = document.getElementById('leaderboardSection');

// Перерождение
const rebirthStageBadge = document.getElementById('rebirthStageBadge');
const currentMultText = document.getElementById('currentMultText');
const nextMultText = document.getElementById('nextMultText');
const rebirthReqAmount = document.getElementById('rebirthReqAmount');
const rebirthProgressBar = document.getElementById('rebirthProgressBar');
const rebirthProgressPercent = document.getElementById('rebirthProgressPercent');
const btnDoRebirth = document.getElementById('btnDoRebirth');
const rebirthReadyBadge = document.getElementById('rebirthReadyBadge');
const rebirthModal = document.getElementById('rebirthModal');
const modalNewMultiplier = document.getElementById('modalNewMultiplier');
const btnCancelRebirth = document.getElementById('btnCancelRebirth');
const btnConfirmRebirth = document.getElementById('btnConfirmRebirth');

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
const statRealEstateOwned = document.getElementById('statRealEstateOwned');
const statRebirthsCount = document.getElementById('statRebirthsCount');
const statTimePlayed = document.getElementById('statTimePlayed');

// Сброс и офлайн
const btnResetProgress = document.getElementById('btnResetProgress');
const resetModal = document.getElementById('resetModal');
const btnCancelReset = document.getElementById('btnCancelReset');
const btnConfirmReset = document.getElementById('btnConfirmReset');
const offlineModal = document.getElementById('offlineModal');
const offlineRewardValue = document.getElementById('offlineRewardValue');
const btnCollectOffline = document.getElementById('btnCollectOffline');
const saveIndicator = document.getElementById('saveIndicator');

/**
 * Обновление надписей валют во всех элементах
 */
function updateCurrencySymbols() {
  const sym = getCurrencySymbol();
  document.querySelectorAll('.currency-text').forEach(el => {
    el.textContent = sym;
  });
  if (billCenterSymbol) {
    billCenterSymbol.textContent = sym;
  }
  if (coreCenterSymbol) {
    coreCenterSymbol.textContent = sym;
  }
}

/**
 * Обновление шапки
 */
function updateHeader() {
  balanceDisplay.textContent = formatNumber(state.balance);
  tapIncomeDisplay.textContent = `+${formatNumber(getTapPower())}`;
  passiveIncomeDisplay.textContent = `+${formatNumber(getTotalPassiveIncome())}`;
  headerMultiplierVal.textContent = `x${getRebirthMultiplier().toFixed(1)}`;

  const currentTotal = state.stats.totalEarned;
  let activeRank = RANKS[0];
  for (const r of RANKS) {
    if (currentTotal >= r.threshold) {
      activeRank = r;
    }
  }
  rankName.textContent = activeRank.title;
  if (rankIcon) rankIcon.textContent = activeRank.icon;
}

/**
 * Рендеринг экрана «Заработок» (прокачка клика от +1 до +100)
 */
function renderEarningsScreen() {
  const currentLevel = Math.max(1, Math.min(100, state.tapLevel));
  const theme = getThemeForLevel(currentLevel);
  const cost = getTapUpgradeCost(currentLevel);
  const effectivePower = getTapPower(currentLevel);

  if (earningsPowerBig) earningsPowerBig.textContent = `+${currentLevel}`;
  if (earningsLevelPill) earningsLevelPill.textContent = `Уровень ${currentLevel} из 100`;
  if (effectiveTapPowerVal) effectiveTapPowerVal.textContent = `+${formatNumber(effectivePower)}`;

  if (themePreviewIcon) themePreviewIcon.textContent = theme.icon;
  if (themeTierTag) themeTierTag.textContent = theme.tier;
  if (themeNameTitle) themeNameTitle.textContent = theme.name;
  if (themeDesc) themeDesc.textContent = theme.desc;

  const progressPct = currentLevel; // 1..100%
  if (earningsProgressPercent) earningsProgressPercent.textContent = `${progressPct}%`;
  if (earningsProgressBarFill) earningsProgressBarFill.style.width = `${progressPct}%`;

  if (walletPowerVal) walletPowerVal.textContent = `+${formatNumber(effectivePower)}`;
  if (walletThemeBadge) walletThemeBadge.textContent = `Стиль: ${theme.name}`;

  if (btnUpgradeClick) {
    if (currentLevel >= 100) {
      btnUpgradeClick.disabled = true;
      if (upgradeActionLabel) upgradeActionLabel.textContent = 'Максимальный клик (+100)';
      if (clickUpgradeCostText) clickUpgradeCostText.textContent = 'МАКСИМУМ';
      if (upgradeSkinHint) upgradeSkinHint.textContent = '✨ Достигнут абсолютный предел силы тапа и дизайна!';
    } else {
      const nextLevel = currentLevel + 1;
      const nextTheme = getThemeForLevel(nextLevel);
      const canAfford = state.balance >= cost;
      btnUpgradeClick.disabled = !canAfford;

      if (upgradeActionLabel) upgradeActionLabel.textContent = `Улучшить клик до +${nextLevel}`;
      if (clickUpgradeCostText) clickUpgradeCostText.textContent = formatNumber(cost);
      if (upgradeSkinHint) {
        if (nextTheme.name !== theme.name) {
          upgradeSkinHint.textContent = `🎨 Разблокирует стиль: ${nextTheme.name} (${nextTheme.icon})`;
        } else {
          upgradeSkinHint.textContent = `🎨 Усиливает свечение и цветовую гамму стиля`;
        }
      }
    }
  }
}

// Для совместимости
function updateTapUpgradeCard() {
  renderEarningsScreen();
}

/**
 * Рендеринг списка бизнесов
 */
function renderBusinesses() {
  businessesList.innerHTML = '';
  let canAffordAny = 0;
  const mult = getRebirthMultiplier();

  state.businesses.forEach(b => {
    const cost = getBusinessCost(b);
    const canAfford = state.balance >= cost;
    if (canAfford) canAffordAny++;

    const totalIncome = Math.round(b.count * b.baseIncome * mult);
    const singleIncome = Math.round(b.baseIncome * mult);

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
            <span style="color: var(--text-dim); margin-left: 4px;">(+${formatNumber(singleIncome)} за шт.)</span>
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

    const buyBtn = card.querySelector('.btn-buy-business');
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      buyBusiness(b.id);
    });

    businessesList.appendChild(card);
  });

  // Рендерим мега-бизнес: Авиакомпанию
  renderAirlineCard();

  if (canAffordAny > 0) {
    businessBadge.style.display = 'block';
    businessBadge.textContent = canAffordAny;
  } else {
    businessBadge.style.display = 'none';
  }
}

function updateBusinessAffordability() {
  let canAffordAny = 0;
  const cards = businessesList.querySelectorAll('.business-card');
  
  state.businesses.forEach((b, index) => {
    const cost = getBusinessCost(b);
    const canAfford = state.balance >= cost;
    if (canAfford) canAffordAny++;

    const card = cards[index];
    if (card) {
      if (canAfford) card.classList.add('can-afford');
      else card.classList.remove('can-afford');
      const buyBtn = card.querySelector('.btn-buy-business');
      if (buyBtn) buyBtn.disabled = !canAfford;
    }
  });

  // Проверка доступности покупки авиакомпании
  if (state.airline && !state.airline.founded) {
    const btnFound = airlineMegacard ? airlineMegacard.querySelector('#btnFoundAirline') : null;
    if (btnFound) {
      btnFound.disabled = state.balance < state.airline.baseCost;
    }
  }

  if (canAffordAny > 0) {
    businessBadge.style.display = 'block';
    businessBadge.textContent = canAffordAny;
  } else {
    businessBadge.style.display = 'none';
  }
}

// ==========================================
// ЛОГИКА МЕГА-БИЗНЕСА: АВИАКОМПАНИЯ
// ==========================================

/**
 * Рендеринг карточки Авиакомпании
 */
function renderAirlineCard() {
  if (!airlineMegacard) return;
  const sym = getCurrencySymbol();
  const airline = state.airline;

  if (!airline.founded) {
    const canAfford = state.balance >= airline.baseCost;
    airlineMegacard.innerHTML = `
      <div class="airline-unfounded-box">
        <div class="airline-badge-top">✈️ МЕГА-КОРПОРАЦИЯ</div>
        <div class="airline-unfounded-title">Основать свою Авиакомпанию</div>
        <div class="airline-unfounded-desc">
          Выйдите на международный рынок авиаперевозок! Придумайте своё название, закупайте современный флот и получайте колоссальную прибыль <b>каждый час</b> за совершенные рейсы.
        </div>
        <button class="btn-found-airline" id="btnFoundAirline" ${canAfford ? '' : 'disabled'}>
          <span>Основать компанию</span>
          <span class="btn-buy-cost">${formatNumber(airline.baseCost)} ${sym}</span>
        </button>
      </div>
    `;

    const btnFound = airlineMegacard.querySelector('#btnFoundAirline');
    if (btnFound) {
      btnFound.addEventListener('click', () => {
        foundAirline();
      });
    }
  } else {
    const hourlyIncome = getAirlineHourlyIncome();
    const totalPlanes = getTotalPlanesCount();
    const flightDuration = 3600;
    const elapsed = Math.min(flightDuration, airline.flightElapsed || 0);
    const progressPercent = Math.min(100, Math.floor((elapsed / flightDuration) * 100));
    const remainingSeconds = Math.max(0, flightDuration - Math.floor(elapsed));
    const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const secs = (remainingSeconds % 60).toString().padStart(2, '0');
    const canCollect = airline.uncollectedRevenue > 0;

    airlineMegacard.innerHTML = `
      <div class="airline-founded-box">
        <div class="airline-header-row">
          <div class="airline-title-group">
            <span style="font-size: 20px;">✈️</span>
            <span class="airline-custom-name" id="airlineDisplayName">${airline.name}</span>
            <button class="btn-rename-airline" id="btnOpenRenameModal" title="Изменить название">✏️</button>
          </div>
          <span class="airline-badge-top">АВИАЛИНИЯ</span>
        </div>

        <div class="airline-metrics-grid">
          <div class="airline-metric-card">
            <span class="airline-metric-label">Авиапарк</span>
            <span class="airline-metric-val">${totalPlanes} бортов</span>
          </div>
          <div class="airline-metric-card">
            <span class="airline-metric-label">Доход в час</span>
            <span class="airline-metric-val">+${formatNumber(hourlyIncome)} ${sym}</span>
          </div>
        </div>

        <!-- Трекер рейса -->
        <div class="flight-status-card">
          <div class="flight-route-info">
            <div class="route-airports">
              <span>🛫 SVO</span>
              <span style="color: var(--text-dim);">➔</span>
              <span>DXB 🛬</span>
            </div>
            <span style="color: var(--text-dim);">Рейс #${airline.totalFlights + 1}</span>
          </div>
          <div class="flight-track-bar">
            <div class="flight-track-fill" id="flightTrackFill" style="width: ${progressPercent}%;"></div>
            <div class="flight-airplane-icon" id="flightAirplaneIcon" style="left: ${progressPercent}%;">✈️</div>
          </div>
          <div class="flight-meta-row">
            <span>Статус: <b style="color: #c7d2fe;">В полете</b></span>
            <span class="flight-timer-text" id="flightTimerDisplay">${mins}:${secs}</span>
          </div>
        </div>

        <div class="airline-actions-row">
          <button class="btn-open-hangar" id="btnOpenHangarModal">
            <span>🛩️</span> Ангар флота
          </button>
          <button class="btn-collect-flight" id="btnCollectFlight" ${canCollect ? '' : 'disabled'}>
            <span>💰</span> ${canCollect ? `Забрать: +${formatNumber(airline.uncollectedRevenue)} ${sym}` : 'Касса рейсов'}
          </button>
        </div>
      </div>
    `;

    airlineMegacard.querySelector('#btnOpenRenameModal')?.addEventListener('click', openRenameModal);
    airlineMegacard.querySelector('#btnOpenHangarModal')?.addEventListener('click', openHangarModal);
    airlineMegacard.querySelector('#btnCollectFlight')?.addEventListener('click', collectFlightRevenue);
  }
}

function updateFlightUI() {
  if (!state.airline || !state.airline.founded) return;
  const fill = document.getElementById('flightTrackFill');
  const icon = document.getElementById('flightAirplaneIcon');
  const timer = document.getElementById('flightTimerDisplay');
  const btnCollect = document.getElementById('btnCollectFlight');

  const flightDuration = 3600;
  const elapsed = Math.min(flightDuration, state.airline.flightElapsed || 0);
  const progressPercent = Math.min(100, Math.floor((elapsed / flightDuration) * 100));
  const remainingSeconds = Math.max(0, flightDuration - Math.floor(elapsed));
  const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const secs = (remainingSeconds % 60).toString().padStart(2, '0');

  if (fill) fill.style.width = `${progressPercent}%`;
  if (icon) icon.style.left = `${progressPercent}%`;
  if (timer) timer.textContent = `${mins}:${secs}`;

  if (btnCollect) {
    const rev = state.airline.uncollectedRevenue || 0;
    if (rev > 0) {
      btnCollect.disabled = false;
      btnCollect.innerHTML = `<span>💰</span> Забрать: +${formatNumber(rev)} ${getCurrencySymbol()}`;
    } else {
      btnCollect.disabled = true;
      btnCollect.innerHTML = `<span>💰</span> Касса рейсов`;
    }
  }
}

function renderHangar() {
  if (!planesList) return;
  const sym = getCurrencySymbol();
  const mult = getRebirthMultiplier();
  const airline = state.airline;

  if (hangarAirlineTitle) hangarAirlineTitle.textContent = airline.name;
  if (hangarTotalPlanes) hangarTotalPlanes.textContent = getTotalPlanesCount();
  if (hangarHourlyIncome) hangarHourlyIncome.textContent = formatNumber(getAirlineHourlyIncome());

  planesList.innerHTML = '';

  airline.planes.forEach(plane => {
    const cost = getPlaneCost(plane);
    const canAfford = state.balance >= cost;
    const hourlyBonus = Math.round(plane.incomePerHour * mult);

    const card = document.createElement('div');
    card.className = `plane-card ${canAfford ? 'can-afford' : ''}`;
    card.innerHTML = `
      <div class="plane-card-top">
        <div class="plane-icon-box">${plane.icon}</div>
        <div class="plane-info">
          <div class="plane-title-row">
            <span class="plane-name">${plane.name}</span>
            <span class="plane-count-badge">${plane.count} шт.</span>
          </div>
          <div style="font-size: 10px; color: var(--color-cyan);">${plane.category}</div>
          <div class="plane-hourly-income">⚡ +${formatNumber(hourlyBonus)} ${sym} / час</div>
        </div>
      </div>
      <button class="btn-buy-plane" data-plane-id="${plane.id}" ${canAfford ? '' : 'disabled'}>
        <span>Купить самолет</span>
        <span class="btn-buy-cost">${formatNumber(cost)} ${sym}</span>
      </button>
    `;

    const buyBtn = card.querySelector('.btn-buy-plane');
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      buyPlane(plane.id);
    });

    planesList.appendChild(card);
  });
}

function foundAirline() {
  if (state.balance < state.airline.baseCost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= state.airline.baseCost;
  state.airline.founded = true;
  state.airline.flightElapsed = 0;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderBusinesses();
  renderAirlineCard();
  renderLeaderboard();
  updateStatsUI();
  saveGameState();

  openRenameModal();
}

function buyPlane(planeId) {
  const plane = state.airline.planes.find(p => p.id === planeId);
  if (!plane) return;

  const cost = getPlaneCost(plane);
  if (state.balance < cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= cost;
  plane.count += 1;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderHangar();
  renderAirlineCard();
  renderLeaderboard();
  updateStatsUI();
  saveGameState();
}

function collectFlightRevenue() {
  const rev = state.airline.uncollectedRevenue;
  if (rev <= 0) return;

  state.balance += rev;
  state.stats.totalEarned += rev;
  state.airline.uncollectedRevenue = 0;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderAirlineCard();
  updateBusinessAffordability();
  updateStatsUI();
  saveGameState();
}

function openHangarModal() {
  renderHangar();
  hangarModal.classList.add('active');
  soundManager.playTap();
}

function closeHangarModal() {
  hangarModal.classList.remove('active');
}

function openRenameModal() {
  inputAirlineName.value = state.airline.name;
  airlineRenameModal.classList.add('active');
  soundManager.playTap();
}

function closeRenameModal() {
  airlineRenameModal.classList.remove('active');
}

function saveAirlineName() {
  const val = inputAirlineName.value.trim();
  if (val.length > 0) {
    state.airline.name = val;
  }
  closeRenameModal();
  renderAirlineCard();
  soundManager.playTap();
  saveGameState();
}

/**
 * Рендеринг каталога недвижимости и авто
 */
function renderRealEstate() {
  realEstateList.innerHTML = '';
  let canAffordAny = 0;

  state.realEstate.forEach(item => {
    const canAfford = !item.owned && state.balance >= item.cost;
    if (canAfford) canAffordAny++;

    const card = document.createElement('div');
    card.className = `realestate-card ${item.owned ? 'owned' : ''}`;
    card.innerHTML = `
      <div class="realestate-icon">${item.icon}</div>
      <div class="realestate-info">
        <span class="realestate-tag">${item.category}</span>
        <div class="realestate-name">${item.name}</div>
        <div class="realestate-cost">${formatNumber(item.cost)} <span class="currency-text">${getCurrencySymbol()}</span></div>
      </div>
      <div>
        ${item.owned 
          ? `<div class="badge-estate-owned">Куплено ✓</div>`
          : `<button class="btn-buy-estate" data-estate-id="${item.id}" ${canAfford ? '' : 'disabled'}>Купить</button>`
        }
      </div>
    `;

    if (!item.owned) {
      const buyBtn = card.querySelector('.btn-buy-estate');
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        buyRealEstate(item.id);
      });
    }

    realEstateList.appendChild(card);
  });

  if (canAffordAny > 0) {
    realEstateBadge.style.display = 'block';
    realEstateBadge.textContent = canAffordAny;
  } else {
    realEstateBadge.style.display = 'none';
  }
}

/**
 * Рендеринг таблицы Forbes Лидерборда
 */
function renderLeaderboard() {
  const netWorth = calculateNetWorth();
  netWorthDisplay.textContent = formatNumber(netWorth);

  // Формируем список: 10 ботов + игрок
  const allList = LEADERBOARD_BOTS.map(b => ({ ...b, isPlayer: false }));
  
  const playerEntry = {
    id: 'player',
    name: 'ВЫ (Магнат)',
    company: 'Ваша финансовая империя',
    worth: netWorth,
    avatar: '😎',
    isPlayer: true
  };
  allList.push(playerEntry);

  // Сортируем по убыванию капитала
  allList.sort((a, b) => b.worth - a.worth);

  // Находим ранг игрока
  const playerRankIndex = allList.findIndex(x => x.isPlayer);
  const playerRank = playerRankIndex + 1;

  leaderboardRankText.textContent = `Место в Forbes: #${playerRank}`;
  if (playerRank === 1) {
    leaderboardRankText.textContent = '👑 Топ-1 Forbes: Вы богатейший человек мира!';
  }

  // Рендерим топ участников
  leaderboardTable.innerHTML = '';
  allList.forEach((entry, idx) => {
    const rank = idx + 1;
    let rankBadge = `#${rank}`;
    let rankClass = '';
    if (rank === 1) { rankBadge = '🥇'; rankClass = 'leader-rank-1'; }
    else if (rank === 2) { rankBadge = '🥈'; rankClass = 'leader-rank-2'; }
    else if (rank === 3) { rankBadge = '🥉'; rankClass = 'leader-rank-3'; }

    const row = document.createElement('div');
    row.className = `leader-row ${entry.isPlayer ? 'is-player' : ''}`;
    row.innerHTML = `
      <div class="leader-rank-badge ${rankClass}">${rankBadge}</div>
      <div class="leader-avatar">${entry.avatar}</div>
      <div class="leader-details">
        <div class="leader-name-row">
          <span class="leader-name">${entry.name}</span>
          ${entry.isPlayer ? '<span class="you-tag">ВЫ</span>' : ''}
        </div>
        <div class="leader-company">${entry.company}</div>
      </div>
      <div class="leader-worth">${formatNumber(entry.worth)} <span class="currency-text">${getCurrencySymbol()}</span></div>
    `;
    leaderboardTable.appendChild(row);
  });
}

/**
 * Обновление экрана Перерождения
 */
function updateRebirthUI() {
  const currentMult = getRebirthMultiplier();
  const nextCount = state.rebirthCount + 1;
  const nextMult = getRebirthMultiplier(nextCount);
  const netWorth = calculateNetWorth();
  const req = getNextRebirthRequirement();

  rebirthStageBadge.textContent = `Перерождение ${state.rebirthCount} / 10`;
  currentMultText.textContent = `${currentMult.toFixed(1)}x`;

  if (state.rebirthCount >= 10) {
    nextMultText.textContent = 'МАКС';
    rebirthReqAmount.textContent = 'Достигнут предел';
    rebirthProgressBar.style.width = '100%';
    rebirthProgressPercent.textContent = '100%';
    btnDoRebirth.disabled = true;
    btnDoRebirth.querySelector('.btn-rebirth-text').textContent = 'Максимальное перерождение (10x)';
    rebirthReadyBadge.style.display = 'none';
    return;
  }

  nextMultText.textContent = `${nextMult.toFixed(1)}x`;
  rebirthReqAmount.textContent = formatNumber(req);

  const percent = Math.min(100, Math.floor((netWorth / req) * 100));
  rebirthProgressBar.style.width = `${percent}%`;
  rebirthProgressPercent.textContent = `${percent}%`;

  const canRebirth = netWorth >= req;
  btnDoRebirth.disabled = !canRebirth;

  if (canRebirth) {
    btnDoRebirth.querySelector('.btn-rebirth-text').textContent = `Переродиться ➔ x${nextMult.toFixed(1)} бонус!`;
    rebirthReadyBadge.style.display = 'block';
  } else {
    btnDoRebirth.querySelector('.btn-rebirth-text').textContent = 'Недостаточно капитала';
    rebirthReadyBadge.style.display = 'none';
  }
}

/**
 * Обновление настроек звука
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
 * Обновление статистики
 */
function updateStatsUI() {
  const sym = getCurrencySymbol();
  statTotalEarned.textContent = `${formatNumber(state.stats.totalEarned)} ${sym}`;
  statTotalTaps.textContent = formatNumber(state.stats.totalTaps);
  
  const totalBusinesses = state.businesses.reduce((acc, b) => acc + b.count, 0);
  statBusinessesOwned.textContent = formatNumber(totalBusinesses);

  const totalRealEstate = state.realEstate.filter(x => x.owned).length;
  statRealEstateOwned.textContent = `${totalRealEstate} из ${state.realEstate.length}`;

  statRebirthsCount.textContent = `${state.rebirthCount} / 10 (бонус ${getRebirthMultiplier().toFixed(1)}x)`;

  const minutes = Math.floor(state.stats.playTimeSeconds / 60);
  statTimePlayed.textContent = `${minutes} мин`;
}

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

// ==========================================
// ИГРОВЫЕ ДЕЙСТВИЯ (ACTIONS)
// ==========================================

function handleTap(clientX, clientY) {
  const power = getTapPower();
  state.balance += power;
  state.stats.totalEarned += power;
  state.stats.totalTaps += 1;

  soundManager.playTap();
  triggerHaptic('light');

  balanceDisplay.classList.add('pulse-up');
  setTimeout(() => balanceDisplay.classList.remove('pulse-up'), 80);

  // Пульсация центрального ядра богатства
  if (wealthCore) {
    wealthCore.classList.add('core-pulse');
    setTimeout(() => wealthCore.classList.remove('core-pulse'), 110);
  }

  // Создаем расходящуюся световую волну в месте клика
  createRippleWave(clientX, clientY);

  // Создаем всплывающее число
  createFloatingNumber(clientX, clientY, `+${formatNumber(power)} ${getCurrencySymbol()}`);

  updateHeader();
  renderEarningsScreen();
  updateBusinessAffordability();
}

function createRippleWave(clientX, clientY) {
  if (!ripplesContainer) return;
  const rect = ripplesContainer.getBoundingClientRect();
  const posX = (clientX !== undefined && clientX !== null ? clientX : (rect.left + rect.width / 2)) - rect.left;
  const posY = (clientY !== undefined && clientY !== null ? clientY : (rect.top + rect.height / 2)) - rect.top;

  const ripple = document.createElement('div');
  ripple.className = 'ripple-wave';
  ripple.style.left = `${posX}px`;
  ripple.style.top = `${posY}px`;

  ripplesContainer.appendChild(ripple);
  setTimeout(() => {
    if (ripple && ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 680);
}

function createFloatingNumber(x, y, text) {
  if (!particlesContainer) return;
  const rect = particlesContainer.getBoundingClientRect();
  const posX = (x || (rect.left + rect.width / 2)) - rect.left;
  const posY = (y || (rect.top + rect.height / 2)) - rect.top;

  const el = document.createElement('div');
  el.className = 'floating-number';
  el.textContent = text;
  
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
 * Прокачка силы клика от +1 до +100 с изменением стиля игры на каждом уровне
 */
function upgradeClickPower() {
  if (state.tapLevel >= 100) return;
  const cost = getTapUpgradeCost(state.tapLevel);
  if (state.balance < cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= cost;
  state.tapLevel += 1;

  // Динамически меняем оформление всей игры на каждом уровне!
  applyTheme(state.tapLevel);

  soundManager.playUpgrade();
  triggerHaptic('success');

  updateHeader();
  renderEarningsScreen();
  updateBusinessAffordability();
  saveGameState();
}

// Алиас для обратной совместимости
function upgradeTap() {
  upgradeClickPower();
}

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
  renderEarningsScreen();
  updateStatsUI();
  saveGameState();
}

function buyRealEstate(estateId) {
  const item = state.realEstate.find(x => x.id === estateId);
  if (!item || item.owned) return;

  if (state.balance < item.cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= item.cost;
  item.owned = true;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderRealEstate();
  renderLeaderboard();
  renderEarningsScreen();
  updateBusinessAffordability();
  updateStatsUI();
  saveGameState();
}

function selectCurrency(code) {
  if (!CURRENCIES[code]) return;
  state.currency = code;

  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  renderEarningsScreen();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateStatsUI();

  soundManager.playTap();
  triggerHaptic('light');
  saveGameState();
}

/**
 * Выполнение перерождения
 */
function performRebirth() {
  if (state.rebirthCount >= 10) return;
  const req = getNextRebirthRequirement();
  if (calculateNetWorth() < req) return;

  state.rebirthCount += 1;

  // Сброс ресурсов
  state.balance = 0;
  state.tapLevel = 1;
  state.businesses.forEach(b => b.count = 0);
  state.realEstate.forEach(r => r.owned = false);
  state.airline = JSON.parse(JSON.stringify(DEFAULT_AIRLINE));

  applyTheme(state.tapLevel);

  soundManager.playRebirthPortal();
  triggerHaptic('success');

  updateHeader();
  renderEarningsScreen();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();
  updateStatsUI();
  saveGameState();

  switchScreen('screenWallet');
}

// ==========================================
// НАВИГАЦИЯ МЕЖДУ 5 ЭКРАНАМИ
// ==========================================

const screens = {
  screenWallet: document.getElementById('screenWallet'),
  screenEarnings: document.getElementById('screenEarnings'),
  screenBusiness: document.getElementById('screenBusiness'),
  screenRealEstate: document.getElementById('screenRealEstate'),
  screenRebirth: document.getElementById('screenRebirth'),
  screenSettings: document.getElementById('screenSettings')
};

const navTabs = {
  screenWallet: document.getElementById('navTabWallet'),
  screenEarnings: document.getElementById('navTabEarnings'),
  screenBusiness: document.getElementById('navTabBusiness'),
  screenRealEstate: document.getElementById('navTabRealEstate'),
  screenRebirth: document.getElementById('navTabRebirth')
};

function switchScreen(targetScreenId) {
  Object.keys(screens).forEach(id => {
    if (screens[id]) {
      if (id === targetScreenId) screens[id].classList.add('active');
      else screens[id].classList.remove('active');
    }
  });

  Object.keys(navTabs).forEach(id => {
    if (navTabs[id]) {
      if (id === targetScreenId) navTabs[id].classList.add('active');
      else navTabs[id].classList.remove('active');
    }
  });

  if (targetScreenId === 'screenEarnings') renderEarningsScreen();
  if (targetScreenId === 'screenWallet') applyTheme(state.tapLevel);
  if (targetScreenId === 'screenSettings') updateStatsUI();
  if (targetScreenId === 'screenBusiness') renderBusinesses();
  if (targetScreenId === 'screenRealEstate') {
    renderRealEstate();
    renderLeaderboard();
  }
  if (targetScreenId === 'screenRebirth') updateRebirthUI();

  soundManager.playTap();
  triggerHaptic('light');
}

document.querySelectorAll('.nav-tab, .nav-tab-center').forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.getAttribute('data-screen');
    if (screenId) switchScreen(screenId);
  });
});

// Переключатель подвкладок внутри Имущества (Каталог / Лидерборд)
subtabCatalog.addEventListener('click', () => {
  subtabCatalog.classList.add('active');
  subtabLeaderboard.classList.remove('active');
  catalogSection.classList.add('active');
  leaderboardSection.classList.remove('active');
  renderRealEstate();
});

subtabLeaderboard.addEventListener('click', () => {
  subtabLeaderboard.classList.add('active');
  subtabCatalog.classList.remove('active');
  leaderboardSection.classList.add('active');
  catalogSection.classList.remove('active');
  renderLeaderboard();
});

// Кнопка вызова модалки перерождения
btnDoRebirth.addEventListener('click', () => {
  const nextMult = getRebirthMultiplier(state.rebirthCount + 1);
  modalNewMultiplier.textContent = `x${nextMult.toFixed(1)}`;
  rebirthModal.classList.add('active');
});

btnCancelRebirth.addEventListener('click', () => {
  rebirthModal.classList.remove('active');
});

btnConfirmRebirth.addEventListener('click', () => {
  rebirthModal.classList.remove('active');
  performRebirth();
});

// ==========================================
// ИГРОВОЙ ЦИКЛ (60 FPS TICK LOOP)
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

  // Обновление рейсов авиакомпании (почасовой доход)
  if (state.airline && state.airline.founded) {
    state.airline.flightElapsed = (state.airline.flightElapsed || 0) + delta;
    const flightDuration = 3600; // 1 час
    if (state.airline.flightElapsed >= flightDuration) {
      const hours = Math.floor(state.airline.flightElapsed / flightDuration);
      state.airline.flightElapsed %= flightDuration;
      const hourlyIncome = getAirlineHourlyIncome();
      if (hourlyIncome > 0) {
        state.airline.uncollectedRevenue = (state.airline.uncollectedRevenue || 0) + (hours * hourlyIncome);
        state.airline.totalFlights = (state.airline.totalFlights || 0) + hours;
        soundManager.playBusinessBuy();
        triggerHaptic('success');
      }
      renderAirlineCard();
    } else {
      updateFlightUI();
    }
  }

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
    if (saveIndicator) {
      saveIndicator.classList.add('saving');
      setTimeout(() => saveIndicator.classList.remove('saving'), 400);
    }
  } catch (e) {}
}

function loadGameState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    // Проверяем старый ключ V1 если V2 еще нет
    if (!raw) raw = localStorage.getItem('money_tapper_save_v1');
    if (!raw) return;

    const saved = JSON.parse(raw);
    if (saved) {
      state.balance = typeof saved.balance === 'number' ? saved.balance : 0;
      state.tapLevel = typeof saved.tapLevel === 'number' ? saved.tapLevel : 1;
      state.rebirthCount = typeof saved.rebirthCount === 'number' ? Math.min(10, saved.rebirthCount) : 0;
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

      // Мерджим недвижимость
      if (Array.isArray(saved.realEstate)) {
        state.realEstate.forEach(defaultEstate => {
          const found = saved.realEstate.find(r => r.id === defaultEstate.id);
          if (found && typeof found.owned === 'boolean') {
            defaultEstate.owned = found.owned;
          }
        });
      }

      // Мерджим авиакомпанию и флот
      if (saved.airline) {
        state.airline.founded = Boolean(saved.airline.founded);
        if (saved.airline.name) state.airline.name = saved.airline.name;
        state.airline.flightElapsed = typeof saved.airline.flightElapsed === 'number' ? saved.airline.flightElapsed : 0;
        state.airline.uncollectedRevenue = typeof saved.airline.uncollectedRevenue === 'number' ? saved.airline.uncollectedRevenue : 0;
        state.airline.totalFlights = typeof saved.airline.totalFlights === 'number' ? saved.airline.totalFlights : 0;
        if (Array.isArray(saved.airline.planes)) {
          state.airline.planes.forEach(defaultPlane => {
            const foundP = saved.airline.planes.find(p => p.id === defaultPlane.id);
            if (foundP && typeof foundP.count === 'number') {
              defaultPlane.count = foundP.count;
            }
          });
        }
      }

      // Расчет офлайн-дохода
      if (saved.lastSaved) {
        const offlineSeconds = (Date.now() - saved.lastSaved) / 1000;
        if (offlineSeconds > 15) {
          const validSeconds = Math.min(offlineSeconds, 28800);
          const passivePerSec = getTotalPassiveIncome();
          let offlineEarned = Math.floor(passivePerSec * validSeconds);

          // Доход за совершенные офлайн рейсы авиакомпании
          if (state.airline && state.airline.founded) {
            const hourly = getAirlineHourlyIncome();
            const totalOfflineElapsed = (state.airline.flightElapsed || 0) + validSeconds;
            const completedHours = Math.floor(totalOfflineElapsed / 3600);
            state.airline.flightElapsed = totalOfflineElapsed % 3600;
            if (completedHours > 0 && hourly > 0) {
              const airlineProfit = completedHours * hourly;
              state.airline.uncollectedRevenue = (state.airline.uncollectedRevenue || 0) + airlineProfit;
              state.airline.totalFlights = (state.airline.totalFlights || 0) + completedHours;
              offlineEarned += airlineProfit;
            }
          }

          if (offlineEarned > 0) {
            state.balance += offlineEarned;
            state.stats.totalEarned += offlineEarned;
            showOfflineModal(offlineEarned);
          }
        }
      }
    }
  } catch (e) {}
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
// НАСТРОЙКИ: ГРОМКОСТЬ, ЗВУК, СБРОС
// ==========================================

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

btnTestSound.addEventListener('click', () => {
  soundManager.playUpgrade();
  triggerHaptic('light');
});

vibrationToggle.addEventListener('change', (e) => {
  state.vibration = e.target.checked;
  if (state.vibration) triggerHaptic('medium');
  saveGameState();
});

btnResetProgress.addEventListener('click', () => {
  resetModal.classList.add('active');
});

btnCancelReset.addEventListener('click', () => {
  resetModal.classList.remove('active');
});

btnConfirmReset.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('money_tapper_save_v1');
  resetModal.classList.remove('active');

  state.balance = 0;
  state.tapLevel = 1;
  state.rebirthCount = 0;
  state.currency = 'RUB';
  state.volume = 80;
  state.vibration = true;
  state.businesses = JSON.parse(JSON.stringify(DEFAULT_BUSINESSES));
  state.realEstate = JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE));
  state.airline = JSON.parse(JSON.stringify(DEFAULT_AIRLINE));
  state.stats = { totalEarned: 0, totalTaps: 0, playTimeSeconds: 0 };

  soundManager.setVolume(state.volume);
  vibrationToggle.checked = true;

  applyTheme(state.tapLevel);
  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  renderEarningsScreen();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();
  updateStatsUI();
  switchScreen('screenWallet');

  soundManager.playUpgrade();
});

// Слушатели модальных окон ангара и авиакомпании
btnCloseHangar?.addEventListener('click', closeHangarModal);
btnCancelRenameAirline?.addEventListener('click', closeRenameModal);
btnSaveAirlineName?.addEventListener('click', saveAirlineName);

// ==========================================
// СЛУШАТЕЛИ ТАПА ПО ФОНУ И КНОПОК
// ==========================================

// 1. Тап по любому месту фона на экране Кошелька
if (walletTapArea) {
  walletTapArea.addEventListener('pointerdown', (e) => {
    // Не запускаем тап, если игрок нажал на интерактивную кнопку
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.modal-backdrop')) {
      return;
    }
    e.preventDefault();
    handleTap(e.clientX, e.clientY);
  });
}

// Запасной слушатель для tapTarget
if (tapTarget) {
  tapTarget.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleTap(e.clientX, e.clientY);
  });
}

// 2. Кнопка прокачки клика во вкладке «Заработок»
if (btnUpgradeClick) {
  btnUpgradeClick.addEventListener('click', () => {
    upgradeClickPower();
  });
}

// 3. Кнопка «Прокачать клик ➔» в Кошельке (быстрый переход во вкладку Заработок)
if (btnGoEarnings) {
  btnGoEarnings.addEventListener('click', (e) => {
    e.stopPropagation();
    switchScreen('screenEarnings');
  });
}

// 4. Кнопка шестеренки (Настройки) в верхней шапке
if (btnHeaderSettings) {
  btnHeaderSettings.addEventListener('click', () => {
    switchScreen('screenSettings');
  });
}

setInterval(saveGameState, 3000);
window.addEventListener('beforeunload', saveGameState);

// ==========================================
// СТАРТ ИГРЫ
// ==========================================

function initGame() {
  loadGameState();
  
  // Применяем тему оформления кликера на старте
  applyTheme(state.tapLevel);

  vibrationToggle.checked = state.vibration;
  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  renderEarningsScreen();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();

  const unlockAudio = () => {
    soundManager.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  lastTickTime = performance.now();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', initGame);
