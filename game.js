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

// Стартовые подработки (помогают на старте, покупка строго 1 раз)
const DEFAULT_SIDE_JOBS = [
  {
    id: 'shop_job',
    name: 'Подработка в магазине',
    icon: '🏪',
    desc: 'Выкладка товаров и помощь на кассе в супермаркете у дома.',
    cost: 100, // 100 рублей по ТЗ
    income: 1, // 1 рубль в секунду по ТЗ
    owned: false
  },
  {
    id: 'starbucks_job',
    name: 'Подработка в Starbucks',
    icon: '☕',
    desc: 'Приготовление кофе и десертов для спешащих горожан.',
    cost: 1000, // 1000 рублей по ТЗ
    income: 10, // 10 рублей в секунду по ТЗ
    owned: false
  },
  {
    id: 'construction_job',
    name: 'Подработка на стройке',
    icon: '🏗️',
    desc: 'Помощь бригаде на строительстве современного жилого квартала.',
    cost: 2000, // 2000 рублей по ТЗ
    income: 30, // 30 рублей в секунду по ТЗ
    owned: false
  }
];

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

// ==========================================
// КОНФИГУРАЦИЯ 4 КЕЙСОВ И 40 ПРЕДМЕТОВ
// ==========================================

const CASE_TYPES = {
  bronze: {
    id: 'bronze',
    name: 'Бронзовый кейс',
    cost: 100000,
    icon: '🥉',
    badge: 'СТАРТОВЫЙ & СЕКРЕТНЫЙ'
  },
  silver: {
    id: 'silver',
    name: 'Серебряный кейс',
    cost: 1000000,
    icon: '🧰',
    badge: 'ГАДЖЕТЫ & ДЕВАЙСЫ'
  },
  diamond: {
    id: 'diamond',
    name: 'Алмазный кейс',
    cost: 10000000,
    icon: '💎',
    badge: 'РОСКОШЬ & VIP'
  },
  property: {
    id: 'property',
    name: 'Кейс с имуществом',
    cost: 100000000,
    icon: '🏰',
    badge: 'ЭЛИТНАЯ НЕДВИЖИМОСТЬ'
  }
};

const RARITY_INFO = {
  common: { name: 'Обычный', class: 'rarity-common', color: '#94a3b8', weight: 42 },
  uncommon: { name: 'Необычный', class: 'rarity-uncommon', color: '#4ade80', weight: 30 },
  rare: { name: 'Редкий', class: 'rarity-rare', color: '#60a5fa', weight: 18 },
  epic: { name: 'Эпический', class: 'rarity-epic', color: '#c084fc', weight: 7 },
  legendary: { name: 'Легендарный', class: 'rarity-legendary', color: '#fbbf24', weight: 2.6 },
  mythic: { name: 'Мифический', class: 'rarity-mythic', color: '#f43f5e', weight: 0.4 },
  ultra: { name: 'Ультра Мега Редкий', class: 'rarity-ultra', color: '#ec4899', weight: 0.000000000001 }
};

const CASE_ITEMS = [
  // --- 0. БРОНЗОВЫЙ КЕЙС (10 предметов) ---
  {
    id: 'brz_sprat',
    caseId: 'bronze',
    name: 'Килька в томате',
    icon: '🥫',
    rarity: 'common',
    cost: 15000,
    income: 5,
    desc: 'Классическая балтийская килька в пряном томатном соусе. Вкус студенческих побед.'
  },
  {
    id: 'brz_sandwich',
    caseId: 'bronze',
    name: 'Бутерброд с докторской',
    icon: '🥪',
    rarity: 'common',
    cost: 25000,
    income: 10,
    desc: 'Батон, сливочное масло и щедрый ломоть вареной колбасы — идеальный перекус.'
  },
  {
    id: 'brz_socks',
    caseId: 'bronze',
    name: 'Счастливые носки',
    icon: '🧦',
    rarity: 'common',
    cost: 40000,
    income: 20,
    desc: 'Теплые махровые носки с принтом монет, приносящие удачу при каждом шаге.'
  },
  {
    id: 'brz_cap',
    caseId: 'bronze',
    name: 'Кепка уличного стиля',
    icon: '🧢',
    rarity: 'uncommon',
    cost: 70000,
    income: 45,
    desc: 'Стильная хлопковая бейсболка с вышитым золотым логотипом доллара.'
  },
  {
    id: 'brz_backpack',
    caseId: 'bronze',
    name: 'Городской рюкзак',
    icon: '🎒',
    rarity: 'uncommon',
    cost: 100000,
    income: 80,
    desc: 'Вместительный водонепроницаемый рюкзак для пачек наличных и ноутбука.'
  },
  {
    id: 'brz_glasses',
    caseId: 'bronze',
    name: 'Солнцезащитные очки Авиаторы',
    icon: '🕶️',
    rarity: 'rare',
    cost: 160000,
    income: 150,
    desc: 'Каплевидные поляризационные очки в тонкой золотистой оправе.'
  },
  {
    id: 'brz_skateboard',
    caseId: 'bronze',
    name: 'Карбоновый скейтборд',
    icon: '🛹',
    rarity: 'rare',
    cost: 280000,
    income: 300,
    desc: 'Легкий и маневренный круизер из многослойного клена и карбона.'
  },
  {
    id: 'brz_vespa',
    caseId: 'bronze',
    name: 'Винтажный скутер Retro',
    icon: '🛵',
    rarity: 'epic',
    cost: 550000,
    income: 700,
    desc: 'Культовый итальянский двухколесный транспорт цвета морской волны.'
  },
  {
    id: 'brz_trophy',
    caseId: 'bronze',
    name: 'Бронзовый кубок Чемпиона',
    icon: '🏆',
    rarity: 'legendary',
    cost: 1800000,
    income: 2500,
    desc: 'Тяжелый литой кубок за первые крупные достижения в бизнесе.'
  },
  {
    id: 'brz_killka',
    caseId: 'bronze',
    name: 'KILLKA',
    icon: '🐟',
    rarity: 'ultra',
    cost: 1000000000000,
    income: 100000000,
    desc: 'УЛЬТРА-МЕГА-АРТЕФАКТ ВСЕЛЕННОЙ! Божественная сияющая золотом рыба. Стоимость — 1 ТРИЛЛИОН ₽! Шанс выпадения — 1 к 1 000 000 000 000.'
  },

  // --- 1. СЕРЕБРЯНЫЙ КЕЙС (10 предметов) ---
  {
    id: 'sil_headphones',
    caseId: 'silver',
    name: 'Беспроводные наушники Pro',
    icon: '🎧',
    rarity: 'common',
    cost: 200000,
    income: 250,
    desc: 'Активное шумоподавление и кристально чистый звук для продуктивной работы.'
  },
  {
    id: 'sil_phone',
    caseId: 'silver',
    name: 'Смартфон CyberPhone 15',
    icon: '📱',
    rarity: 'common',
    cost: 400000,
    income: 550,
    desc: 'Флагманский титановый смартфон с тройной камерой и нейропроцессором.'
  },
  {
    id: 'sil_watch',
    caseId: 'silver',
    name: 'Смарт-часы Titanium',
    icon: '⌚',
    rarity: 'uncommon',
    cost: 700000,
    income: 1000,
    desc: 'Умные часы с сапфировым стеклом, ЭКГ и мониторингом котировок акций.'
  },
  {
    id: 'sil_laptop',
    caseId: 'silver',
    name: 'Ультрабук Pro Retina',
    icon: '💻',
    rarity: 'uncommon',
    cost: 1000000,
    income: 1600,
    desc: 'Мощный портативный компьютер для управления финансовой империей.'
  },
  {
    id: 'sil_console',
    caseId: 'silver',
    name: 'Игровая консоль CyberStation 5',
    icon: '🎮',
    rarity: 'rare',
    cost: 1500000,
    income: 2600,
    desc: 'Игровая станция с поддержкой 8K и трассировки лучей для зоны отдыха.'
  },
  {
    id: 'sil_scooter',
    caseId: 'silver',
    name: 'Премиум электросамокат Dual',
    icon: '🛴',
    rarity: 'rare',
    cost: 2200000,
    income: 4200,
    desc: 'Двухмоторный карбоновый самокат со скоростью до 80 км/ч.'
  },
  {
    id: 'sil_camera',
    caseId: 'silver',
    name: 'Кинокамера Hasselblad 8K',
    icon: '📷',
    rarity: 'rare',
    cost: 3500000,
    income: 7000,
    desc: 'Шведская среднеформатная оптика для создания шедевров.'
  },
  {
    id: 'sil_vr',
    caseId: 'silver',
    name: 'VR-шлем нейро-погружения',
    icon: '🥽',
    rarity: 'epic',
    cost: 5500000,
    income: 12000,
    desc: 'Гарнитура виртуальной реальности с прямым считыванием импульсов мозга.'
  },
  {
    id: 'sil_drone',
    caseId: 'silver',
    name: 'Дрон с лазерным лидаром',
    icon: '🛸',
    rarity: 'legendary',
    cost: 10000000,
    income: 25000,
    desc: 'Сверхточный автономный дрон для картографирования и панорамных съемок.'
  },
  {
    id: 'sil_robot',
    caseId: 'silver',
    name: 'Домашний робот-андроид',
    icon: '🤖',
    rarity: 'mythic',
    cost: 20000000,
    income: 60000,
    desc: 'Бионический дворецкий на базе искусственного интеллекта последнего поколения.'
  },

  // --- 2. АЛМАЗНЫЙ КЕЙС (10 предметов) ---
  {
    id: 'dia_goldbar',
    caseId: 'diamond',
    name: 'Золотой слиток 1 кг 999°',
    icon: '🪙',
    rarity: 'common',
    cost: 3500000,
    income: 8000,
    desc: 'Банковский мерный слиток высшей пробы из Швейцарского резерва.'
  },
  {
    id: 'dia_ring',
    caseId: 'diamond',
    name: 'Платиновое кольцо с изумрудом',
    icon: '💍',
    rarity: 'common',
    cost: 6000000,
    income: 15000,
    desc: 'Колумбийский изумруд чистой воды в оправе из платины 950 пробы.'
  },
  {
    id: 'dia_caviarphone',
    caseId: 'diamond',
    name: 'Caviar iPhone из метеорита',
    icon: '📱',
    rarity: 'uncommon',
    cost: 9000000,
    income: 25000,
    desc: 'Корпус из фрагментов метеорита Муонионалуста и 24-каратного золота.'
  },
  {
    id: 'dia_necklace',
    caseId: 'diamond',
    name: 'Бриллиантовое ожерелье 5 карат',
    icon: '💎',
    rarity: 'uncommon',
    cost: 13000000,
    income: 40000,
    desc: 'Ювелирный шедевр от Cartier с россыпью безупречных бриллиантов.'
  },
  {
    id: 'dia_watch',
    caseId: 'diamond',
    name: 'Турбийон Richard Mille',
    icon: '🏎️',
    rarity: 'rare',
    cost: 20000000,
    income: 70000,
    desc: 'Скелетонизированный хронограф в корпусе из сапфирового стекла.'
  },
  {
    id: 'dia_tiara',
    caseId: 'diamond',
    name: 'Королевская тиара с рубинами',
    icon: '👑',
    rarity: 'rare',
    cost: 30000000,
    income: 120000,
    desc: 'Историческая реликвия европейской монаршей династии XIX века.'
  },
  {
    id: 'dia_vippass',
    caseId: 'diamond',
    name: 'VIP-пропуск Billionaire Club',
    icon: '🎫',
    rarity: 'rare',
    cost: 45000000,
    income: 200000,
    desc: 'Пожизненный доступ в закрытые клубы Монако, Дубая и Лондона.'
  },
  {
    id: 'dia_vaultkey',
    caseId: 'diamond',
    name: 'Ключ от хранилища в Цюрихе',
    icon: '🗝️',
    rarity: 'epic',
    cost: 70000000,
    income: 350000,
    desc: 'Титан-электронный ключ от неприступной частной ячейки швейцарского банка.'
  },
  {
    id: 'dia_meteorite',
    caseId: 'diamond',
    name: 'Осколок лунного метеорита',
    icon: '🪐',
    rarity: 'legendary',
    cost: 120000000,
    income: 700000,
    desc: 'Редчайший образец внеземного базальта в гравитационном подвесе.'
  },
  {
    id: 'dia_artifact',
    caseId: 'diamond',
    name: 'Артефакт «Око Фортуны»',
    icon: '🔮',
    rarity: 'mythic',
    cost: 250000000,
    income: 1800000,
    desc: 'Древний мистический артефакт, притягивающий финансовую удачу своего владельца.'
  },

  // --- 3. КЕЙС С ИМУЩЕСТВОМ (10 предметов) ---
  {
    id: 'prop_ferrari',
    caseId: 'property',
    name: 'Суперкар Ferrari Tributo',
    icon: '🏎️',
    rarity: 'common',
    cost: 35000000,
    income: 150000,
    desc: 'Итальянский среднемоторный спорткар V8 мощностью 720 лошадиных сил.'
  },
  {
    id: 'prop_cityapt',
    caseId: 'property',
    name: 'Апартаменты в Сити',
    icon: '🏢',
    rarity: 'common',
    cost: 70000000,
    income: 350000,
    desc: 'Видовые дизайнерские апартаменты на 65-м этаже башни «Федерация».'
  },
  {
    id: 'prop_bugatti',
    caseId: 'property',
    name: 'Гиперкар Bugatti Chiron',
    icon: '⚡',
    rarity: 'uncommon',
    cost: 120000000,
    income: 650000,
    desc: 'Легендарный квад-турбо W16 болид со скоростью свыше 420 км/ч.'
  },
  {
    id: 'prop_villa',
    caseId: 'property',
    name: 'Вилла на Лазурном берегу',
    icon: '🏡',
    rarity: 'uncommon',
    cost: 180000000,
    income: 1100000,
    desc: 'Средиземноморское поместье в Ницце с инфинити-бассейном и вертодромом.'
  },
  {
    id: 'prop_heli',
    caseId: 'property',
    name: 'Вертолет Bell VIP',
    icon: '🚁',
    rarity: 'rare',
    cost: 260000000,
    income: 1800000,
    desc: 'Двухдвигательный бизнес-вертолет с роскошным шумоизолированным салоном.'
  },
  {
    id: 'prop_castle',
    caseId: 'property',
    name: 'Старинный замок в Альпах',
    icon: '🏰',
    rarity: 'rare',
    cost: 400000000,
    income: 3000000,
    desc: 'Крепость XIV века в Баварских Альпах с винными погребами и парком.'
  },
  {
    id: 'prop_megayacht',
    caseId: 'property',
    name: '60м Морская мегаяхта',
    icon: '🛥️',
    rarity: 'rare',
    cost: 600000000,
    income: 5000000,
    desc: 'Экспедиционная яхта с дальностью 5000 миль, пляжным клубом и спа.'
  },
  {
    id: 'prop_island',
    caseId: 'property',
    name: 'Тропический атолл на Мальдивах',
    icon: '🏝️',
    rarity: 'epic',
    cost: 950000000,
    income: 9000000,
    desc: 'Изолированный белоснежный остров с лагуной и частной взлетно-посадочной полосой.'
  },
  {
    id: 'prop_skyscraper',
    caseId: 'property',
    name: 'Небоскреб «Империал Тауэр»',
    icon: '🏙️',
    rarity: 'legendary',
    cost: 1800000000,
    income: 20000000,
    desc: '90-этажный многофункциональный небоскреб класса А+ в центре мегаполиса.'
  },
  {
    id: 'prop_spacehotel',
    caseId: 'property',
    name: 'Орбитальный отель «Alpha Star»',
    icon: '🛰️',
    rarity: 'mythic',
    cost: 4000000000,
    income: 50000000,
    desc: 'Частный орбитальный туристический комплекс с панорамным куполом Земли.'
  }
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
  sideJobs: JSON.parse(JSON.stringify(DEFAULT_SIDE_JOBS)),
  businesses: JSON.parse(JSON.stringify(DEFAULT_BUSINESSES)),
  realEstate: JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE)),
  airline: JSON.parse(JSON.stringify(DEFAULT_AIRLINE)),
  inventory: {}, // itemId: { count: 1, date: timestamp }
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

  playCaseSpin() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const count = 14;
      for (let i = 0; i < count; i++) {
        const time = this.ctx.currentTime + (Math.pow(i / count, 1.7) * 2.8);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + (i * 30), time);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.05);
      }
    } catch (e) {}
  }

  playCaseWin(rarity = 'common') {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const chordMap = {
        common: [523.25, 659.25, 783.99],
        uncommon: [523.25, 659.25, 783.99, 1046.50],
        rare: [587.33, 739.99, 880.00, 1174.66],
        epic: [659.25, 830.61, 987.77, 1318.51],
        legendary: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
        mythic: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00],
        ultra: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00, 2637.02, 3135.96]
      };
      const notes = chordMap[rarity] || chordMap.common;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.07;
        osc.type = (rarity === 'ultra' || rarity === 'mythic' || rarity === 'legendary') ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        const peakGain = (rarity === 'ultra') ? 0.32 : (rarity === 'mythic' || rarity === 'legendary') ? 0.22 : 0.28;
        gain.gain.setValueAtTime(peakGain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
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
 * Подсчет суммарного пассивного дохода от предметов в коллекции (в секунду)
 */
function calculateInventoryTotalIncome() {
  if (!state.inventory) return 0;
  return Object.keys(state.inventory).reduce((sum, itemId) => {
    const item = CASE_ITEMS.find(it => it.id === itemId);
    return sum + (item && item.income ? item.income : 0);
  }, 0);
}

/**
 * Суммарный пассивный доход в секунду (базовый доход всех бизнесов, подработок и предметов инвентаря * множитель перерождения)
 */
function getTotalPassiveIncome() {
  let base = state.businesses.reduce((sum, b) => sum + (b.count * b.baseIncome), 0);
  if (state.sideJobs) {
    base += state.sideJobs.reduce((sum, j) => sum + (j.owned ? j.income : 0), 0);
  }
  base += calculateInventoryTotalIncome();
  const mult = getRebirthMultiplier();
  return Math.round(base * mult);
}

/**
 * Расчет чистого капитала (Net Worth):
 * Наличный баланс + стоимость купленной недвижимости + суммарная стоимость купленных бизнесов
 */
function calculateNetWorth() {
  let total = state.balance;
  
  // Стартовые подработки
  if (state.sideJobs) {
    state.sideJobs.forEach(j => {
      if (j.owned) total += j.cost;
    });
  }

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

  // Инвентарь (предметы из кейсов)
  if (state.inventory) {
    Object.keys(state.inventory).forEach(itemId => {
      const itemDef = CASE_ITEMS.find(it => it.id === itemId);
      if (itemDef) {
        total += itemDef.cost;
      }
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

// Подработки и Бизнесы
const sideJobsList = document.getElementById('sideJobsList');
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
const subtabRebirth = document.getElementById('subtabRebirth');
const rebirthSection = document.getElementById('rebirthSection');
const headerRebirthBadge = document.getElementById('headerRebirthBadge');

// Кейсы и Инвентарь
const screenCases = document.getElementById('screenCases');
const navTabCases = document.getElementById('navTabCases');
const casesBadge = document.getElementById('casesBadge');
const casesShopView = document.getElementById('casesShopView');
const casesInventoryView = document.getElementById('casesInventoryView');
const inventoryCountBadge = document.getElementById('inventoryCountBadge');
const inventoryValueBadge = document.getElementById('inventoryValueBadge');
const inventoryIncomeBadge = document.getElementById('inventoryIncomeBadge');
const invTotalBadge = document.getElementById('invTotalBadge');
const btnToggleInventory = document.getElementById('btnToggleInventory');
const btnInvToggleText = document.getElementById('btnInvToggleText');
const btnBackToCases = document.getElementById('btnBackToCases');
const inventoryGrid = document.getElementById('inventoryGrid');
const btnOpenBronzeCase = document.getElementById('btnOpenBronzeCase');
const btnOpenSilverCase = document.getElementById('btnOpenSilverCase');
const btnOpenDiamondCase = document.getElementById('btnOpenDiamondCase');
const btnOpenPropertyCase = document.getElementById('btnOpenPropertyCase');

// Модальное окно открытия кейса (рулетка)
const caseOpenModal = document.getElementById('caseOpenModal');
const caseOpeningTitle = document.getElementById('caseOpeningTitle');
const btnCloseCaseModal = document.getElementById('btnCloseCaseModal');
const rouletteContainer = document.getElementById('rouletteContainer');
const rouletteViewport = document.getElementById('rouletteViewport');
const rouletteTrack = document.getElementById('rouletteTrack');
const rouletteStatusText = document.getElementById('rouletteStatusText');
const caseRewardStage = document.getElementById('caseRewardStage');
const rewardGlowBurst = document.getElementById('rewardGlowBurst');
const rewardItemCard = document.getElementById('rewardItemCard');
const rewardRarityBadge = document.getElementById('rewardRarityBadge');
const rewardIconBox = document.getElementById('rewardIconBox');
const rewardItemName = document.getElementById('rewardItemName');
const rewardItemDesc = document.getElementById('rewardItemDesc');
const rewardValueAmount = document.getElementById('rewardValueAmount');
const rewardIncomeAmount = document.getElementById('rewardIncomeAmount');
const duplicateBanner = document.getElementById('duplicateBanner');
const compensationAmount = document.getElementById('compensationAmount');
const newItemBanner = document.getElementById('newItemBanner');
const btnCaseCollect = document.getElementById('btnCaseCollect');
const btnCaseReopen = document.getElementById('btnCaseReopen');

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

function updateCaseButtonsAffordability() {
  if (btnOpenBronzeCase) btnOpenBronzeCase.disabled = state.balance < CASE_TYPES.bronze.cost;
  if (btnOpenSilverCase) btnOpenSilverCase.disabled = state.balance < CASE_TYPES.silver.cost;
  if (btnOpenDiamondCase) btnOpenDiamondCase.disabled = state.balance < CASE_TYPES.diamond.cost;
  if (btnOpenPropertyCase) btnOpenPropertyCase.disabled = state.balance < CASE_TYPES.property.cost;
  if (casesBadge) {
    const canAffordAny = state.balance >= CASE_TYPES.bronze.cost;
    casesBadge.style.display = canAffordAny ? 'block' : 'none';
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

  updateCaseButtonsAffordability();
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
 * Рендеринг начальных подработок (покупка строго 1 раз)
 */
function renderSideJobs() {
  if (!sideJobsList) return;
  sideJobsList.innerHTML = '';
  const mult = getRebirthMultiplier();

  state.sideJobs.forEach(job => {
    const canAfford = state.balance >= job.cost;
    const currentIncome = Math.round(job.income * mult);

    const card = document.createElement('div');
    card.className = `sidejob-card ${job.owned ? 'owned' : ''} ${canAfford && !job.owned ? 'can-afford' : ''}`;
    card.innerHTML = `
      <div class="sidejob-top-row">
        <div class="sidejob-icon-box">${job.icon}</div>
        <div class="sidejob-main-info">
          <div class="sidejob-title-row">
            <span class="sidejob-name">${job.name}</span>
            <span class="sidejob-status-pill">${job.owned ? '✅ Устроен' : 'Доступно'}</span>
          </div>
          <div class="sidejob-desc">${job.desc}</div>
          <div class="sidejob-income-stat">
            <span>⚡ Доход:</span>
            <span class="sidejob-income-num">+${formatNumber(currentIncome)}</span>
            <span class="currency-text">${getCurrencySymbol()}</span>
            <span>/ сек</span>
          </div>
        </div>
      </div>
      <div class="sidejob-bottom-row">
        <button class="btn-buy-sidejob" data-job-id="${job.id}" ${job.owned || !canAfford ? 'disabled' : ''}>
          <span>${job.owned ? '✅ Устроен(а) на работу' : 'Устроиться на подработку'}</span>
          ${job.owned ? '' : `<span class="btn-sidejob-cost">${formatNumber(job.cost)} <span class="currency-text">${getCurrencySymbol()}</span></span>`}
        </button>
      </div>
    `;

    if (!job.owned) {
      const buyBtn = card.querySelector('.btn-buy-sidejob');
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        buySideJob(job.id);
      });
    }

    sideJobsList.appendChild(card);
  });
}

function updateSideJobsAffordability() {
  if (!sideJobsList) return;
  const cards = sideJobsList.querySelectorAll('.sidejob-card');

  state.sideJobs.forEach((job, index) => {
    const card = cards[index];
    if (!card) return;

    if (job.owned) {
      card.classList.add('owned');
      card.classList.remove('can-afford');
      const btn = card.querySelector('.btn-buy-sidejob');
      if (btn) btn.disabled = true;
      return;
    }

    const canAfford = state.balance >= job.cost;
    if (canAfford) card.classList.add('can-afford');
    else card.classList.remove('can-afford');

    const btn = card.querySelector('.btn-buy-sidejob');
    if (btn) btn.disabled = !canAfford;
  });
}

function buySideJob(jobId) {
  const job = state.sideJobs.find(j => j.id === jobId);
  if (!job || job.owned) return;

  if (state.balance < job.cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= job.cost;
  job.owned = true;

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  updateHeader();
  renderSideJobs();
  renderBusinesses();
  renderEarningsScreen();
  updateStatsUI();
  saveGameState();
}

/**
 * Рендеринг списка бизнесов
 */
function renderBusinesses() {
  renderSideJobs();

  businessesList.innerHTML = '';
  let canAffordAny = 0;
  const mult = getRebirthMultiplier();

  // Учитываем подработки в бейдже
  if (state.sideJobs) {
    state.sideJobs.forEach(j => {
      if (!j.owned && state.balance >= j.cost) canAffordAny++;
    });
  }

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

  // Проверка доступности подработок
  if (state.sideJobs) {
    state.sideJobs.forEach(j => {
      if (!j.owned && state.balance >= j.cost) canAffordAny++;
    });
  }
  updateSideJobsAffordability();

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
// ЛОГИКА КЕЙСОВ И ИНВЕНТАРЯ (30 ПРЕДМЕТОВ)
// ==========================================

let currentOpeningCaseId = 'silver';
let currentActiveInventoryFilter = 'all';
let isRouletteSpinning = false;
let lastWonItem = null;

/**
 * Подсчет общей стоимости предметов в коллекции
 */
function calculateInventoryTotalValue() {
  if (!state.inventory) return 0;
  return Object.keys(state.inventory).reduce((sum, itemId) => {
    const item = CASE_ITEMS.find(it => it.id === itemId);
    return sum + (item ? item.cost : 0);
  }, 0);
}

/**
 * Количество уникальных предметов в инвентаре
 */
function getInventoryOwnedCount() {
  if (!state.inventory) return 0;
  return Object.keys(state.inventory).length;
}

/**
 * Рендеринг экрана Кейсов (статистика, доступность кнопок)
 */
function renderCasesScreen() {
  const ownedCount = getInventoryOwnedCount();
  const totalValue = calculateInventoryTotalValue();
  const totalIncome = calculateInventoryTotalIncome();

  if (inventoryCountBadge) inventoryCountBadge.textContent = `${ownedCount} / 40`;
  if (invTotalBadge) invTotalBadge.textContent = `${ownedCount}`;
  if (inventoryValueBadge) inventoryValueBadge.textContent = formatNumber(totalValue);
  if (inventoryIncomeBadge) inventoryIncomeBadge.textContent = `+${formatNumber(totalIncome)}`;

  updateCaseButtonsAffordability();
}

/**
 * Рендеринг инвентаря игрока с фильтрацией
 */
function renderInventory(filter = currentActiveInventoryFilter) {
  currentActiveInventoryFilter = filter;
  if (!inventoryGrid) return;

  inventoryGrid.innerHTML = '';
  const items = filter === 'all' ? CASE_ITEMS : CASE_ITEMS.filter(it => it.caseId === filter);

  items.forEach(item => {
    const isOwned = Boolean(state.inventory && state.inventory[item.id]);
    const rarity = RARITY_INFO[item.rarity] || RARITY_INFO.common;

    const card = document.createElement('div');
    card.className = `inventory-item-card ${isOwned ? '' : 'locked'} ${rarity.class}`;
    card.innerHTML = `
      <div class="inv-item-top">
        <div class="inv-item-icon-box">${item.icon}</div>
        <span class="inv-status-pill">${isOwned ? 'В коллекции' : 'Не открыт'}</span>
      </div>
      <div class="inv-item-name">${item.name}</div>
      <div class="inv-item-desc">${item.desc}</div>
      <div class="inv-item-stats-row">
        <div class="inv-item-worth">${formatNumber(item.cost)} <span class="currency-text">${getCurrencySymbol()}</span></div>
        <div class="inv-item-income ${isOwned ? 'active' : ''}">⚡ +${formatNumber(item.income)} <span class="currency-text">${getCurrencySymbol()}</span>/с</div>
      </div>
    `;
    inventoryGrid.appendChild(card);
  });
}

function showCasesShopView() {
  if (casesShopView) casesShopView.style.display = 'flex';
  if (casesInventoryView) casesInventoryView.style.display = 'none';
  if (btnInvToggleText) btnInvToggleText.textContent = 'Инвентарь';
  renderCasesScreen();
}

function showCasesInventoryView() {
  if (casesShopView) casesShopView.style.display = 'none';
  if (casesInventoryView) casesInventoryView.style.display = 'flex';
  if (btnInvToggleText) btnInvToggleText.textContent = 'Кейсы';
  renderInventory(currentActiveInventoryFilter);
}

function toggleCasesViews() {
  if (casesInventoryView && casesInventoryView.style.display === 'flex') {
    showCasesShopView();
  } else {
    showCasesInventoryView();
  }
}

/**
 * Выбор случайного предмета с учетом весов редкостей
 * Ультра-мега-редкий предмет «KILLKA» проверяется отдельно с шансом 1 к триллиону (1e-12)
 */
function pickRandomItemForCase(caseId) {
  const items = CASE_ITEMS.filter(it => it.caseId === caseId);

  // Проверка на ультра мега редкий предмет (шанс 1 к 1 000 000 000 000)
  const ultraItem = items.find(it => it.rarity === 'ultra');
  if (ultraItem) {
    if (Math.random() < 1e-12) {
      return ultraItem;
    }
  }

  // Обычные предметы разыгрываются по стандартным весам редкостей
  const regularItems = items.filter(it => it.rarity !== 'ultra');
  const totalWeight = regularItems.reduce((sum, it) => sum + (RARITY_INFO[it.rarity]?.weight || 10), 0);
  let r = Math.random() * totalWeight;
  for (const item of regularItems) {
    const w = RARITY_INFO[item.rarity]?.weight || 10;
    if (r < w) return item;
    r -= w;
  }
  return regularItems[0] || items[0] || CASE_ITEMS[0];
}

/**
 * Запуск процесса открытия кейса с анимацией рулетки
 */
function openCase(caseId) {
  if (isRouletteSpinning) return;

  const caseDef = CASE_TYPES[caseId];
  if (!caseDef) return;

  if (state.balance < caseDef.cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  isRouletteSpinning = true;
  currentOpeningCaseId = caseId;

  // Списание стоимости кейса
  state.balance -= caseDef.cost;
  updateHeader();
  renderCasesScreen();
  saveGameState();

  const wonItem = pickRandomItemForCase(caseId);
  lastWonItem = wonItem;

  // Подготовка модального окна рулетки
  if (caseOpeningTitle) caseOpeningTitle.textContent = `Открытие: ${caseDef.name}`;
  if (caseRewardStage) caseRewardStage.style.display = 'none';
  if (rouletteContainer) rouletteContainer.style.display = 'flex';
  if (rouletteStatusText) rouletteStatusText.textContent = 'Крутим рулетку...';
  if (caseOpenModal) caseOpenModal.classList.add('active');

  // Генерация ленты рулетки (45 предметов)
  if (rouletteTrack) {
    rouletteTrack.innerHTML = '';
    const TOTAL_ITEMS = 44;
    const WINNING_INDEX = 36;
    const casePool = CASE_ITEMS.filter(it => it.caseId === caseId);

    for (let i = 0; i <= TOTAL_ITEMS; i++) {
      let item;
      if (i === WINNING_INDEX) {
        item = wonItem;
      } else {
        // Тизер в рулетке: при открытии бронзового кейса показываем KILLKA на 33-м слоте как тизер
        if (caseId === 'bronze' && i === 33 && wonItem.rarity !== 'ultra') {
          const killkaItem = casePool.find(it => it.rarity === 'ultra');
          item = killkaItem || casePool[Math.floor(Math.random() * casePool.length)];
        } else {
          // Исключаем ультра из случайного наполнения рулетки, чтобы она оставалась супер-секретной
          const regularPool = casePool.filter(it => it.rarity !== 'ultra');
          item = regularPool.length > 0
            ? regularPool[Math.floor(Math.random() * regularPool.length)]
            : casePool[Math.floor(Math.random() * casePool.length)];
        }
      }

      const rarity = RARITY_INFO[item.rarity] || RARITY_INFO.common;
      const el = document.createElement('div');
      el.className = `roulette-item ${rarity.class}`;
      el.innerHTML = `
        <span class="roulette-item-icon">${item.icon}</span>
        <span class="roulette-item-name">${item.name}</span>
      `;
      rouletteTrack.appendChild(el);
    }

    const slotWidth = 80;
    const viewportWidth = rouletteViewport ? rouletteViewport.clientWidth || 320 : 320;
    const jitter = (Math.random() - 0.5) * 26;
    const targetX = -((WINNING_INDEX * slotWidth) + (slotWidth / 2) - (viewportWidth / 2) + jitter);

    rouletteTrack.style.transition = 'none';
    rouletteTrack.style.transform = 'translateX(0px)';
    void rouletteTrack.offsetHeight;

    soundManager.playCaseSpin();
    triggerHaptic('medium');

    rouletteTrack.style.transition = 'transform 3.2s cubic-bezier(0.12, 0.8, 0.18, 1)';
    rouletteTrack.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      finishCaseOpening(wonItem);
    }, 3250);
  }
}

/**
 * Завершение прокрутки: проверка дубликата, начисление и показ награды
 */
function finishCaseOpening(wonItem) {
  isRouletteSpinning = false;
  const isDuplicate = Boolean(state.inventory && state.inventory[wonItem.id]);
  const rarity = RARITY_INFO[wonItem.rarity] || RARITY_INFO.common;

  if (isDuplicate) {
    state.balance += wonItem.cost;
    state.stats.totalEarned += wonItem.cost;
    if (duplicateBanner) duplicateBanner.style.display = 'flex';
    if (newItemBanner) newItemBanner.style.display = 'none';
    if (compensationAmount) compensationAmount.textContent = `+${formatNumber(wonItem.cost)} ${getCurrencySymbol()}`;
    if (btnCaseCollect) btnCaseCollect.textContent = 'Забрать компенсацию';
  } else {
    if (!state.inventory) state.inventory = {};
    state.inventory[wonItem.id] = { count: 1, obtainedAt: Date.now() };
    if (duplicateBanner) duplicateBanner.style.display = 'none';
    if (newItemBanner) newItemBanner.style.display = 'block';
    if (btnCaseCollect) btnCaseCollect.textContent = 'Забрать в инвентарь';
  }

  if (rewardRarityBadge) {
    rewardRarityBadge.textContent = rarity.name.toUpperCase();
    rewardRarityBadge.className = `reward-rarity-badge ${rarity.class}`;
  }
  if (rewardIconBox) rewardIconBox.textContent = wonItem.icon;
  if (rewardItemName) rewardItemName.textContent = wonItem.name;
  if (rewardItemDesc) rewardItemDesc.textContent = wonItem.desc;
  if (rewardValueAmount) rewardValueAmount.textContent = `${formatNumber(wonItem.cost)} ${getCurrencySymbol()}`;
  if (rewardIncomeAmount) rewardIncomeAmount.textContent = `+${formatNumber(wonItem.income)} ${getCurrencySymbol()}/сек`;
  if (rewardItemCard) rewardItemCard.className = `reward-item-card ${rarity.class}`;
  if (rewardGlowBurst) rewardGlowBurst.style.background = rarity.color || '#818cf8';

  soundManager.playCaseWin(wonItem.rarity);
  triggerHaptic('success');

  if (rouletteContainer) rouletteContainer.style.display = 'none';
  if (caseRewardStage) caseRewardStage.style.display = 'flex';

  updateHeader();
  renderCasesScreen();
  renderInventory();
  updateStatsUI();
  saveGameState();
}

function closeCaseModal() {
  if (isRouletteSpinning) return;
  if (caseOpenModal) caseOpenModal.classList.remove('active');
  soundManager.playTap();
  renderCasesScreen();
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
  if (state.sideJobs) state.sideJobs.forEach(j => j.owned = false);
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
  screenCases: document.getElementById('screenCases'),
  screenRealEstate: document.getElementById('screenRealEstate'),
  screenSettings: document.getElementById('screenSettings')
};

const navTabs = {
  screenWallet: document.getElementById('navTabWallet'),
  screenEarnings: document.getElementById('navTabEarnings'),
  screenBusiness: document.getElementById('navTabBusiness'),
  screenCases: document.getElementById('navTabCases'),
  screenRealEstate: document.getElementById('navTabRealEstate')
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
  if (targetScreenId === 'screenCases') {
    showCasesShopView();
  }
  if (targetScreenId === 'screenRealEstate') {
    renderRealEstate();
    renderLeaderboard();
    updateRebirthUI();
  }

  soundManager.playTap();
  triggerHaptic('light');
}

document.querySelectorAll('.nav-tab, .nav-tab-center').forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.getAttribute('data-screen');
    if (screenId) switchScreen(screenId);
  });
});

// Переключатель подвкладок внутри Активов (Каталог / Лидерборд / Престиж)
function switchRealEstateSubtab(tabName) {
  [subtabCatalog, subtabLeaderboard, subtabRebirth].forEach(btn => {
    if (btn) btn.classList.remove('active');
  });
  [catalogSection, leaderboardSection, rebirthSection].forEach(sec => {
    if (sec) sec.classList.remove('active');
  });

  if (tabName === 'catalog') {
    if (subtabCatalog) subtabCatalog.classList.add('active');
    if (catalogSection) catalogSection.classList.add('active');
    renderRealEstate();
  } else if (tabName === 'leaderboard') {
    if (subtabLeaderboard) subtabLeaderboard.classList.add('active');
    if (leaderboardSection) leaderboardSection.classList.add('active');
    renderLeaderboard();
  } else if (tabName === 'rebirth') {
    if (subtabRebirth) subtabRebirth.classList.add('active');
    if (rebirthSection) rebirthSection.classList.add('active');
    updateRebirthUI();
  }
}

subtabCatalog?.addEventListener('click', () => switchRealEstateSubtab('catalog'));
subtabLeaderboard?.addEventListener('click', () => switchRealEstateSubtab('leaderboard'));
subtabRebirth?.addEventListener('click', () => switchRealEstateSubtab('rebirth'));

if (headerRebirthBadge) {
  headerRebirthBadge.addEventListener('click', () => {
    switchScreen('screenRealEstate');
    switchRealEstateSubtab('rebirth');
  });
}

// Кнопка вызова модалки перерождения
btnDoRebirth?.addEventListener('click', () => {
  const nextMult = getRebirthMultiplier(state.rebirthCount + 1);
  modalNewMultiplier.textContent = `x${nextMult.toFixed(1)}`;
  rebirthModal.classList.add('active');
});

btnCancelRebirth?.addEventListener('click', () => {
  rebirthModal.classList.remove('active');
});

btnConfirmRebirth?.addEventListener('click', () => {
  rebirthModal.classList.remove('active');
  performRebirth();
});

// ==========================================
// СЛУШАТЕЛИ КЕЙСОВ И ИНВЕНТАРЯ
// ==========================================

btnOpenBronzeCase?.addEventListener('click', () => openCase('bronze'));
btnOpenSilverCase?.addEventListener('click', () => openCase('silver'));
btnOpenDiamondCase?.addEventListener('click', () => openCase('diamond'));
btnOpenPropertyCase?.addEventListener('click', () => openCase('property'));

btnToggleInventory?.addEventListener('click', toggleCasesViews);
btnBackToCases?.addEventListener('click', showCasesShopView);

document.querySelectorAll('.inv-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.inv-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.getAttribute('data-filter') || 'all';
    renderInventory(filter);
    soundManager.playTap();
  });
});

btnCloseCaseModal?.addEventListener('click', closeCaseModal);
btnCaseCollect?.addEventListener('click', closeCaseModal);

btnCaseReopen?.addEventListener('click', () => {
  if (currentOpeningCaseId) {
    if (state.balance < CASE_TYPES[currentOpeningCaseId].cost) {
      soundManager.playError();
      triggerHaptic('error');
      return;
    }
    openCase(currentOpeningCaseId);
  }
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

      // Мерджим подработки
      if (Array.isArray(saved.sideJobs)) {
        state.sideJobs.forEach(defaultJob => {
          const found = saved.sideJobs.find(j => j.id === defaultJob.id);
          if (found && typeof found.owned === 'boolean') {
            defaultJob.owned = found.owned;
          }
        });
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

      // Мерджим инвентарь (предметы из кейсов)
      if (saved.inventory && typeof saved.inventory === 'object') {
        state.inventory = saved.inventory;
      } else {
        state.inventory = {};
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
  state.sideJobs = JSON.parse(JSON.stringify(DEFAULT_SIDE_JOBS));
  state.businesses = JSON.parse(JSON.stringify(DEFAULT_BUSINESSES));
  state.realEstate = JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE));
  state.airline = JSON.parse(JSON.stringify(DEFAULT_AIRLINE));
  state.inventory = {};
  state.stats = { totalEarned: 0, totalTaps: 0, playTimeSeconds: 0 };

  soundManager.setVolume(state.volume);
  vibrationToggle.checked = true;

  applyTheme(state.tapLevel);
  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  renderEarningsScreen();
  renderSideJobs();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  renderCasesScreen();
  renderInventory();
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
  renderCasesScreen();
  renderInventory();
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
