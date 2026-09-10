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

// 9 бизнесов (от 1 млн до 1 трлн руб)
// Первая прокачка автофарма стоит строго 1 000 000 рублей по ТЗ!
// 21 бизнес (от 1 млн руб до 120 секстиллионов)
// Разблокируются по уровням перерождений (reqRebirth: 0..25)
const DEFAULT_BUSINESSES = [
  {
    id: 'coffee',
    name: 'Франшиза кофеен',
    icon: '☕',
    desc: 'Сеть стильных кофеен с крафтовым зерном и стабильным потоком гостей.',
    baseCost: 1000000,
    baseIncome: 2500,
    count: 0,
    reqRebirth: 0
  },
  {
    id: 'carwash',
    name: 'Автомойка 24/7',
    icon: '🚗',
    desc: 'Бесконтактная мойка самообслуживания на оживленном шоссе.',
    baseCost: 5000000,
    baseIncome: 15000,
    count: 0,
    reqRebirth: 0
  },
  {
    id: 'barbershop',
    name: 'Барбершоп & SPA',
    icon: '✂️',
    desc: 'Премиальный салон мужского стиля с зоной отдыха.',
    baseCost: 25000000,
    baseIncome: 80000,
    count: 0,
    reqRebirth: 0
  },
  {
    id: 'it_company',
    name: 'IT-компания SaaS',
    icon: '💻',
    desc: 'Разработка мобильных приложений и AI-сервисов по подписке.',
    baseCost: 120000000,
    baseIncome: 450000,
    count: 0,
    reqRebirth: 0
  },
  {
    id: 'bank',
    name: 'Частный Банк',
    icon: '🏛️',
    desc: 'Управление инвестициями, выдача займов и венчурный фонд.',
    baseCost: 600000000,
    baseIncome: 2500000,
    count: 0,
    reqRebirth: 0
  },
  {
    id: 'hotel_chain',
    name: 'Сеть отелей 5★',
    icon: '🏨',
    desc: 'Роскошные курортные отели с казино и вертолетными площадками.',
    baseCost: 3000000000,
    baseIncome: 14000000,
    count: 0,
    reqRebirth: 1
  },
  {
    id: 'oil_company',
    name: 'Нефтяная корпорация',
    icon: '🛢️',
    desc: 'Добыча, переработка черного золота и международный экспорт.',
    baseCost: 20000000000,
    baseIncome: 100000000,
    count: 0,
    reqRebirth: 1
  },
  {
    id: 'space_corp',
    name: 'Аэрокосмическая фирма',
    icon: '🚀',
    desc: 'Орбитальные полеты, добыча ресурсов на астероидах и спутники.',
    baseCost: 150000000000,
    baseIncome: 800000000,
    count: 0,
    reqRebirth: 2
  },
  {
    id: 'quantum_ai',
    name: 'Квантовая ИИ-корпорация',
    icon: '🧠',
    desc: 'Суперкомпьютеры на квантовых чипах и глобальные нейросети.',
    baseCost: 1000000000000,
    baseIncome: 6000000000,
    count: 0,
    reqRebirth: 2
  },
  {
    id: 'fusion_energy',
    name: 'Завод термоядерных реакторов',
    icon: '⚛️',
    desc: 'Чистая энергия синтеза изотопов водорода для целых континентов.',
    baseCost: 8000000000000,
    baseIncome: 50000000000,
    count: 0,
    reqRebirth: 3
  },
  {
    id: 'lunar_mining',
    name: 'Лунная база добычи гелия-3',
    icon: '🌖',
    desc: 'Автономные комбайны перерабатывают лунный реголит на экспорт.',
    baseCost: 60000000000000,
    baseIncome: 400000000000,
    count: 0,
    reqRebirth: 3
  },
  {
    id: 'orbital_shipyard',
    name: 'Орбитальная мегаверфь',
    icon: '🛸',
    desc: 'Строительство колониальных звездолетов на геостационарной орбите.',
    baseCost: 500000000000000,
    baseIncome: 3500000000000,
    count: 0,
    reqRebirth: 5
  },
  {
    id: 'space_elevator',
    name: 'Космический лифт Земля-Орбита',
    icon: '🛰️',
    desc: 'Углеродный нанотрос высотой 36 000 км с непрерывной доставкой грузов.',
    baseCost: 4000000000000000,
    baseIncome: 30000000000000,
    count: 0,
    reqRebirth: 5
  },
  {
    id: 'dyson_swarm',
    name: 'Сфера Дайсона вокруг Солнца',
    icon: '☀️',
    desc: 'Миллионы зеркал улавливают 100% энергии солнечного излучения.',
    baseCost: 35000000000000000,
    baseIncome: 280000000000000,
    count: 0,
    reqRebirth: 8
  },
  {
    id: 'interstellar_trade',
    name: 'Межзвездная торговая гильдия',
    icon: '🌌',
    desc: 'Варп-караваны между звездными системами с экзотическими ресурсами.',
    baseCost: 300000000000000000,
    baseIncome: 2500000000000000,
    count: 0,
    reqRebirth: 8
  },
  {
    id: 'antimatter_factory',
    name: 'Коллайдерная фабрика антиматерии',
    icon: '⚡',
    desc: 'Синтез килограммов чистого антивещества высочайшей энергоемкости.',
    baseCost: 2500000000000000000,
    baseIncome: 22000000000000000,
    count: 0,
    reqRebirth: 12
  },
  {
    id: 'stellar_forge',
    name: 'Генератор искусственных звезд',
    icon: '🌟',
    desc: 'Создание нейтронных звезд и белых карликов для питания цивилизации.',
    baseCost: 20000000000000000000,
    baseIncome: 180000000000000000,
    count: 0,
    reqRebirth: 12
  },
  {
    id: 'terraforming_corp',
    name: 'Корпорация терраформирования планет',
    icon: '🪐',
    desc: 'Превращение необитаемых миров в цветущие райские оазисы за годы.',
    baseCost: 180000000000000000000,
    baseIncome: 1700000000000000000,
    count: 0,
    reqRebirth: 18
  },
  {
    id: 'intergalactic_web',
    name: 'Межгалактический квантовый интернет',
    icon: '🌐',
    desc: 'Мгновенная передача данных сквозь световые года через квантовую запутанность.',
    baseCost: 1500000000000000000000,
    baseIncome: 15000000000000000000,
    count: 0,
    reqRebirth: 18
  },
  {
    id: 'multiverse_bank',
    name: 'Банк Мультивселенной',
    icon: '🏛️',
    desc: 'Инвестиции в триллионы параллельных реальностей одновременно.',
    baseCost: 15000000000000000000000,
    baseIncome: 160000000000000000000,
    count: 0,
    reqRebirth: 25
  },
  {
    id: 'dimension_forge',
    name: 'Архитектура высших измерений',
    icon: '🌀',
    desc: 'Повелевание пространством, временем и физическими законами вселенной.',
    baseCost: 120000000000000000000000,
    baseIncome: 1400000000000000000000,
    count: 0,
    reqRebirth: 25
  }
];

// Каталог элитного имущества (16 объектов: автомобили, виллы, особняки, яхты, острова)
// Каждый объект оснащен детальным меню, фотографиями, улучшениями и системой флиппинга (+35% за 1 час)
const DEFAULT_REAL_ESTATE = [
  {
    id: 'sedan',
    category: 'Автомобиль',
    name: 'Бизнес-седан V6',
    icon: '🚗',
    desc: 'Комфортный немецкий седан для деловых поездок по городу.',
    cost: 500000,
    owned: false,
    location: 'Москва, Кутузовский пр-т',
    photo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'tuning', name: 'Чип-тюнинг Stage 2', icon: '⚙️', cost: 150000, bonusValue: 250000, bought: false },
      { id: 'interior', name: 'Кожаный салон Nappa', icon: '🛋️', cost: 200000, bonusValue: 350000, bought: false }
    ]
  },
  {
    id: 'sportscar',
    category: 'Автомобиль',
    name: 'Спорткупе GT',
    icon: '🏎️',
    desc: 'Итальянский суперкар с рычащим двигателем и разгоном до сотни за 2.9 сек.',
    cost: 3500000,
    owned: false,
    location: 'Сочи Автодром',
    photo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'exhaust', name: 'Титановый выхлоп Akrapovič', icon: '🔥', cost: 900000, bonusValue: 1500000, bought: false },
      { id: 'carbon', name: 'Карбоновый аэро-обвес', icon: '🏎️', cost: 1200000, bonusValue: 2000000, bought: false }
    ]
  },
  {
    id: 'hypercar',
    category: 'Автомобиль',
    name: 'Cyber-гиперкар 1500 л.с.',
    icon: '⚡',
    desc: 'Эксклюзивный электрический болид из титана и углеродного волокна.',
    cost: 25000000,
    owned: false,
    location: 'Нюрбургринг, Германия',
    photo: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'telemetry', name: 'Спутниковая гоночная телеметрия', icon: '📡', cost: 6000000, bonusValue: 10000000, bought: false },
      { id: 'ceramic', name: 'Карбон-керамическая тормозная система', icon: '🛑', cost: 8000000, bonusValue: 13000000, bought: false }
    ]
  },
  {
    id: 'modern_villa',
    category: 'Недвижимость',
    name: 'Современная эко-вилла',
    icon: '🏡',
    desc: 'Стильная двухэтажная вилла из панорамного стекла и натурального дерева с садом.',
    cost: 50000000,
    owned: false,
    location: 'Серебряный Бор, Москва',
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'pool', name: 'Инфинити-бассейн с подогревом', icon: '🏊‍♂️', cost: 12000000, bonusValue: 20000000, bought: false },
      { id: 'solar', name: 'Солнечная электростанция и Умный дом', icon: '☀️', cost: 10000000, bonusValue: 16000000, bought: false }
    ]
  },
  {
    id: 'penthouse',
    category: 'Недвижимость',
    name: 'Пентхаус в небоскребе',
    icon: '🏢',
    desc: 'Двухуровневые апартаменты на 85-м этаже с панорамным видом на всю столицу.',
    cost: 120000000,
    owned: false,
    location: 'Москва-Сити, Башня Федерация',
    photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'terrace', name: 'Панорамная терраса с джакузи', icon: '🌆', cost: 30000000, bonusValue: 50000000, bought: false },
      { id: 'wine_cellar', name: 'Коллекционный винный погреб', icon: '🍷', cost: 20000000, bonusValue: 35000000, bought: false }
    ]
  },
  {
    id: 'mansion',
    category: 'Недвижимость',
    name: 'Загородная резиденция',
    icon: '🏰',
    desc: 'Особняк в закрытом поселке с парком, собственным озером и круглосуточной охраной.',
    cost: 300000000,
    owned: false,
    location: 'Рублёво-Успенское шоссе',
    photo: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'helipad', name: 'Личная вертолетная площадка', icon: '🚁', cost: 70000000, bonusValue: 120000000, bought: false },
      { id: 'spa', name: 'SPA-комплекс, сауна и хаммам', icon: '🧖', cost: 50000000, bonusValue: 90000000, bought: false }
    ]
  },
  {
    id: 'superyacht',
    category: 'Роскошь',
    name: '80м Суперяхта с вертолетом',
    icon: '🛥️',
    desc: 'Личный круизный лайнер с бассейнами, кинотеатром и вертолетной площадкой.',
    cost: 650000000,
    owned: false,
    location: 'Монте-Карло, Монако',
    photo: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'stabilizer', name: 'Гироскопические стабилизаторы качки', icon: '🌊', cost: 150000000, bonusValue: 260000000, bought: false },
      { id: 'sub', name: 'Мини-субмарина для рифов', icon: '🤿', cost: 180000000, bonusValue: 300000000, bought: false }
    ]
  },
  {
    id: 'island',
    category: 'Недвижимость',
    name: 'Личный тропический остров',
    icon: '🏝️',
    desc: 'Собственный райский уголок в океане с автономным энергоснабжением и белым песком.',
    cost: 1500000000,
    owned: false,
    location: 'Мальдивы, Атолл Баа',
    photo: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'runway', name: 'Взлетно-посадочная полоса для джетов', icon: '🛫', cost: 350000000, bonusValue: 600000000, bought: false },
      { id: 'bungalow', name: 'Комплекс бунгало над водой лагуны', icon: '🛖', cost: 300000000, bonusValue: 520000000, bought: false }
    ]
  },
  {
    id: 'dubai_palace',
    category: 'Недвижимость',
    name: 'Дворец на Palm Jumeirah',
    icon: '🕌',
    desc: 'Архитектурный шедевр восточной роскоши с мраморными залами и частной бухтой.',
    cost: 3500000000,
    owned: false,
    location: 'Дубай, ОАЭ',
    photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'private_beach', name: 'Частный пляж с золотым песком', icon: '🏖️', cost: 800000000, bonusValue: 1400000000, bought: false },
      { id: 'garage', name: 'Подземный автомузей на 25 суперкаров', icon: '🏎️', cost: 700000000, bonusValue: 1200000000, bought: false }
    ]
  },
  {
    id: 'alpine_chalet',
    category: 'Недвижимость',
    name: 'Альпийское шале Grand Luxe',
    icon: '🏔️',
    desc: 'Эксклюзивное шале у заснеженных склонов с панорамными каминами и винным залом.',
    cost: 8000000000,
    owned: false,
    location: 'Куршевель 1850, Франция',
    photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'ski_lift', name: 'Личный скоростной подъемник Ski-In', icon: '⛷️', cost: 1800000000, bonusValue: 3100000000, bought: false },
      { id: 'thermal_pool', name: 'Горячий термальный источник под звездами', icon: '♨️', cost: 1500000000, bonusValue: 2600000000, bought: false }
    ]
  },
  {
    id: 'como_villa',
    category: 'Недвижимость',
    name: 'Вилла на Озере Комо',
    icon: '🏛️',
    desc: 'Неоклассическая историческая вилла с парком скульптур и частной набережной.',
    cost: 18000000000,
    owned: false,
    location: 'Озеро Комо, Италия',
    photo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'botanical_park', name: 'Ботанический парк с вековыми кипарисами', icon: '🌳', cost: 4000000000, bonusValue: 7000000000, bought: false },
      { id: 'riva_dock', name: 'Мраморная гавань для катеров Riva', icon: '⛵', cost: 3500000000, bonusValue: 6000000000, bought: false }
    ]
  },
  {
    id: 'beverly_hills',
    category: 'Недвижимость',
    name: 'Мега-особняк в Беверли-Хиллз',
    icon: '🌴',
    desc: 'Огромное ультрасовременное поместье голливудских звезд с панорамой Лос-Анджелеса.',
    cost: 45000000000,
    owned: false,
    location: 'Лос-Анджелес, США',
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'imax_cinema', name: 'Частный кинотеатр IMAX Dolby Atmos', icon: '🎬', cost: 9000000000, bonusValue: 16000000000, bought: false },
      { id: 'tennis_complex', name: 'Теннисный стадион с трибунами и светом', icon: '🎾', cost: 8000000000, bonusValue: 14000000000, bought: false }
    ]
  },
  {
    id: 'scottish_castle',
    category: 'Недвижимость',
    name: 'Шотландский Замок Хайленд',
    icon: '🏰',
    desc: 'Древний каменный замок с башнями, гербовым залом и 500 гектарами частных угодий.',
    cost: 120000000000,
    owned: false,
    location: 'Хайлендс, Шотландия',
    photo: 'https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'knight_museum', name: 'Оружейная палата и музей рыцарей', icon: '🛡️', cost: 25000000000, bonusValue: 44000000000, bought: false },
      { id: 'forest_reserve', name: 'Заповедный лес и охотничий клуб', icon: '🌲', cost: 30000000000, bonusValue: 52000000000, bought: false }
    ]
  },
  {
    id: 'tokyo_tower',
    category: 'Недвижимость',
    name: 'Небоскреб Ginza Grand Tower',
    icon: '🗼',
    desc: 'Высокотехнологичная башня в центре Токио с кибернетическим управлением.',
    cost: 350000000000,
    owned: false,
    location: 'Токио, Япония',
    photo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'observatory', name: 'Стеклянная смотровая галерея над городом', icon: '🔭', cost: 70000000000, bonusValue: 125000000000, bought: false },
      { id: 'quantum_shield', name: 'Квантовая система комплексной безопасности', icon: '🔒', cost: 80000000000, bonusValue: 140000000000, bought: false }
    ]
  },
  {
    id: 'mega_yacht_ice',
    category: 'Роскошь',
    name: 'Ледокольная мегаяхта Explorer 140м',
    icon: '🚢',
    desc: 'Автономная экспедиционная суперяхта высшего ледового класса для кругосветных плаваний.',
    cost: 900000000000,
    owned: false,
    location: 'Антарктика & Арктика',
    photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'heli_hangar_twin', name: 'Двойной ангар для двух вертолетов', icon: '🚁', cost: 180000000000, bonusValue: 320000000000, bought: false },
      { id: 'deep_lab', name: 'Глубоководная батискаф-лаборатория', icon: '🔬', cost: 200000000000, bonusValue: 360000000000, bought: false }
    ]
  },
  {
    id: 'orbital_station',
    category: 'Недвижимость',
    name: 'Орбитальный отель «Alpha Star»',
    icon: '🛰️',
    desc: 'Частная орбитальная космическая станция с панорамными куполами с видом на Землю.',
    cost: 2500000000000,
    owned: false,
    location: 'Орбита Земли (400 км)',
    photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'gravity_module', name: 'Модуль искусственной гравитации', icon: '🪐', cost: 500000000000, bonusValue: 900000000000, bought: false },
      { id: 'space_taxi', name: 'Многоразовый космический шаттл', icon: '🚀', cost: 600000000000, bonusValue: 1100000000000, bought: false }
    ]
  },
  {
    id: 'cyber_penthouse',
    category: 'Недвижимость',
    name: 'Кибер-пентхаус Neo-Tokyo',
    icon: '🏙️',
    desc: 'Двухуровневый пентхаус на 180 этаже башни Синдзюку с голографическим садом и посадочной площадкой для спидеров.',
    cost: 1200000000000,
    owned: false,
    location: 'Токио, Нео-Синдзюку',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'holo_garden', name: 'Голографический сад сакуры', icon: '🌸', cost: 250000000000, bonusValue: 400000000000, bought: false },
      { id: 'shield_matrix', name: 'Силовое защитное поле', icon: '🛡️', cost: 350000000000, bonusValue: 550000000000, bought: false }
    ]
  },
  {
    id: 'underwater_palace',
    category: 'Недвижимость',
    name: 'Подводный коралловый дворец',
    icon: '🌊',
    desc: 'Атлантический дворец на глубине 50 метров из сверхпрочного акрила с обзором кораллового рифа 360°.',
    cost: 2500000000000,
    owned: false,
    location: 'Мальдивы, Атолл Ари',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'sub_dock', name: 'Причал батискафов Triton', icon: '🤿', cost: 600000000000, bonusValue: 950000000000, bought: false },
      { id: 'coral_spa', name: 'SPA-хаммам с морской водой', icon: '🧖‍♂️', cost: 750000000000, bonusValue: 1200000000000, bought: false }
    ]
  },
  {
    id: 'aspen_resort',
    category: 'Недвижимость',
    name: 'Частный курорт в Аспене',
    icon: '🏔️',
    desc: 'Целая заснеженная гора с частными подъемниками, вертолетным ангаром и спа-отелем из канадского кедра.',
    cost: 6000000000000,
    owned: false,
    location: 'Колорадо, Аспен',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'heated_slopes', name: 'Подогрев горнолыжных трасс', icon: '⛷️', cost: 1500000000000, bonusValue: 2400000000000, bought: false },
      { id: 'chalet_heli', name: 'Парк вертолетов Airbus H160', icon: '🚁', cost: 1800000000000, bonusValue: 2900000000000, bought: false }
    ]
  },
  {
    id: 'floating_megacity',
    category: 'Недвижимость',
    name: 'Автономный океанический полис',
    icon: '🏝️',
    desc: 'Искусственный плавучий остров-город в нейтральных водах с собственной конституцией, банком и аэропортом.',
    cost: 15000000000000,
    owned: false,
    location: 'Тихий океан, Экватор',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'wave_power', name: 'Океаническая гео-электростанция', icon: '⚡', cost: 3500000000000, bonusValue: 5600000000000, bought: false },
      { id: 'superyacht_marina', name: 'Глубоководная гавань на 50 мегаяхт', icon: '🛥️', cost: 4500000000000, bonusValue: 7200000000000, bought: false }
    ]
  },
  {
    id: 'lunar_citadel',
    category: 'Недвижимость',
    name: 'Лунная цитадель в Море Спокойствия',
    icon: '🌖',
    desc: 'Герметичный биосферный комплекс под защитным куполом с искусственной гравитацией и видом на восход Земли.',
    cost: 45000000000000,
    owned: false,
    location: 'Луна, Залив Радуги',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'gravity_gen', name: 'Генератор земной гравитации 1G', icon: '🪐', cost: 11000000000000, bonusValue: 18000000000000, bought: false },
      { id: 'earth_observatory', name: 'Телескоп высокого разрешения', icon: '🔭', cost: 13000000000000, bonusValue: 21000000000000, bought: false }
    ]
  },
  {
    id: 'mars_biosphere',
    category: 'Недвижимость',
    name: 'Марсианская биосферная вилла',
    icon: '🪐',
    desc: 'Огромный терраформированный кратер с сосновым бором, пресным озером и личным космодромом на Марсе.',
    cost: 120000000000000,
    owned: false,
    location: 'Марс, Долина Маринер',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'atmosphere_gen', name: 'Генератор кислородной атмосферы', icon: '💨', cost: 28000000000000, bonusValue: 46000000000000, bought: false },
      { id: 'mars_spaceport', name: 'Частный шаттл-порт для межпланетных перелетов', icon: '🚀', cost: 35000000000000, bonusValue: 58000000000000, bought: false }
    ]
  },
  {
    id: 'orbital_hotel_ring',
    category: 'Недвижимость',
    name: 'Кольцевой орбитальный отель-станция',
    icon: '🛰️',
    desc: 'Вращающаяся станция диаметром 2 километра на геостационарной орбите. Люкс-сьюты с видом на континенты.',
    cost: 350000000000000,
    owned: false,
    location: 'Околоземная орбита (400 км)',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'zero_g_casino', name: 'Казино в невесомости Zero-G', icon: '🎰', cost: 80000000000000, bonusValue: 130000000000000, bought: false },
      { id: 'space_dock_vip', name: 'VIP-шлюзы для частных звездолетов', icon: '🛸', cost: 100000000000000, bonusValue: 165000000000000, bought: false }
    ]
  },
  {
    id: 'galaxy_sector',
    category: 'Недвижимость',
    name: 'Частный галактический сектор',
    icon: '🌌',
    desc: 'Целая звездная система с тремя обитаемыми планетами, астероидным кольцом из чистого золота и пространственными вратами.',
    cost: 1000000000000000,
    owned: false,
    location: 'Сектор Альфа Центавра',
    onSale: false,
    saleTimeRemaining: 0,
    salePrice: 0,
    saleCompleted: false,
    upgrades: [
      { id: 'warp_gate', name: 'Врата межпространственного перехода', icon: '🌀', cost: 240000000000000, bonusValue: 390000000000000, bought: false },
      { id: 'dyson_crown', name: 'Венец управления звездной системой', icon: '👑', cost: 300000000000000, bonusValue: 500000000000000, bought: false }
    ]
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

// ==========================================
// КОНФИГУРАЦИЯ: АЛМАЗНЫЙ ПРЕСТИЖ & МАГАЗИН КРИСТАЛЛОВ
// ==========================================
const PRESTIGE_REQ_EARNINGS = 1000000000000000; // 1 Квадриллион рублей (1e15)
const MAX_PRESTIGE_COUNT = 10;
// Пассивная добыча кристаллов в секунду для каждого уровня престижа (0..10)
// Уровень 1 = 0.01 💎/сек, Уровень 10 = 1.00 💎/сек по ТЗ
const PRESTIGE_CRYSTAL_RATES = [0, 0.01, 0.03, 0.06, 0.10, 0.20, 0.35, 0.55, 0.75, 0.90, 1.00];

const CRYSTAL_SHOP_ITEMS = [
  {
    id: 'income_mult',
    name: 'Алмазный Умножитель Дохода',
    icon: '✨',
    desc: 'Увеличивает весь пассивный доход на +25% за каждый уровень.',
    maxLevel: 10,
    baseCost: 10,
    costMult: 1.8,
    bonusPerLevel: 0.25,
    getBonusText: (lvl) => `+${lvl * 25}% ко всему доходу`
  },
  {
    id: 'tap_mult',
    name: 'Энергетический Кристалл Клика',
    icon: '⚡',
    desc: 'Увеличивает силу клика на +30% за каждый уровень.',
    maxLevel: 10,
    baseCost: 8,
    costMult: 1.7,
    bonusPerLevel: 0.30,
    getBonusText: (lvl) => `+${lvl * 30}% к силе тапа`
  },
  {
    id: 'crystal_haste',
    name: 'Хроно-Ускоритель Кристаллов',
    icon: '🔮',
    desc: 'Ускоряет пассивную генерацию кристаллов на +20% за каждый уровень.',
    maxLevel: 5,
    baseCost: 25,
    costMult: 2.2,
    bonusPerLevel: 0.20,
    getBonusText: (lvl) => `+${lvl * 20}% к скорости кристаллов`
  },
  {
    id: 'starting_capital',
    name: 'Алмазный Стартовый Капитал',
    icon: '💼',
    desc: 'Дает стартовый баланс сразу после любого вайпа или перерождения.',
    maxLevel: 5,
    baseCost: 15,
    costMult: 2.0,
    bonusPerLevel: 1,
    getBonusText: (lvl) => {
      const caps = [0, 500000, 5000000, 50000000, 500000000, 5000000000];
      return lvl > 0 ? `+${formatNumber(caps[lvl])} ₽ на старте` : '0 ₽';
    }
  },
  {
    id: 'discount',
    name: 'VIP-Статус Межгалактического Инвестора',
    icon: '🏷️',
    desc: 'Снижает стоимость покупки всех бизнесов и недвижимости на 5% за уровень (до 25%).',
    maxLevel: 5,
    baseCost: 20,
    costMult: 2.0,
    bonusPerLevel: 0.05,
    getBonusText: (lvl) => `-${lvl * 5}% стоимость объектов`
  },
  {
    id: 'rainbow_magnet',
    name: 'Радужный Магнит',
    icon: '🌈',
    desc: 'Увеличивает шанс появления Радужного Доллара на +50% и продлевает его эффект на +10 сек.',
    maxLevel: 5,
    baseCost: 30,
    costMult: 2.5,
    bonusPerLevel: 0.50,
    getBonusText: (lvl) => `+${lvl * 50}% шанс спавна, +${lvl * 10}с длительность`
  }
];

// Вымышленный лидерборд богатейших людей (Forbes)
// Первое место ровно 1 000 000 000 рублей по требованию ТЗ!
const LEADERBOARD_BOTS = [
  { id: 'b1', name: 'Император Астрал', company: 'OmniVerse Singularity', worth: 100000000000000000000, avatar: '🌌' },
  { id: 'b2', name: 'Властелин Кронос', company: 'Temporal Continuum Corp', worth: 25000000000000000000, avatar: '⏳' },
  { id: 'b3', name: 'Кибероракул Нео', company: 'Matrix Quantum Mind', worth: 5000000000000000000, avatar: '🤖' },
  { id: 'b4', name: 'Серафим Голдман', company: 'Interstellar Galactic Bank', worth: 1200000000000000000, avatar: '👑' },
  { id: 'b5', name: 'Герцог Дайсон', company: 'Solar Dyson Syndicate', worth: 300000000000000000, avatar: '☀️' },
  { id: 'b6', name: 'Барон Антиматерии', company: 'Collider Energy Holdings', worth: 75000000000000000, avatar: '⚡' },
  { id: 'b7', name: 'Адмирал Скайуорд', company: 'Orbital Heavy Fleet', worth: 18000000000000000, avatar: '🛸' },
  { id: 'b8', name: 'Лорд Терраформер', company: 'Mars Genesis Corp', worth: 4500000000000000, avatar: '🪐' },
  { id: 'b9', name: 'Селена фон Луна', company: 'Lunar Helium Syndicate', worth: 1200000000000000, avatar: '🌖' },
  { id: 'b10', name: 'Квант Магнат Ли', company: 'Deep Quantum Core', worth: 300000000000000, avatar: '🧠' },
  { id: 'b11', name: 'Александр Громов', company: 'Global Energy Corp', worth: 75000000000000, avatar: '🛢️' },
  { id: 'b12', name: 'Виктория Ротшильд', company: 'Rothschild Financial', worth: 20000000000000, avatar: '💎' },
  { id: 'b13', name: 'Герман фон Бауэр', company: 'Bauer Heavy Industries', worth: 5000000000000, avatar: '🏭' },
  { id: 'b14', name: 'Маркус Вэйлор', company: 'Quantum AI Systems', worth: 1500000000000, avatar: '💻' },
  { id: 'b15', name: 'Елена Морозова', company: 'Morozov Retail Group', worth: 500000000000, avatar: '🏬' },
  { id: 'b16', name: 'Дэвид Чэнь', company: 'Dragon Oceanic Logistics', worth: 200000000000, avatar: '🚢' },
  { id: 'b17', name: 'Роман Заславский', company: 'Zaslavsky Gold Mines', worth: 80000000000, avatar: '⛏️' },
  { id: 'b18', name: 'София Бельмонте', company: 'Haute Couture Group', worth: 35000000000, avatar: '✨' },
  { id: 'b19', name: 'Артем Смирнов', company: 'PharmLife Biotech', worth: 15000000000, avatar: '🧪' },
  { id: 'b20', name: 'Кристиан Вульф', company: 'Wolf Express Delivery', worth: 6000000000, avatar: '📦' },
  { id: 'b21', name: 'Хироши Танака', company: 'Cybernetic Prosthetics', worth: 2500000000, avatar: '🦾' },
  { id: 'b22', name: 'Изабелла Фонсека', company: 'Amazonia Eco Estate', worth: 1000000000, avatar: '🌿' },
  { id: 'b23', name: 'Оливер Смит', company: 'AeroSky Private Jet', worth: 500000000, avatar: '✈️' },
  { id: 'b24', name: 'Наталья Соколова', company: 'Imperial Vodka & Food', worth: 250000000, avatar: '🍸' },
  { id: 'b25', name: 'Маттео Риччи', company: 'Milano Supercar Club', worth: 120000000, avatar: '🏎️' },
  { id: 'b26', name: 'Олег Воронов', company: 'Nordic Timber & Metal', worth: 60000000, avatar: '🌲' },
  { id: 'b27', name: 'Клэр Дюбуа', company: 'Boutique Hotel Collection', worth: 30000000, avatar: '🏨' },
  { id: 'b28', name: 'Юсуф аль-Мансур', company: 'Desert Pearl Jewelers', worth: 15000000, avatar: '💍' },
  { id: 'b29', name: 'Стивен Холл', company: 'Silicon Venture Studio', worth: 8000000, avatar: '📱' },
  { id: 'b30', name: 'Максим Лебедев', company: 'Early Bird Startups', worth: 3000000, avatar: '🌱' }
];

// Требования капитала для каждого из 30 перерождений (максимум 30x)
const REBIRTH_REQUIREMENTS = [
  15000000,              // 1: 15 млн
  40000000,              // 2: 40 млн
  100000000,             // 3: 100 млн
  250000000,             // 4: 250 млн
  600000000,             // 5: 600 млн
  1500000000,            // 6: 1.5 млрд
  3500000000,            // 7: 3.5 млрд
  8000000000,            // 8: 8 млрд
  20000000000,           // 9: 20 млрд
  50000000000,           // 10: 50 млрд
  120000000000,          // 11: 120 млрд
  300000000000,          // 12: 300 млрд
  750000000000,          // 13: 750 млрд
  2000000000000,         // 14: 2 трлн
  5000000000000,         // 15: 5 трлн
  12000000000000,        // 16: 12 трлн
  30000000000000,        // 17: 30 трлн
  75000000000000,        // 18: 75 трлн
  200000000000000,       // 19: 200 трлн
  500000000000000,       // 20: 500 трлн
  1200000000000000,      // 21: 1.2 квадрлн
  3000000000000000,      // 22: 3 квадрлн
  7500000000000000,      // 23: 7.5 квадрлн
  20000000000000000,     // 24: 20 квадрлн
  50000000000000000,     // 25: 50 квадрлн
  120000000000000000,    // 26: 120 квадрлн
  300000000000000000,    // 27: 300 квадрлн
  750000000000000000,    // 28: 750 квадрлн
  2000000000000000000,   // 29: 2 квинтлн
  5000000000000000000    // 30: 5 квинтлн
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
  novice: {
    id: 'novice',
    name: 'Кейс «Новичок»',
    cost: 10000,
    icon: '🌱',
    badge: 'СТАРТОВЫЙ БОНУС'
  },
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
  gold: {
    id: 'gold',
    name: 'Золотой кейс',
    cost: 5000000,
    icon: '👑',
    badge: 'ЮВЕЛИРНЫЙ БЛЕСК'
  },
  diamond: {
    id: 'diamond',
    name: 'Алмазный кейс',
    cost: 10000000,
    icon: '💎',
    badge: 'РОСКОШЬ & VIP'
  },
  crypto: {
    id: 'crypto',
    name: 'Крипто-кейс',
    cost: 50000000,
    icon: '🪙',
    badge: 'WEB3 & БЛОКЧЕЙН'
  },
  property: {
    id: 'property',
    name: 'Кейс с имуществом',
    cost: 100000000,
    icon: '🏰',
    badge: 'ЭЛИТНАЯ НЕДВИЖИМОСТЬ'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Киберпанк-кейс',
    cost: 500000000,
    icon: '⚡',
    badge: 'КИБЕР-ТЕХНОЛОГИИ'
  },
  space: {
    id: 'space',
    name: 'Космический кейс',
    cost: 5000000000,
    icon: '🚀',
    badge: 'КОСМИЧЕСКИЙ ЛЮКС'
  },
  mythic: {
    id: 'mythic',
    name: 'Кейс «Властелин Времени»',
    cost: 50000000000,
    icon: '✨',
    badge: 'МИФИЧЕСКИЙ & МУЛЬТИВСЕЛЕННАЯ'
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
  // --- 0. КЕЙС «НОВИЧОК» (10 предметов, стоимость до 10 000 ₽, доход до 100 ₽/с) ---
  { id: 'nov_coin', caseId: 'novice', name: 'Счастливая монетка 1898 года', icon: '🪙', rarity: 'common', cost: 1000, income: 5, desc: 'Старинная медная монетка, приносящая финансовую удачу.' },
  { id: 'nov_wallet', caseId: 'novice', name: 'Кожаный кошелек ручной работы', icon: '👛', rarity: 'common', cost: 2000, income: 10, desc: 'Компактный итальянский кошелек с потайным отделением.' },
  { id: 'nov_pen', caseId: 'novice', name: 'Перьевая ручка Parker', icon: '✒️', rarity: 'common', cost: 3000, income: 15, desc: 'Элегантный пишущий инструмент для подписания первых договоров.' },
  { id: 'nov_player', caseId: 'novice', name: 'Винтажный кассетный плеер', icon: '🎧', rarity: 'rare', cost: 4500, income: 25, desc: 'Стильный ретро-плеер с теплым аналоговым звучанием.' },
  { id: 'nov_lighter', caseId: 'novice', name: 'Зажигалка Zippo Classic', icon: '🔥', rarity: 'rare', cost: 5500, income: 35, desc: 'Надежная хромированная зажигалка с характерным металлическим кликом.' },
  { id: 'nov_sunglasses', caseId: 'novice', name: 'Солнцезащитные очки Aviator', icon: '🕶️', rarity: 'rare', cost: 6500, income: 45, desc: 'Классические темные очки в золотистой оправе.' },
  { id: 'nov_watch', caseId: 'novice', name: 'Кварцевые японские часы', icon: '⌚', rarity: 'epic', cost: 8000, income: 60, desc: 'Точный механизм с сапфировым стеклом и водозащитой.' },
  { id: 'nov_bracelet', caseId: 'novice', name: 'Серебряный браслет удачи', icon: '📿', rarity: 'epic', cost: 9000, income: 75, desc: 'Плетение из чистого серебра с гравировкой знака бесконечности.' },
  { id: 'nov_cufflinks', caseId: 'novice', name: 'Запонки с ониксом', icon: '👔', rarity: 'legendary', cost: 9800, income: 85, desc: 'Изысканное дополнение к деловому костюму начинающего магната.' },
  { id: 'nov_token', caseId: 'novice', name: 'Золотой жетон триумфа', icon: '🏆', rarity: 'mythic', cost: 10000, income: 100, desc: 'Сверкающий золотой медальон, открывающий путь к миллиардам.' },
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
    name: 'Красный алмаз',
    icon: '💎',
    rarity: 'ultra',
    cost: 1000000000000,
    income: 100000000,
    desc: 'УЛЬТРА-МЕГА-АРТЕФАКТ ВСЕЛЕННОЙ! Легендарный чистейший Красный алмаз. Стоимость — 1 ТРИЛЛИОН ₽! Шанс выпадения — 1 к 1 000 000 000 000.'
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
  },
  // --- 3. ЗОЛОТОЙ КЕЙС (10 предметов) ---
  { id: 'gld_pen', caseId: 'gold', name: 'Золотая ручка Montblanc', icon: '✒️', rarity: 'common', cost: 800000, income: 3500, desc: 'Позолоченный пишущий прибор для подписания многомиллионных контрактов.' },
  { id: 'gld_cufflinks', caseId: 'gold', name: 'Запонки с рубинами 750 пробы', icon: '✨', rarity: 'common', cost: 1200000, income: 5500, desc: 'Швейцарское ювелирное мастерство с натуральными бирманскими рубинами.' },
  { id: 'gld_lighter', caseId: 'gold', name: 'Зажигалка S.T. Dupont из золота', icon: '🔥', rarity: 'common', cost: 1800000, income: 8000, desc: 'Французская золотая зажигалка со звонким переливом при открытии.' },
  { id: 'gld_pendant', caseId: 'gold', name: 'Изумрудный кулон «Султан»', icon: '💚', rarity: 'rare', cost: 2600000, income: 12000, desc: 'Колумбийский изумруд чистейшей прозрачности в окружении бриллиантов.' },
  { id: 'gld_bar_small', caseId: 'gold', name: 'Слиток золота 100г 999 пробы', icon: '🪙', rarity: 'rare', cost: 3500000, income: 18000, desc: 'Банковский слиток с сертификатом швейцарского аффинажного завода.' },
  { id: 'gld_ring', caseId: 'gold', name: 'Перстень с сапфиром Cartier', icon: '💍', rarity: 'rare', cost: 4800000, income: 25000, desc: 'Фамильная драгоценность с глубоким синим кашмирским сапфиром.' },
  { id: 'gld_watch', caseId: 'gold', name: 'Часы Rolex Submariner Gold', icon: '⌚', rarity: 'epic', cost: 7000000, income: 40000, desc: 'Легендарные швейцарские часы из 18-каратного желтого золота.' },
  { id: 'gld_necklace', caseId: 'gold', name: 'Бриллиантовое колье Tiffany', icon: '💎', rarity: 'epic', cost: 11000000, income: 70000, desc: 'Сверкающая бриллиантовая нить, сияющая на закрытых светских раутах.' },
  { id: 'gld_tiara', caseId: 'gold', name: 'Королевская тиара с жемчугом', icon: '👑', rarity: 'legendary', cost: 18000000, income: 130000, desc: 'Музейная реликвия европейского монаршего дома.' },
  { id: 'gld_grail', caseId: 'gold', name: 'Золотой Грааль Мидаса', icon: '🏆', rarity: 'mythic', cost: 35000000, income: 300000, desc: 'Мифический золотой кубок, превращающий всё вокруг в богатство.' },

  // --- 5. КРИПТО-КЕЙС (10 предметов) ---
  { id: 'crp_wallet', caseId: 'crypto', name: 'Аппаратный сейф Ledger Gold', icon: '💳', rarity: 'common', cost: 8000000, income: 45000, desc: 'Бронированный крипто-кошелек с биометрическим доступом.' },
  { id: 'crp_asic', caseId: 'crypto', name: 'ASIC-майнер Antminer S21 Pro', icon: '💻', rarity: 'common', cost: 14000000, income: 85000, desc: 'Сверхмощный вычислительный блок для добычи топовых блокчейнов.' },
  { id: 'crp_hydro', caseId: 'crypto', name: 'Гидро-ферма охлаждения', icon: '🌊', rarity: 'common', cost: 22000000, income: 150000, desc: 'Бесшумный дата-центр в диэлектрической жидкости с КПД 99%.' },
  { id: 'crp_node', caseId: 'crypto', name: 'Мастернода валидатора Ethereum', icon: '🌐', rarity: 'rare', cost: 38000000, income: 280000, desc: 'Стейкинг 1000 ETH с автоматическим получением комиссий от глобальной сети.' },
  { id: 'crp_quantum_key', caseId: 'crypto', name: 'Квантовый шифратор сигнатур', icon: '🗝️', rarity: 'rare', cost: 55000000, income: 450000, desc: 'Криптографический модуль, неуязвимый для квантовых суперкомпьютеров.' },
  { id: 'crp_defi', caseId: 'crypto', name: 'Автономный DeFi-арбитражный бот', icon: '📈', rarity: 'rare', cost: 80000000, income: 700000, desc: 'Высокочастотный AI-алгоритм торговли на DEX-биржах в миллисекунды.' },
  { id: 'crp_flash', caseId: 'crypto', name: 'Флешка Сатоши Накамото', icon: '💾', rarity: 'epic', cost: 130000000, income: 1300000, desc: 'Легендарный накопитель с исходным кодом первого блока Genesis.' },
  { id: 'crp_satellite', caseId: 'crypto', name: 'Орбитальный блокчейн-спутник', icon: '🛰️', rarity: 'epic', cost: 220000000, income: 2400000, desc: 'Спутниковый узел связи для межконтинентальных крипто-транзакций.' },
  { id: 'crp_genesis_block', caseId: 'crypto', name: 'Кристалл Первичного Блока', icon: '💎', rarity: 'legendary', cost: 400000000, income: 5000000, desc: 'Физический носитель с нерушимым хешем основания цифровой эры.' },
  { id: 'crp_ai_oracle', caseId: 'crypto', name: 'Квантовый Оракул Сети', icon: '🔮', rarity: 'mythic', cost: 850000000, income: 12000000, desc: 'Всевидящий алгоритм распределенного реестра будущего.' },

  // --- 7. КИБЕРПАНК-КЕЙС (10 предметов) ---
  { id: 'cyb_visor', caseId: 'cyberpunk', name: 'Нейро-очки дополненной реальности', icon: '🥽', rarity: 'common', cost: 80000000, income: 550000, desc: 'Голографический интерфейс с биосканером и трейдером рынков.' },
  { id: 'cyb_deck', caseId: 'cyberpunk', name: 'Кибердека Arasaka Onyx', icon: '📟', rarity: 'common', cost: 140000000, income: 1050000, desc: 'Взлом сетевых протоколов и мгновенный доступ к закрытым базам данных.' },
  { id: 'cyb_arm', caseId: 'cyberpunk', name: 'Бионический титановый манипулятор', icon: '🦾', rarity: 'common', cost: 220000000, income: 1800000, desc: 'Сверхточный протез с микромоторами и позолоченным покрытием.' },
  { id: 'cyb_katana', caseId: 'cyberpunk', name: 'Молекулярная катана Kusanagi', icon: '🗡️', rarity: 'rare', cost: 360000000, income: 3200000, desc: 'Лезвие толщиной в одну молекулу с неоновой плазменной кромкой.' },
  { id: 'cyb_hover', caseId: 'cyberpunk', name: 'Антигравитационный ховерборд Apex', icon: '🛹', rarity: 'rare', cost: 550000000, income: 5200000, desc: 'Полеты над ночными улицами мегаполиса со скоростью 300 км/ч.' },
  { id: 'cyb_drone', caseId: 'cyberpunk', name: 'Боевой AI-дрон «Цербер»', icon: '🛸', rarity: 'rare', cost: 850000000, income: 8500000, desc: 'Автономный дрон-телохранитель с лазерной системой перехвата.' },
  { id: 'cyb_exo', caseId: 'cyberpunk', name: 'Силовой экзоскелет Titan-V', icon: '🛡️', rarity: 'epic', cost: 1400000000, income: 15000000, desc: 'Военный экзокостюм с кинетическими щитами и реактивным ранцем.' },
  { id: 'cyb_sandevistan', caseId: 'cyberpunk', name: 'Военный имплант Sandevistan', icon: '⚡', rarity: 'epic', cost: 2500000000, income: 30000000, desc: 'Ускоряет восприятие и рефлексы владельца в сотни раз.' },
  { id: 'cyb_car', caseId: 'cyberpunk', name: 'Летающий спидер Quadra Turbo', icon: '🏎️', rarity: 'legendary', cost: 4500000000, income: 60000000, desc: 'Реактивный аэрокар для скоростных полетов между небоскребами.' },
  { id: 'cyb_singularity_core', caseId: 'cyberpunk', name: 'Ядро ИИ «Сингулярность»', icon: '🤖', rarity: 'mythic', cost: 9000000000, income: 140000000, desc: 'Истинный сверхразум, способный оптимизировать глобальную экономику.' },

  // --- 8. КОСМИЧЕСКИЙ КЕЙС (10 предметов) ---
  { id: 'spc_meteor', caseId: 'space', name: 'Метеорит с платиной и палладием', icon: '🪨', rarity: 'common', cost: 800000000, income: 6000000, desc: 'Внеземной астероидный фрагмент с плотнейшими драгоценными металлами.' },
  { id: 'spc_suit', caseId: 'space', name: 'Скафандр глубокого космоса EVA', icon: '👨‍🚀', rarity: 'common', cost: 1500000000, income: 12000000, desc: 'Кевларово-графеновый скафандр с радиационной защитой 5 класса.' },
  { id: 'spc_telescope', caseId: 'space', name: 'Космический инфракрасный телескоп', icon: '🔭', rarity: 'common', cost: 2600000000, income: 22000000, desc: 'Сканирование далеких звездных систем в поисках ресурсных планет.' },
  { id: 'spc_rover', caseId: 'space', name: 'Исследовательский марсоход Ares', icon: '🚜', rarity: 'rare', cost: 4200000000, income: 38000000, desc: 'Шестиколесный атомный вездеход для геологической разведки Марса.' },
  { id: 'spc_engine', caseId: 'space', name: 'Ионно-плазменный двигатель V-9', icon: '🚀', rarity: 'rare', cost: 6800000000, income: 65000000, desc: 'Фотонный реактивный привод для межпланетных перелетов.' },
  { id: 'spc_capsule', caseId: 'space', name: 'Капсула с чистой антиматерией', icon: '⚡', rarity: 'rare', cost: 11000000000, income: 110000000, desc: 'Магнитная ловушка с 1 граммом позитронов огромной энергоемкости.' },
  { id: 'spc_station', caseId: 'space', name: 'Орбитальная солнечная батарея', icon: '🛰️', rarity: 'epic', cost: 18000000000, income: 190000000, desc: 'Километровое зеркало, передающее тераватты энергии на Землю лазером.' },
  { id: 'spc_colony_base', caseId: 'space', name: 'Купольный модуль лунной колонии', icon: '🌕', rarity: 'epic', cost: 30000000000, income: 350000000, desc: 'Герметичный биосферный комплекс для проживания инженеров на Луне.' },
  { id: 'spc_dreadnought', caseId: 'space', name: 'Тяжелый звездный крейсер Apex', icon: '🛸', rarity: 'legendary', cost: 55000000000, income: 700000000, desc: 'Флагман частного флота для защиты межзвездных торговых путей.' },
  { id: 'spc_dark_sphere', caseId: 'space', name: 'Сфера Темной Энергии', icon: '🌌', rarity: 'mythic', cost: 110000000000, income: 1600000000, desc: 'Космический феномен, генерирующий гравитационную прибыль.' },

  // --- 9. КЕЙС «ВЛАСТЕЛИН ВРЕМЕНИ» (10 предметов) ---
  { id: 'myt_chronometer', caseId: 'mythic', name: 'Хронометр Вечности', icon: '⏳', rarity: 'common', cost: 9000000000, income: 90000000, desc: 'Песочные часы с пыльцой расколотых временных континуумов.' },
  { id: 'myt_prism', caseId: 'mythic', name: 'Призма Четвертого Измерения', icon: '💎', rarity: 'common', cost: 16000000000, income: 170000000, desc: 'Кристалл, преломляющий время и умножающий финансовые потоки.' },
  { id: 'myt_compass', caseId: 'mythic', name: 'Астральный Компас Реальностей', icon: '🧭', rarity: 'common', cost: 28000000000, income: 320000000, desc: 'Указывает на вселенные с наивысшей инвестиционной доходностью.' },
  { id: 'myt_singularity', caseId: 'mythic', name: 'Микро-Сингулярность в Стазисе', icon: '🔮', rarity: 'rare', cost: 48000000000, income: 600000000, desc: 'Миниатюрная черная дыра, черпающая бесконечную энергию из вакуума.' },
  { id: 'myt_mirror', caseId: 'mythic', name: 'Зеркало Параллельных Судеб', icon: '🪞', rarity: 'rare', cost: 80000000000, income: 1100000000, desc: 'Отражает версии будущего, где вы уже владеете всей галактикой.' },
  { id: 'myt_key', caseId: 'mythic', name: 'Ключ от Портала Мультивселенной', icon: '🗝️', rarity: 'rare', cost: 130000000000, income: 1900000000, desc: 'Открывает доступ к рынкам бесконечного множества миров.' },
  { id: 'myt_orb', caseId: 'mythic', name: 'Сфера Временной Петли', icon: '🌀', rarity: 'epic', cost: 220000000000, income: 3500000000, desc: 'Позволяет циклично капитализировать доходы из вчерашнего дня.' },
  { id: 'myt_scepter', caseId: 'mythic', name: 'Скипетр Абсолютного Хроноса', icon: '🪄', rarity: 'epic', cost: 400000000000, income: 7000000000, desc: 'Останавливает время для соперников и многократно ускоряет ваш рост.' },
  { id: 'myt_crown', caseId: 'mythic', name: 'Венец Властелина Мультивселенной', icon: '👑', rarity: 'legendary', cost: 800000000000, income: 16000000000, desc: 'Корона владыки, объединившего триллионы звездных империй.' },
  { id: 'myt_eye', caseId: 'mythic', name: 'Око Вечного Творца Реальности', icon: '👁️', rarity: 'mythic', cost: 2000000000000, income: 45000000000, desc: 'Абсолютный источник бытия. Повелевает материей, временем и триллионами.' },
];

const STORAGE_KEY = 'money_tapper_save_v2';

// ==========================================
// СОСТОЯНИЕ ИГРЫ (STATE)
// ==========================================

let state = {
  balance: 0,
  tapLevel: 1,
  selectedThemeId: null, // null = авто-выбор по уровню клика
  rainbowBoost: {
    active: false,
    timeLeft: 0,
    multiplier: 5
  },
  rebirthCount: 0, // от 0 до 30 (максимум)
  currency: 'RUB',
  volume: 80,
  vibration: true,
  sideJobs: JSON.parse(JSON.stringify(DEFAULT_SIDE_JOBS)),
  businesses: JSON.parse(JSON.stringify(DEFAULT_BUSINESSES)),
  realEstate: JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE)),
  airline: JSON.parse(JSON.stringify(DEFAULT_AIRLINE)),
  inventory: {}, // itemId: { count: 1, date: timestamp }
  market: {
    lastUpdate: Date.now(),
    multipliers: {}
  },
  crystals: 0, // Премиум-валюта Алмазного Престижа
  prestigeCount: 0, // от 0 до 10 (Алмазный Престиж)
  crystalShop: {
    income_mult: 0,
    tap_mult: 0,
    crystal_haste: 0,
    starting_capital: 0,
    discount: 0,
    rainbow_magnet: 0
  },
  clickModifiers: {
    power_mult: 0,
    crit_tap: 0,
    resonance: 0,
    golden_touch: 0
  },
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

  /**
   * Нежный тактильный щелчок / капля ASMR при тапе
   * Пентатоника, мягкая атака 3мс, затухание 50мс, Low-Pass фильтр 1200Гц
   */
  playTap() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, t);

      const notes = [349.23, 392.00, 440.00, 523.25, 587.33]; // F4, G4, A4, C5, D5
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + 0.05);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) {}
  }

  /**
   * Золотые монеты / приятный каскад хрустальных колокольчиков
   */
  playCoin() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [1318.51, 1567.98, 2093.00]; // E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const st = t + idx * 0.045;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, st);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);

        gain.gain.setValueAtTime(0.0001, st);
        gain.gain.linearRampToValueAtTime(0.18, st + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(st);
        osc.stop(st + 0.18);
      });
    } catch (e) {}
  }

  /**
   * Улучшение / Покупка: небесный восходящий аккорд
   */
  playUpgrade() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const st = t + idx * 0.05;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, st);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);

        gain.gain.setValueAtTime(0.0001, st);
        gain.gain.linearRampToValueAtTime(0.2, st + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    } catch (e) {}
  }

  /**
   * Покупка бизнеса / сделка: роскошный глубокий аккорд с колокольным отзвуком
   */
  playBusinessBuy() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const st = t + idx * 0.04;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2500, st);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);

        gain.gain.setValueAtTime(0.0001, st);
        gain.gain.linearRampToValueAtTime(0.22, st + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(st);
        osc.stop(st + 0.38);
      });
    } catch (e) {}
  }

  /**
   * Портал перерождения: глубокий космический эмбиент-аккорд
   */
  playRebirthPortal() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const chord = [130.81, 196.00, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const st = t + idx * 0.07;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, st);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st);

        gain.gain.setValueAtTime(0.0001, st);
        gain.gain.linearRampToValueAtTime(0.25, st + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(st);
        osc.stop(st + 0.9);
      });
    } catch (e) {}
  }

  /**
   * Ошибка / нехватка средств: мягкий глухой деревянный стук (без резкого жужжания)
   */
  playError() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }

  /**
   * Прокрутка рулетки кейса: мягкий деревянный щелчок
   */
  playCaseSpin() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const count = 14;
      for (let i = 0; i < count; i++) {
        const time = t + (Math.pow(i / count, 1.8) * 2.7);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, time);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480 + (i * 20), time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.04);
      }
    } catch (e) {}
  }

  /**
   * Выигрыш в кейсе: мягкие кристальные арпеджио (без резких sawtooth)
   */
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
        ultra: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00, 2637.02]
      };
      const notes = chordMap[rarity] || chordMap.common;
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const startTime = t + idx * 0.06;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, startTime);

        osc.type = (rarity === 'ultra' || rarity === 'mythic') ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const peakGain = (rarity === 'ultra') ? 0.28 : (rarity === 'mythic' || rarity === 'legendary') ? 0.22 : 0.2;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch (e) {}
  }

  /**
   * Предупреждение об автокликере: тревожный кибер-бип
   */
  playWarning() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [260, 207].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + idx * 0.12);
        gain.gain.setValueAtTime(0.0001, t + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.12 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 0.11);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + idx * 0.12);
        osc.stop(t + idx * 0.12 + 0.12);
      });
    } catch (e) {}
  }

  /**
   * Критический удар: звонкий кристальный аккорд
   */
  playCrit() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [880, 1318.51, 1760].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.0001, t + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.04 + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.18);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.2);
      });
    } catch (e) {}
  }

  /**
   * Джекпот клика: праздничное восходящее арпеджио
   */
  playJackpot() {
    if (state.volume <= 0) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.0001, t + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.22, t + idx * 0.04 + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.32);
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
 * Максимум 30 перерождений и максимум 30x (+1.0x за каждое перерождение)
 */
function getRebirthMultiplier(count = state.rebirthCount) {
  if (count <= 0) return 1.0;
  if (count >= 30) return 30.0;
  return Number((1.0 + count * 1.0).toFixed(1));
}

// ==========================================
// КОНФИГУРАЦИЯ ТЕМ ОФОРМЛЕНИЯ КЛИКА (1..100)
// ==========================================
const CLICK_THEMES = [
  { id: 'emerald', minLvl: 1,  maxLvl: 9,   tier: 'Ранг 1', name: 'Изумрудный Новичок', icon: '🌱', hue: 155, desc: 'Начальная энергия финансового роста. Чистый изумрудный поток.' },
  { id: 'cyber', minLvl: 10, maxLvl: 19,  tier: 'Ранг 2', name: 'Неоновый Киберпанк', icon: '⚡', hue: 190, desc: 'Высокотехнологичный неоновый заряд для скоростных тапов.' },
  { id: 'gold', minLvl: 20, maxLvl: 29,  tier: 'Ранг 3', name: 'Золотой Синдикат',   icon: '👑', hue: 45,  desc: 'Истинный блеск чистого золота и премиального влияния.' },
  { id: 'ruby', minLvl: 30, maxLvl: 39,  tier: 'Ранг 4', name: 'Рубиновый Шторм',    icon: '🔥', hue: 350, desc: 'Пылкая мощь рубинового пламени, сжигающего любые преграды.' },
  { id: 'amethyst', minLvl: 40, maxLvl: 49,  tier: 'Ранг 5', name: 'Аметистовый Мистик',  icon: '🔮', hue: 275, desc: 'Магическая фиолетовая аура тайных мировых инвестиций.' },
  { id: 'sapphire', minLvl: 50, maxLvl: 59,  tier: 'Ранг 6', name: 'Ледяной Сапфир',     icon: '❄️', hue: 215, desc: 'Холодный расчет и несокрушимая кристальная мощь сапфира.' },
  { id: 'phoenix', minLvl: 60, maxLvl: 69,  tier: 'Ранг 7', name: 'Солнечный Феникс',   icon: '☀️', hue: 25,  desc: 'Ослепительная солнечная вспышка возрождающегося капитала.' },
  { id: 'titan', minLvl: 70, maxLvl: 79,  tier: 'Ранг 8', name: 'Платиновый Титан',   icon: '⚙️', hue: 230, desc: 'Сверхпрочный титановый сплав для непоколебимых магнатов.' },
  { id: 'space', minLvl: 80, maxLvl: 89,  tier: 'Ранг 9', name: 'Квантовый Космос',   icon: '🌌', hue: 290, desc: 'Энергия далеких галактик и квантовая сингулярность богатства.' },
  { id: 'absolute', minLvl: 90, maxLvl: 100, tier: 'Ранг 10', name: 'Божественный Абсолют', icon: '✨', hue: 50, desc: 'Высшая точка вселенского изобилия. Абсолютный триумф!' }
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
  let theme = null;
  if (state.selectedThemeId) {
    theme = CLICK_THEMES.find(t => t.id === state.selectedThemeId);
  }
  if (!theme) {
    theme = getThemeForLevel(currentLevel);
  }

  const dynamicHue = state.selectedThemeId
    ? theme.hue
    : Math.round((theme.hue + (currentLevel - theme.minLvl) * 4) % 360);

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
  if (walletThemeBadge) {
    const isCustom = Boolean(state.selectedThemeId);
    walletThemeBadge.textContent = `Стиль: ${theme.name}${isCustom ? ' (кастом)' : ` (ур. ${currentLevel})`}`;
  }
  if (walletPowerVal) walletPowerVal.textContent = `+${formatNumber(getTapPower(currentLevel))}`;
}

/**
 * Конфигурация дополнительных модификаторов клика
 */
const CLICK_MODIFIERS = [
  {
    id: 'power_mult',
    name: 'Силовой импульс',
    icon: '⚡',
    desc: 'Умножает базовую силу каждого клика на прогрессивный коэффициент.',
    maxLevel: 10,
    baseCost: 5000000,
    costMult: 2.2,
    getBonusText: (lvl) => lvl === 0 ? 'Базовый (x1.00)' : `x${(1 + lvl * 0.25).toFixed(2)} к силе тапа`,
    getMultiplier: (lvl) => 1 + lvl * 0.25
  },
  {
    id: 'crit_tap',
    name: 'Критический удар',
    icon: '🎯',
    desc: 'Шанс нанести сокрушительный критический клик с уроном x10!',
    maxLevel: 10,
    baseCost: 10000000,
    costMult: 2.5,
    getBonusText: (lvl) => lvl === 0 ? '0% (нет крита)' : `${lvl * 3}% шанс (урон x10)`,
    getCritChance: (lvl) => lvl * 0.03
  },
  {
    id: 'resonance',
    name: 'Денежный резонанс',
    icon: '🌊',
    desc: 'Добавляет процент от общего пассивного дохода/сек прямо в каждый тап!',
    maxLevel: 10,
    baseCost: 25000000,
    costMult: 2.8,
    getBonusText: (lvl) => lvl === 0 ? '0%' : `+${(lvl * 0.5).toFixed(1)}% дохода/сек в тап`,
    getResonanceShare: (lvl) => lvl * 0.005
  },
  {
    id: 'golden_touch',
    name: 'Золотое касание',
    icon: '👑',
    desc: 'Шанс сорвать мгновенный Джекпот в размере x50 от силы тапа!',
    maxLevel: 10,
    baseCost: 50000000,
    costMult: 3.0,
    getBonusText: (lvl) => lvl === 0 ? '0%' : `${(lvl * 0.3).toFixed(1)}% шанс на Джекпот x50`,
    getJackpotChance: (lvl) => lvl * 0.003
  }
];

function getClickModifierCost(mod, level) {
  if (level >= mod.maxLevel) return Infinity;
  return Math.floor(mod.baseCost * Math.pow(mod.costMult, level));
}

function getDiscountMultiplier() {
  const discountLvl = state.crystalShop ? (state.crystalShop.discount || 0) : 0;
  return Math.max(0.75, 1 - (discountLvl * 0.05));
}

/**
 * Сила тапа: от +1 до +100 с множителями, модификаторами и бонусом от дохода
 */
function getTapPower(level = state.tapLevel) {
  const base = Math.max(1, Math.min(100, level));
  const mult = getRebirthMultiplier();
  const rainbow = (state.rainbowBoost && state.rainbowBoost.active) ? (state.rainbowBoost.multiplier || 5) : 1;
  const powerModLvl = state.clickModifiers ? (state.clickModifiers.power_mult || 0) : 0;
  const powerMult = 1 + powerModLvl * 0.25;

  const resonanceLvl = state.clickModifiers ? (state.clickModifiers.resonance || 0) : 0;
  const passiveIncome = (typeof getTotalPassiveIncome === 'function') ? getTotalPassiveIncome() : 0;
  const resonanceBonus = resonanceLvl > 0 ? Math.round(passiveIncome * (resonanceLvl * 0.005)) : 0;

  const crystalTapMult = 1 + ((state.crystalShop?.tap_mult || 0) * 0.30);
  return Math.max(1, Math.round(base * powerMult * mult * rainbow * crystalTapMult) + resonanceBonus);
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
  return Math.floor(business.baseCost * Math.pow(1.15, business.count) * getDiscountMultiplier());
}

function getEstateCost(estate) {
  return Math.floor((estate.cost || 0) * getDiscountMultiplier());
}

/**
 * Подсчет суммарного пассивного дохода от предметов в коллекции (в секунду)
 */
/**
 * Подсчет суммы всех инвестиций в объект недвижимости (базовая цена + улучшения)
 */
function getEstateInvested(estate) {
  let sum = estate.cost || 0;
  if (estate.upgrades && Array.isArray(estate.upgrades)) {
    estate.upgrades.forEach(u => {
      if (u.bought) sum += u.cost;
    });
  }
  return sum;
}

/**
 * Расчет текущей оценочной стоимости объекта недвижимости с учетом улучшений
 */
function getEstateValue(estate) {
  let val = estate.cost || 0;
  if (estate.upgrades && Array.isArray(estate.upgrades)) {
    estate.upgrades.forEach(u => {
      if (u.bought) val += (u.bonusValue || Math.round(u.cost * 1.6));
    });
  }
  return val;
}

/**
 * Расчет цены перепродажи объекта на аукционе (Флиппинг с наценкой +35%)
 */
function getEstateFlipPrice(estate) {
  return Math.floor(getEstateValue(estate) * 1.35);
}

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
  const rainbow = (state.rainbowBoost && state.rainbowBoost.active) ? (state.rainbowBoost.multiplier || 5) : 1;
  const crystalIncomeMult = 1 + ((state.crystalShop?.income_mult || 0) * 0.25);
  return Math.round(base * mult * rainbow * crystalIncomeMult);
}

/**
 * Пассивный доход кристаллов в секунду от Алмазного Престижа
 */
function getCrystalPassiveIncome() {
  const count = Math.min(10, Math.max(0, state.prestigeCount || 0));
  const baseRate = PRESTIGE_CRYSTAL_RATES[count] || 0;
  if (baseRate <= 0) return 0;
  const hasteLvl = state.crystalShop?.crystal_haste || 0;
  const hasteMult = 1 + (hasteLvl * 0.20);
  return baseRate * hasteMult;
}

function formatCrystals(num) {
  if (!num || num <= 0) return '0';
  if (num < 10) return num.toFixed(2);
  if (num < 100) return num.toFixed(1);
  return Math.floor(num).toLocaleString('ru-RU');
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
      total += getEstateInvested(item);
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
  if (state.rebirthCount >= 30) return Infinity;
  return REBIRTH_REQUIREMENTS[state.rebirthCount];
}

function formatSeconds(sec) {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
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

/**
 * Надежный обработчик тапа для мобильных устройств и клика на ПК.
 * Защищает от ложных срабатываний при пролистывании (скролле) и зажатии:
 * 1. Игнорирует касание, если палец сдвинулся более чем на 8px (жест пролистывания).
 * 2. Игнорирует долгое зажатие (> 450 мс без отпускания), исключая случайные срабатывания при удержании экрана.
 * 3. Игнорирует отмененные касания (touchcancel).
 * 4. На чистый быстрый тап реагирует мгновенно (0 мс) и защищает от повторных дублирующих кликов (ghost clicks).
 */
function bindTouchClick(el, handler) {
  if (!el) return;
  let lastTouchTime = 0;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isMoved = false;

  el.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = performance.now();
      isMoved = false;
    }
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // Если палец сдвинулся более чем на 8px, это жест скролла/пролистывания
      if (Math.hypot(dx, dy) > 8) {
        isMoved = true;
      }
    }
  }, { passive: true });

  el.addEventListener('touchcancel', () => {
    isMoved = true;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    // 1. Дополнительная проверка смещения точки отрыва пальца
    if (e.changedTouches && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      if (Math.hypot(endX - startX, endY - startY) > 8) {
        isMoved = true;
      }
    }

    // 2. Если был скролл/движение пальца — отменяем нажатие
    if (isMoved) {
      return;
    }

    // 3. Если было долгое зажатие (> 450 мс) — отменяем нажатие по ТЗ
    const holdDuration = performance.now() - startTime;
    if (holdDuration > 450) {
      return;
    }

    // 4. Валидный быстрый намеренный тап
    lastTouchTime = performance.now();
    e.preventDefault();
    handler(e);
  }, { passive: false });

  el.addEventListener('click', (e) => {
    // Если только что сработал валидный touchend, блокируем синтетический дубликат
    if (performance.now() - lastTouchTime < 500) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Обычный клик мышью на десктопе
    handler(e);
  });
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
const btnBackFromSettings = document.getElementById('btnBackFromSettings');

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
const btnOpenNoviceCase = document.getElementById('btnOpenNoviceCase');
const btnOpenBronzeCase = document.getElementById('btnOpenBronzeCase');
const btnOpenSilverCase = document.getElementById('btnOpenSilverCase');
const btnOpenGoldCase = document.getElementById('btnOpenGoldCase');
const btnOpenDiamondCase = document.getElementById('btnOpenDiamondCase');
const btnOpenCryptoCase = document.getElementById('btnOpenCryptoCase');
const btnOpenPropertyCase = document.getElementById('btnOpenPropertyCase');
const btnOpenCyberpunkCase = document.getElementById('btnOpenCyberpunkCase');
const btnOpenSpaceCase = document.getElementById('btnOpenSpaceCase');
const btnOpenMythicCase = document.getElementById('btnOpenMythicCase');

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
// Модальное окно деталей недвижимости и флиппинга
const estateDetailModal = document.getElementById('estateDetailModal');
const modalEstateCategory = document.getElementById('modalEstateCategory');
const modalEstateName = document.getElementById('modalEstateName');
const modalEstateAddress = document.getElementById('modalEstateAddress');
const btnCloseEstateModal = document.getElementById('btnCloseEstateModal');
const modalEstateIcon = document.getElementById('modalEstateIcon');
const modalEstateStatus = document.getElementById('modalEstateStatus');
const modalEstateTotalValue = document.getElementById('modalEstateTotalValue');
const modalEstateDesc = document.getElementById('modalEstateDesc');
const modalEstateUpgradesSection = document.getElementById('modalEstateUpgradesSection');
const modalUpgradesCount = document.getElementById('modalUpgradesCount');
const modalEstateUpgradesList = document.getElementById('modalEstateUpgradesList');
const modalEstateFlipSection = document.getElementById('modalEstateFlipSection');
const modalFlipStatusBox = document.getElementById('modalFlipStatusBox');
const modalFlipTimer = document.getElementById('modalFlipTimer');
const modalFlipProgress = document.getElementById('modalFlipProgress');
const btnStartEstateFlip = document.getElementById('btnStartEstateFlip');
const modalFlipPriceTag = document.getElementById('modalFlipPriceTag');
const btnCollectEstateFlip = document.getElementById('btnCollectEstateFlip');
const modalCollectFlipAmount = document.getElementById('modalCollectFlipAmount');

// Таймер рынка инвентаря
const marketTimerDisplay = document.getElementById('marketTimerDisplay');
let currentInspectedEstateId = null;

const btnCollectOffline = document.getElementById('btnCollectOffline');
const btnCloseOfflineModal = document.getElementById('btnCloseOfflineModal');
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
  if (btnOpenNoviceCase) btnOpenNoviceCase.disabled = state.balance < (CASE_TYPES.novice?.cost || 10000);
  if (btnOpenBronzeCase) btnOpenBronzeCase.disabled = state.balance < (CASE_TYPES.bronze?.cost || 100000);
  if (btnOpenSilverCase) btnOpenSilverCase.disabled = state.balance < (CASE_TYPES.silver?.cost || 1000000);
  if (btnOpenGoldCase) btnOpenGoldCase.disabled = state.balance < (CASE_TYPES.gold?.cost || 5000000);
  if (btnOpenDiamondCase) btnOpenDiamondCase.disabled = state.balance < (CASE_TYPES.diamond?.cost || 10000000);
  if (btnOpenCryptoCase) btnOpenCryptoCase.disabled = state.balance < (CASE_TYPES.crypto?.cost || 50000000);
  if (btnOpenPropertyCase) btnOpenPropertyCase.disabled = state.balance < (CASE_TYPES.property?.cost || 100000000);
  if (btnOpenCyberpunkCase) btnOpenCyberpunkCase.disabled = state.balance < (CASE_TYPES.cyberpunk?.cost || 500000000);
  if (btnOpenSpaceCase) btnOpenSpaceCase.disabled = state.balance < (CASE_TYPES.space?.cost || 5000000000);
  if (btnOpenMythicCase) btnOpenMythicCase.disabled = state.balance < (CASE_TYPES.mythic?.cost || 50000000000);

  if (casesBadge) {
    const canAffordAny = state.balance >= (CASE_TYPES.novice?.cost || 10000);
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

  const crystalsDisplay = document.getElementById('crystalsDisplay');
  if (crystalsDisplay) crystalsDisplay.textContent = formatNumber(state.crystals || 0);

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

  renderClickModifiers();
}

/**
 * Рендеринг карточек дополнительных модификаторов клика
 */
function renderClickModifiers() {
  const grid = document.getElementById('clickUpgradesGrid');
  if (!grid) return;

  grid.innerHTML = '';
  CLICK_MODIFIERS.forEach(mod => {
    const currentLvl = state.clickModifiers ? (state.clickModifiers[mod.id] || 0) : 0;
    const isMaxed = currentLvl >= mod.maxLevel;
    const cost = getClickModifierCost(mod, currentLvl);
    const canAfford = !isMaxed && state.balance >= cost;
    const bonusText = mod.getBonusText(currentLvl);

    const card = document.createElement('div');
    card.className = 'click-upgrade-card';

    card.innerHTML = `
      <div class="click-card-top">
        <div class="click-card-title-group">
          <div class="click-card-icon">${mod.icon}</div>
          <div class="click-card-name">${mod.name}</div>
        </div>
        <div class="click-card-level-pill ${isMaxed ? 'maxed' : ''}">
          ${isMaxed ? 'МАКСИМУМ' : `Ур. ${currentLvl} / ${mod.maxLevel}`}
        </div>
      </div>
      <p class="click-card-desc">${mod.desc}</p>
      <div class="click-card-bonus-row">
        <span class="click-bonus-label">Текущий бонус:</span>
        <span class="click-bonus-val">${bonusText}</span>
      </div>
      <button class="btn-buy-click-mod ${isMaxed ? 'is-maxed' : ''}" data-mod-id="${mod.id}" ${isMaxed || !canAfford ? 'disabled' : ''}>
        <span>${isMaxed ? 'Максимальный уровень' : `Улучшить до Ур. ${currentLvl + 1}`}</span>
        ${isMaxed ? '' : `<span>${formatNumber(cost)} ${getCurrencySymbol()}</span>`}
      </button>
    `;

    const buyBtn = card.querySelector('.btn-buy-click-mod');
    if (buyBtn && !isMaxed) {
      bindTouchClick(buyBtn, (e) => {
        e.stopPropagation();
        buyClickModifier(mod.id);
      });
    }

    grid.appendChild(card);
  });
}

function buyClickModifier(modId) {
  const mod = CLICK_MODIFIERS.find(m => m.id === modId);
  if (!mod) return;

  if (!state.clickModifiers) {
    state.clickModifiers = { power_mult: 0, crit_tap: 0, resonance: 0, golden_touch: 0 };
  }

  const currentLvl = state.clickModifiers[modId] || 0;
  if (currentLvl >= mod.maxLevel) return;

  const cost = getClickModifierCost(mod, currentLvl);
  if (state.balance < cost) return;

  state.balance -= cost;
  state.clickModifiers[modId] = currentLvl + 1;

  soundManager.playUpgrade();
  triggerHaptic('medium');

  updateHeader();
  renderEarningsScreen();
  saveGameState();
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
      if (buyBtn) {
        bindTouchClick(buyBtn, (e) => {
          e.stopPropagation();
          buySideJob(job.id);
        });
      }
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
    const isLockedByRebirth = (state.rebirthCount || 0) < (b.reqRebirth || 0);
    const canAfford = state.balance >= cost && !isLockedByRebirth;
    if (canAfford) canAffordAny++;

    const totalIncome = Math.round(b.count * b.baseIncome * mult);
    const singleIncome = Math.round(b.baseIncome * mult);

    const card = document.createElement('div');
    card.className = `business-card ${b.count > 0 ? 'owned' : ''} ${canAfford ? 'can-afford' : ''} ${isLockedByRebirth ? 'locked-rebirth' : ''}`;
    card.innerHTML = `
      <div class="business-top-row">
        <div class="business-icon-box">${b.icon}</div>
        <div class="business-main-info">
          <div class="business-title-row">
            <span class="business-name">${b.name}</span>
            <span class="business-count-badge">${b.count > 0 ? `Lvl ${b.count}` : (isLockedByRebirth ? 'Заблокирован' : 'Не куплен')}</span>
          </div>
          ${isLockedByRebirth ? `<div class="rebirth-lock-badge">🔒 Требуется Перерождение ${b.reqRebirth}</div>` : ''}
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
          <span>${isLockedByRebirth ? '🔒 Заблокировано' : (b.count === 0 ? 'Купить бизнес' : 'Улучшить бизнес')}</span>
          <span class="btn-buy-cost">${isLockedByRebirth ? `Требуется Перерождение ${b.reqRebirth}` : `${formatNumber(cost)} <span class="currency-text">${getCurrencySymbol()}</span>`}</span>
        </button>
      </div>
    `;

    const buyBtn = card.querySelector('.btn-buy-business');
    if (buyBtn) {
      bindTouchClick(buyBtn, (e) => {
        e.stopPropagation();
        buyBusiness(b.id);
      });
    }

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
      bindTouchClick(btnFound, () => {
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

    const btnRename = airlineMegacard.querySelector('#btnOpenRenameModal');
    const btnHangar = airlineMegacard.querySelector('#btnOpenHangarModal');
    const btnFlight = airlineMegacard.querySelector('#btnCollectFlight');
    if (btnRename) bindTouchClick(btnRename, openRenameModal);
    if (btnHangar) bindTouchClick(btnHangar, openHangarModal);
    if (btnFlight) bindTouchClick(btnFlight, collectFlightRevenue);
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
    if (buyBtn) {
      bindTouchClick(buyBtn, (e) => {
        e.stopPropagation();
        buyPlane(plane.id);
      });
    }

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

/**
 * Обновление коэффициентов цен на рынке предметов инвентаря (каждый час +/- 35-65%)
 */
function updateMarketMultipliers(force = false) {
  if (!state.market) {
    state.market = { lastUpdate: Date.now(), multipliers: {} };
  }
  const now = Date.now();
  const HOUR_MS = 3600 * 1000;
  if (force || !state.market.lastUpdate || (now - state.market.lastUpdate >= HOUR_MS) || Object.keys(state.market.multipliers || {}).length === 0) {
    state.market.lastUpdate = now;
    state.market.multipliers = {};
    CASE_ITEMS.forEach(item => {
      // Флуктуация от 0.65x (-35%) до 1.65x (+65%)
      const mult = Number((0.65 + Math.random() * 1.0).toFixed(2));
      state.market.multipliers[item.id] = mult;
    });
    saveGameState();
    if (casesInventoryView && casesInventoryView.style.display === 'flex') {
      renderInventory();
    }
  }
}

/**
 * Продажа предмета из инвентаря по текущей рыночной цене
 * Предмет удаляется из коллекции и перестает давать пассивный доход
 */
function sellInventoryItem(itemId) {
  if (!state.inventory || !state.inventory[itemId]) return;
  const item = CASE_ITEMS.find(it => it.id === itemId);
  if (!item) return;

  const mult = (state.market && state.market.multipliers && state.market.multipliers[itemId]) || 1.0;
  const sellPrice = Math.round(item.cost * mult);

  delete state.inventory[itemId];
  state.balance += sellPrice;
  state.stats.totalEarned += sellPrice;

  soundManager.playCoin();
  triggerHaptic('medium');

  createFloatingNumber(window.innerWidth / 2, window.innerHeight / 2, `+${formatNumber(sellPrice)} ${getCurrencySymbol()} (Продано!)`);

  updateHeader();
  renderInventory();
  renderCasesScreen();
  updateTapUpgradeCard();
  updateBusinessAffordability();
  saveGameState();
}

/**
 * Открытие модального окна объекта недвижимости с фото, улучшениями и аукционом флиппинга
 */
function openEstateModal(estateId) {
  const estate = state.realEstate.find(e => e.id === estateId);
  if (!estate) return;
  currentInspectedEstateId = estateId;

  modalEstateCategory.textContent = estate.category;
  modalEstateName.textContent = estate.name;
  modalEstateAddress.textContent = '📍 ' + (estate.location || 'Престижная локация');
  if (modalEstateIcon) modalEstateIcon.textContent = estate.icon || '🏡';
  modalEstateDesc.textContent = estate.desc;

  updateEstateModalUI();
  estateDetailModal.classList.add('active');
}

function closeEstateModal() {
  currentInspectedEstateId = null;
  estateDetailModal.classList.remove('active');
}

/**
 * Обновление внутреннего состояния модального окна недвижимости
 */
function updateEstateModalUI() {
  if (!currentInspectedEstateId) return;
  const estate = state.realEstate.find(e => e.id === currentInspectedEstateId);
  if (!estate) return;

  const totalValue = getEstateValue(estate);
  modalEstateTotalValue.textContent = formatNumber(totalValue) + ' ' + getCurrencySymbol();

  if (!estate.owned) {
    modalEstateStatus.textContent = 'В продаже';
    modalEstateStatus.style.background = 'rgba(100, 116, 139, 0.85)';
    modalEstateUpgradesSection.style.display = 'none';
    modalEstateFlipSection.style.display = 'none';
    return;
  }

  modalEstateUpgradesSection.style.display = 'block';
  modalEstateFlipSection.style.display = 'block';

  // Статус
  if (estate.onSale) {
    if (estate.saleCompleted) {
      modalEstateStatus.textContent = 'Покупатель найден! 💰';
      modalEstateStatus.style.background = 'rgba(34, 197, 94, 0.9)';
    } else {
      modalEstateStatus.textContent = 'На аукционе ⏳ (' + formatSeconds(estate.saleTimeRemaining) + ')';
      modalEstateStatus.style.background = 'rgba(234, 179, 8, 0.9)';
    }
  } else {
    modalEstateStatus.textContent = 'В собственности ✓';
    modalEstateStatus.style.background = 'rgba(59, 130, 246, 0.9)';
  }

  // Улучшения
  const upgrades = estate.upgrades || [];
  const boughtCount = upgrades.filter(u => u.bought).length;
  modalUpgradesCount.textContent = `${boughtCount} / ${upgrades.length}`;
  modalEstateUpgradesList.innerHTML = '';

  upgrades.forEach(u => {
    const item = document.createElement('div');
    item.className = `estate-upgrade-item ${u.bought ? 'bought' : ''}`;
    item.innerHTML = `
      <div class="upgrade-icon">${u.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-stats">
          <span class="upgrade-cost">${u.bought ? 'Установлено ✓' : formatNumber(u.cost) + ' ' + getCurrencySymbol()}</span>
          <span class="upgrade-bonus">+${formatNumber(u.bonusValue)} к стоимости</span>
        </div>
      </div>
      <div>
        ${u.bought 
          ? '<span class="upgrade-bought-check">✓</span>' 
          : `<button class="btn-buy-upgrade" data-upgrade-id="${u.id}" ${state.balance >= u.cost && !estate.onSale ? '' : 'disabled'}>Улучшить</button>`
        }
      </div>
    `;

    if (!u.bought) {
      const btn = item.querySelector('.btn-buy-upgrade');
      if (btn) {
        bindTouchClick(btn, (e) => {
          e.stopPropagation();
          buyEstateUpgrade(estate.id, u.id);
        });
      }
    }

    modalEstateUpgradesList.appendChild(item);
  });

  // Флиппинг
  const flipPrice = getEstateFlipPrice(estate);
  modalFlipPriceTag.textContent = formatNumber(flipPrice) + ' ' + getCurrencySymbol();

  if (!estate.onSale) {
    modalFlipStatusBox.style.display = 'none';
    btnStartEstateFlip.style.display = 'block';
    btnStartEstateFlip.disabled = false;
    btnCollectEstateFlip.style.display = 'none';
  } else if (!estate.saleCompleted) {
    modalFlipStatusBox.style.display = 'block';
    btnStartEstateFlip.style.display = 'none';
    btnCollectEstateFlip.style.display = 'none';
    modalFlipTimer.textContent = formatSeconds(estate.saleTimeRemaining);
    const pct = Math.min(100, Math.max(0, ((3600 - estate.saleTimeRemaining) / 3600) * 100));
    modalFlipProgress.style.width = pct + '%';
  } else {
    modalFlipStatusBox.style.display = 'none';
    btnStartEstateFlip.style.display = 'none';
    btnCollectEstateFlip.style.display = 'block';
    modalCollectFlipAmount.textContent = '+' + formatNumber(estate.salePrice) + ' ' + getCurrencySymbol();
  }
}

/**
 * Покупка улучшения для объекта недвижимости
 */
function buyEstateUpgrade(estateId, upgradeId) {
  const estate = state.realEstate.find(e => e.id === estateId);
  if (!estate || !estate.owned || estate.onSale) return;

  const upgrade = (estate.upgrades || []).find(u => u.id === upgradeId);
  if (!upgrade || upgrade.bought || state.balance < upgrade.cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.balance -= upgrade.cost;
  upgrade.bought = true;

  soundManager.playUpgrade();
  triggerHaptic('medium');

  updateHeader();
  updateEstateModalUI();
  renderRealEstate();
  updateMarketMultipliers();
  updateTapUpgradeCard();
  updateBusinessAffordability();
  saveGameState();
}

/**
 * Выставление объекта недвижимости на продажу с наценкой +35% (1 час)
 */
function startEstateFlip(estateId) {
  const estate = state.realEstate.find(e => e.id === estateId);
  if (!estate || !estate.owned || estate.onSale) return;

  estate.onSale = true;
  estate.saleTimeRemaining = 3600; // 1 час (3600 секунд)
  estate.salePrice = getEstateFlipPrice(estate);
  estate.saleCompleted = false;

  soundManager.playUpgrade();
  triggerHaptic('medium');

  updateEstateModalUI();
  renderRealEstate();
  saveGameState();
}

/**
 * Получение прибыли от закрытой сделки продажи недвижимости (+35% прибыли)
 */
function collectEstateFlip(estateId) {
  const estate = state.realEstate.find(e => e.id === estateId);
  if (!estate || !estate.owned || !estate.onSale || !estate.saleCompleted) return;

  const payout = estate.salePrice;
  state.balance += payout;
  state.stats.totalEarned += payout;

  // Сброс владения для возможности покупки заново
  estate.owned = false;
  estate.onSale = false;
  estate.saleCompleted = false;
  estate.saleTimeRemaining = 0;
  estate.salePrice = 0;
  if (estate.upgrades) {
    estate.upgrades.forEach(u => u.bought = false);
  }

  soundManager.playBusinessBuy();
  triggerHaptic('success');

  createFloatingNumber(window.innerWidth / 2, window.innerHeight / 2, `+${formatNumber(payout)} ${getCurrencySymbol()} (Сделка закрыта!)`);

  closeEstateModal();
  updateHeader();
  renderRealEstate();
  renderLeaderboard();
  updateTapUpgradeCard();
  updateBusinessAffordability();
  saveGameState();
}

function renderRealEstate() {
  realEstateList.innerHTML = '';
  let canAffordAny = 0;

  state.realEstate.forEach(item => {
    const canAfford = !item.owned && state.balance >= item.cost;
    if (canAfford) canAffordAny++;

    const totalVal = getEstateValue(item);
    const card = document.createElement('div');
    card.className = `realestate-card ${item.owned ? 'owned' : ''}`;
    card.innerHTML = `
      <div class="realestate-icon">${item.icon}</div>
      <div class="realestate-info">
        <span class="realestate-tag">${item.category}</span>
        <div class="realestate-name">${item.name}</div>
        <div class="realestate-cost">${item.owned ? formatNumber(totalVal) : formatNumber(item.cost)} <span class="currency-text">${getCurrencySymbol()}</span></div>
        <div class="realestate-location">📍 ${item.location || 'Премиум'}</div>
      </div>
      <div class="estate-card-actions">
        ${item.owned 
          ? (item.onSale 
              ? (item.saleCompleted 
                  ? `<button class="btn-estate-collect-flip" data-estate-id="${item.id}">Забрать +${formatNumber(item.salePrice)} ${getCurrencySymbol()}!</button>`
                  : `<div class="badge-estate-selling">Аукцион (${formatSeconds(item.saleTimeRemaining)})</div>
                     <button class="btn-estate-manage" data-estate-id="${item.id}">Осмотреть</button>`
                )
              : `<button class="btn-estate-manage" data-estate-id="${item.id}">Управление 🛠️</button>`
            )
          : `<button class="btn-buy-estate" data-estate-id="${item.id}" ${canAfford ? '' : 'disabled'}>Купить</button>`
        }
      </div>
    `;

    // Слушатели кнопок недвижимости
    const buyBtn = card.querySelector('.btn-buy-estate');
    if (buyBtn) {
      bindTouchClick(buyBtn, (e) => {
        e.stopPropagation();
        buyRealEstate(item.id);
      });
    }

    const manageBtn = card.querySelector('.btn-estate-manage');
    if (manageBtn) {
      bindTouchClick(manageBtn, (e) => {
        e.stopPropagation();
        openEstateModal(item.id);
      });
    }

    const inspectBtn = card.querySelector('.btn-estate-inspect');
    if (inspectBtn) {
      bindTouchClick(inspectBtn, (e) => {
        e.stopPropagation();
        openEstateModal(item.id);
      });
    }

    const collectBtn = card.querySelector('.btn-estate-collect-flip');
    if (collectBtn) {
      bindTouchClick(collectBtn, (e) => {
        e.stopPropagation();
        collectEstateFlip(item.id);
      });
    }

    // Клик по всей карточке открывает детали
    bindTouchClick(card, () => {
      openEstateModal(item.id);
    });

    realEstateList.appendChild(card);
  });

  if (canAffordAny > 0) {
    realEstateBadge.style.display = 'block';
    realEstateBadge.textContent = canAffordAny;
  } else {
    realEstateBadge.style.display = 'none';
  }
}

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

  rebirthStageBadge.textContent = `Перерождение ${state.rebirthCount} / 30`;
  currentMultText.textContent = `${currentMult.toFixed(1)}x`;

  if (state.rebirthCount >= 30) {
    nextMultText.textContent = 'МАКС';
    rebirthReqAmount.textContent = 'Достигнут предел';
    rebirthProgressBar.style.width = '100%';
    rebirthProgressPercent.textContent = '100%';
    btnDoRebirth.disabled = true;
    btnDoRebirth.querySelector('.btn-rebirth-text').textContent = 'Максимальное перерождение (30x)';
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

  statRebirthsCount.textContent = `${state.rebirthCount} / 30 (бонус ${getRebirthMultiplier().toFixed(1)}x)`;

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
    bindTouchClick(btn, () => {
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

  if (inventoryCountBadge) inventoryCountBadge.textContent = `${ownedCount} / 100`;
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

  updateMarketMultipliers();

  inventoryGrid.innerHTML = '';
  const items = filter === 'all' ? CASE_ITEMS : CASE_ITEMS.filter(it => it.caseId === filter);

  items.forEach(item => {
    const isOwned = Boolean(state.inventory && state.inventory[item.id]);
    const rarity = RARITY_INFO[item.rarity] || RARITY_INFO.common;
    const mult = (state.market && state.market.multipliers && state.market.multipliers[item.id]) || 1.0;
    const currentMarketPrice = Math.round(item.cost * mult);
    const percentDiff = Math.round((mult - 1.0) * 100);
    const diffSign = percentDiff >= 0 ? '+' : '';
    const diffClass = percentDiff >= 0 ? 'trend-up' : 'trend-down';

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
      ${isOwned ? `
        <div class="inv-item-market-row">
          <span class="market-price-tag">Рынок: <b>${formatNumber(currentMarketPrice)} ${getCurrencySymbol()}</b></span>
          <span class="market-trend ${diffClass}">${diffSign}${percentDiff}%</span>
        </div>
        <button class="btn-sell-item" data-item-id="${item.id}">
          Продать за ${formatNumber(currentMarketPrice)} ${getCurrencySymbol()}
        </button>
      ` : ''}
    `;

    if (isOwned) {
      const sellBtn = card.querySelector('.btn-sell-item');
      if (sellBtn) {
        bindTouchClick(sellBtn, (e) => {
          e.stopPropagation();
          sellInventoryItem(item.id);
        });
      }
    }

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
 * Ультра-мега-редкий предмет «Красный алмаз» проверяется отдельно с шансом 1 к триллиону (1e-12)
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
        // Тизер в рулетке: при открытии бронзового кейса показываем Красный алмаз на 33-м слоте как тизер
        if (caseId === 'bronze' && i === 33 && wonItem.rarity !== 'ultra') {
          const redDiamondItem = casePool.find(it => it.rarity === 'ultra');
          item = redDiamondItem || casePool[Math.floor(Math.random() * casePool.length)];
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
// РАДУЖНЫЙ ДОЛЛАР (FRENZY СПЕЦ-СОБЫТИЕ)
// ==========================================
let lastRainbowSpawnTime = 0;
let activeRainbowDollarEl = null;
let rainbowSecondAccumulator = 0;

function maybeSpawnRainbowDollar() {
  if (state.rainbowBoost && state.rainbowBoost.active) return;
  if (activeRainbowDollarEl) return;
  const now = Date.now();
  if (now - lastRainbowSpawnTime < 15000) return;
  if (Math.random() > 0.02) return;

  lastRainbowSpawnTime = now;
  spawnRainbowDollar();
}

function spawnRainbowDollar() {
  const container = document.getElementById('rainbowDollarContainer') || document.querySelector('.mobile-frame');
  if (!container) return;

  const dollar = document.createElement('div');
  dollar.className = 'rainbow-dollar-float';
  dollar.innerHTML = `
    <div class="rainbow-dollar-icon">💵</div>
    <div class="rainbow-dollar-tag">РАДУЖНЫЙ БУСТ x5! ЖМИ!</div>
  `;

  dollar.style.left = `${Math.floor(Math.random() * 60) + 15}%`;
  dollar.style.top = `${Math.floor(Math.random() * 35) + 35}%`;

  const onCollect = (e) => {
    e.stopPropagation();
    collectRainbowDollar(dollar);
  };
  dollar.addEventListener('click', onCollect);
  dollar.addEventListener('touchstart', onCollect, { passive: false });

  container.appendChild(dollar);
  activeRainbowDollarEl = dollar;
  soundManager.playCoin();

  setTimeout(() => {
    if (dollar && dollar.parentNode) {
      dollar.parentNode.removeChild(dollar);
    }
    if (activeRainbowDollarEl === dollar) {
      activeRainbowDollarEl = null;
    }
  }, 11000);
}

function collectRainbowDollar(dollarEl) {
  if (dollarEl && dollarEl.parentNode) {
    dollarEl.parentNode.removeChild(dollarEl);
  }
  activeRainbowDollarEl = null;

  soundManager.playCaseWin('mythic');
  triggerHaptic('success');

  if (!state.rainbowBoost) state.rainbowBoost = {};
  state.rainbowBoost.active = true;
  state.rainbowBoost.timeLeft = 30;
  state.rainbowBoost.multiplier = 5;

  updateRainbowBannerUI();
  updateHeader();
  renderEarningsScreen();
  createFloatingNumber(null, null, '🌈 БУСТ x5 АКТИВИРОВАН!');
}

function updateRainbowBannerUI() {
  const banner = document.getElementById('rainbowBoostBanner');
  const timeVal = document.getElementById('rainbowBoostTimeVal');
  if (!banner) return;

  if (state.rainbowBoost && state.rainbowBoost.active && state.rainbowBoost.timeLeft > 0) {
    banner.classList.add('active');
    if (timeVal) timeVal.textContent = `${state.rainbowBoost.timeLeft}s`;
  } else {
    banner.classList.remove('active');
  }
}

// ==========================================
// ВЫБОР ОФОРМЛЕНИЯ В НАСТРОЙКАХ
// ==========================================
function renderThemesSelector() {
  const grid = document.getElementById('themesSelectorGrid');
  if (!grid) return;

  grid.innerHTML = '';

  const isAuto = state.selectedThemeId === null;
  const currentLevelTheme = getThemeForLevel(state.tapLevel);

  // Опция авто-выбора
  const autoCard = document.createElement('div');
  autoCard.className = `theme-select-card ${isAuto ? 'active' : ''}`;
  autoCard.setAttribute('role', 'button');
  autoCard.setAttribute('tabindex', '0');
  autoCard.innerHTML = `
    <div class="theme-card-top">
      <span class="theme-card-icon">⚡</span>
      <span class="theme-card-badge">${isAuto ? 'АКТИВНО ✓' : 'АВТО'}</span>
    </div>
    <div class="theme-card-name">Авто-выбор</div>
    <div class="theme-card-desc">Динамически меняется с уровнем клика (сейчас: ${currentLevelTheme.name})</div>
    <div class="theme-card-status">${isAuto ? 'Текущий режим ✓' : 'Нажмите, чтобы включить'}</div>
  `;
  bindTouchClick(autoCard, () => {
    state.selectedThemeId = null;
    applyTheme();
    renderThemesSelector();
    saveGameState();
    soundManager.playTap();
    triggerHaptic('light');
  });
  grid.appendChild(autoCard);

  CLICK_THEMES.forEach(t => {
    const isUnlocked = state.tapLevel >= t.minLvl;
    const isSelected = state.selectedThemeId === t.id;
    const card = document.createElement('div');
    card.className = `theme-select-card ${isSelected ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="theme-card-top">
        <span class="theme-card-icon">${t.icon}</span>
        <span class="theme-card-badge">${t.tier}</span>
      </div>
      <div class="theme-card-name">${t.name}</div>
      <div class="theme-card-desc">${t.desc}</div>
      <div class="theme-card-status">
        ${isSelected 
          ? 'Выбрано ✓' 
          : (isUnlocked ? 'Нажмите для выбора' : `🔒 Откроется на ${t.minLvl} ур. клика`)
        }
      </div>
    `;

    if (isUnlocked) {
      bindTouchClick(card, () => {
        state.selectedThemeId = t.id;
        applyTheme();
        renderThemesSelector();
        saveGameState();
        soundManager.playTap();
        triggerHaptic('light');
      });
    } else {
      bindTouchClick(card, () => {
        soundManager.playError();
        triggerHaptic('error');
      });
    }

    grid.appendChild(card);
  });
}


// ==========================================
// ЛИМИТ КЛИКОВ: СТРОГО 30 CPS (CLICKS PER SECOND)
// ==========================================

const tapLimiter = {
  maxCPS: 30,
  minIntervalMs: 1000 / 30, // 33.33ms (максимально 30 кликов в секунду)
  recentTaps: [], // метки времени кликов за последнюю секунду
  lastTapTime: 0,

  canTap() {
    const now = performance.now();

    // 1. Проверка минимального интервала между последовательными тапами (33.33 мс)
    if (this.lastTapTime && (now - this.lastTapTime < this.minIntervalMs)) {
      return false; // Превышение мгновенного лимита 30 CPS
    }

    // 2. Скользящее окно 1000 мс (1 секунда)
    const windowStart = now - 1000;
    while (this.recentTaps.length > 0 && this.recentTaps[0] < windowStart) {
      this.recentTaps.shift();
    }

    // Если за последнюю секунду уже зарегистрировано 30 тапов — клик не проходит
    if (this.recentTaps.length >= this.maxCPS) {
      return false; // Строго не более 30 кликов в секунду
    }

    // Разрешаем клик и регистрируем время
    this.lastTapTime = now;
    this.recentTaps.push(now);
    return true;
  }
};

// ==========================================
// ИГРОВЫЕ ДЕЙСТВИЯ (ACTIONS)
// ==========================================

function handleTap(clientX, clientY, e) {
  // Строгий лимит 30 CPS: больше 30 кликов в секунду сделать физически невозможно
  if (!tapLimiter.canTap()) return;

  const basePower = getTapPower();
  let finalPower = basePower;
  let floatText = `+${formatNumber(finalPower)} ${getCurrencySymbol()}`;
  let floatClass = '';

  // Проверка Золотого касания (Джекпот x50)
  const jackLvl = state.clickModifiers ? (state.clickModifiers.golden_touch || 0) : 0;
  const jackChance = jackLvl * 0.003;
  const isJackpot = jackChance > 0 && Math.random() < jackChance;

  // Проверка Критического удара (Крит x10)
  const critLvl = state.clickModifiers ? (state.clickModifiers.crit_tap || 0) : 0;
  const critChance = critLvl * 0.03;
  const isCrit = !isJackpot && critChance > 0 && Math.random() < critChance;

  if (isJackpot) {
    finalPower = basePower * 50;
    floatText = `👑 ДЖЕКПОТ x50! +${formatNumber(finalPower)} ${getCurrencySymbol()}`;
    floatClass = 'jackpot';
    soundManager.playJackpot();
    triggerHaptic('heavy');
  } else if (isCrit) {
    finalPower = basePower * 10;
    floatText = `🎯 КРИТ x10! +${formatNumber(finalPower)} ${getCurrencySymbol()}`;
    floatClass = 'crit';
    soundManager.playCrit();
    triggerHaptic('medium');
  } else {
    soundManager.playTap();
    triggerHaptic('light');
  }

  state.balance += finalPower;
  state.stats.totalEarned += finalPower;
  state.stats.totalTaps += 1;

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
  createFloatingNumber(clientX, clientY, floatText, floatClass);

  updateHeader();
  renderEarningsScreen();
  updateBusinessAffordability();
  maybeSpawnRainbowDollar();
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

function createFloatingNumber(x, y, text, extraClass = '') {
  if (!particlesContainer) return;
  const rect = particlesContainer.getBoundingClientRect();
  const posX = (x || (rect.left + rect.width / 2)) - rect.left;
  const posY = (y || (rect.top + rect.height / 2)) - rect.top;

  const el = document.createElement('div');
  el.className = `floating-number ${extraClass}`.trim();
  el.textContent = text;
  
  const offsetX = (Math.random() - 0.5) * 30;
  el.style.left = `${posX + offsetX}px`;
  el.style.top = `${posY}px`;

  particlesContainer.appendChild(el);

  setTimeout(() => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 950);
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

  if ((state.rebirthCount || 0) < (business.reqRebirth || 0)) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

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
  if (state.rebirthCount >= 30) return;
  const req = getNextRebirthRequirement();
  if (calculateNetWorth() < req) return;

  state.rebirthCount += 1;

  // Стартовый капитал из магазина кристаллов
  const startCapLvl = state.crystalShop?.starting_capital || 0;
  const startCaps = [0, 500000, 5000000, 50000000, 500000000, 5000000000];
  const starterMoney = startCaps[startCapLvl] || 0;

  // Сброс ресурсов
  state.balance = starterMoney;
  state.tapLevel = 1;
  state.businesses.forEach(b => b.count = 0);
  state.realEstate.forEach(r => {
    r.owned = false;
    r.onSale = false;
    r.saleCompleted = false;
    r.saleTimeRemaining = 0;
    r.salePrice = 0;
    if (r.upgrades) {
      r.upgrades.forEach(u => u.bought = false);
    }
  });
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
  renderPrestigeScreen();
  updateStatsUI();
  saveGameState();

  switchScreen('screenWallet');
}

// ==========================================
// АЛМАЗНЫЙ ПРЕСТИЖ И МАГАЗИН ЗА КРИСТАЛЛЫ
// ==========================================

const prestigeLevelBadge = document.getElementById('prestigeLevelBadge');
const prestigeCurrentRateVal = document.getElementById('prestigeCurrentRateVal');
const prestigeNextRateVal = document.getElementById('prestigeNextRateVal');
const prestigeProgressBarFill = document.getElementById('prestigeProgressBarFill');
const prestigeCurrentEarnedVal = document.getElementById('prestigeCurrentEarnedVal');
const prestigeProgressPercentVal = document.getElementById('prestigeProgressPercentVal');
const btnDoPrestige = document.getElementById('btnDoPrestige');
const btnDoPrestigeText = document.getElementById('btnDoPrestigeText');
const crystalShopBalanceVal = document.getElementById('crystalShopBalanceVal');
const crystalShopGrid = document.getElementById('crystalShopGrid');

const prestigeConfirmModal = document.getElementById('prestigeConfirmModal');
const prestigeModalLevelText = document.getElementById('prestigeModalLevelText');
const prestigeModalRateVal = document.getElementById('prestigeModalRateVal');
const btnCancelPrestigeModal = document.getElementById('btnCancelPrestigeModal');
const btnConfirmPrestigeModal = document.getElementById('btnConfirmPrestigeModal');
const prestigeReadyBadge = document.getElementById('prestigeReadyBadge');

function renderPrestigeScreen() {
  const currentCount = Math.min(10, Math.max(0, state.prestigeCount || 0));
  const isMax = currentCount >= 10;
  const currentRate = PRESTIGE_CRYSTAL_RATES[currentCount] || 0;
  const nextRate = isMax ? currentRate : (PRESTIGE_CRYSTAL_RATES[currentCount + 1] || 1.0);
  const totalEarned = state.stats?.totalEarned || 0;
  const percent = Math.min(100, (totalEarned / PRESTIGE_REQ_EARNINGS) * 100);
  const canPrestige = !isMax && totalEarned >= PRESTIGE_REQ_EARNINGS;

  if (prestigeLevelBadge) {
    prestigeLevelBadge.textContent = isMax ? 'Престиж 10 / 10 (МАКСИМУМ)' : `Престиж ${currentCount} / 10`;
  }
  if (prestigeCurrentRateVal) {
    prestigeCurrentRateVal.textContent = `+${currentRate.toFixed(2)} 💎 / сек`;
  }
  if (prestigeNextRateVal) {
    prestigeNextRateVal.textContent = isMax ? 'МАКСИМУМ' : `+${nextRate.toFixed(2)} 💎 / сек`;
  }
  if (prestigeProgressBarFill) {
    prestigeProgressBarFill.style.width = `${Math.max(1, percent)}%`;
  }
  if (prestigeCurrentEarnedVal) {
    prestigeCurrentEarnedVal.textContent = `${formatNumber(totalEarned)} ₽`;
  }
  if (prestigeProgressPercentVal) {
    prestigeProgressPercentVal.textContent = `${percent.toFixed(1)}%`;
  }

  if (btnDoPrestige) {
    if (isMax) {
      btnDoPrestige.disabled = true;
      if (btnDoPrestigeText) btnDoPrestigeText.textContent = '✨ Достигнут Максимальный Престиж (10/10)';
    } else if (canPrestige) {
      btnDoPrestige.disabled = false;
      if (btnDoPrestigeText) btnDoPrestigeText.textContent = `💎 Совершить Престиж ${currentCount + 1}/10`;
    } else {
      btnDoPrestige.disabled = true;
      if (btnDoPrestigeText) btnDoPrestigeText.textContent = `Требуется 1 Квадриллион ₽ (${percent.toFixed(1)}%)`;
    }
  }

  if (prestigeReadyBadge) {
    prestigeReadyBadge.style.display = canPrestige ? 'block' : 'none';
  }

  renderCrystalShop();
}

function renderCrystalShop() {
  if (crystalShopBalanceVal) {
    crystalShopBalanceVal.textContent = formatCrystals(state.crystals || 0);
  }
  if (!crystalShopGrid) return;

  crystalShopGrid.innerHTML = '';
  if (!state.crystalShop) {
    state.crystalShop = {
      income_mult: 0,
      tap_mult: 0,
      crystal_haste: 0,
      starting_capital: 0,
      discount: 0,
      rainbow_magnet: 0
    };
  }

  CRYSTAL_SHOP_ITEMS.forEach(item => {
    const currentLevel = state.crystalShop[item.id] || 0;
    const isMax = currentLevel >= item.maxLevel;
    const cost = Math.round(item.baseCost * Math.pow(item.costMult, currentLevel));
    const canAfford = !isMax && (state.crystals || 0) >= cost;

    const card = document.createElement('div');
    card.className = 'crystal-shop-card';
    card.innerHTML = `
      <div class="c-shop-header">
        <div class="c-shop-icon">${item.icon}</div>
        <div class="c-shop-title-wrap">
          <span class="c-shop-name">${item.name}</span>
          <span class="c-shop-level">Уровень: ${currentLevel} / ${item.maxLevel}</span>
        </div>
      </div>
      <div class="c-shop-desc">${item.desc}</div>
      <div class="c-shop-bonus-tag">Текущий бонус: ${item.getBonusText(currentLevel)}</div>
      <button class="btn-buy-crystal-item" data-item-id="${item.id}" ${canAfford ? '' : 'disabled'}>
        <span>${isMax ? 'МАКСИМУМ' : `Купить за ${cost} 💎`}</span>
      </button>
    `;

    const buyBtn = card.querySelector('.btn-buy-crystal-item');
    if (buyBtn && !isMax) {
      bindTouchClick(buyBtn, (e) => {
        e.stopPropagation();
        buyCrystalShopItem(item.id);
      });
    }

    crystalShopGrid.appendChild(card);
  });
}

function buyCrystalShopItem(id) {
  const item = CRYSTAL_SHOP_ITEMS.find(x => x.id === id);
  if (!item) return;
  if (!state.crystalShop) state.crystalShop = {};

  const currentLevel = state.crystalShop[id] || 0;
  if (currentLevel >= item.maxLevel) return;

  const cost = Math.round(item.baseCost * Math.pow(item.costMult, currentLevel));
  if ((state.crystals || 0) < cost) {
    soundManager.playError();
    triggerHaptic('error');
    return;
  }

  state.crystals -= cost;
  state.crystalShop[id] = currentLevel + 1;

  soundManager.playUpgrade();
  triggerHaptic('success');

  updateHeader();
  renderCrystalShop();
  saveGameState();
}

function openPrestigeConfirmModal() {
  const currentCount = Math.min(10, Math.max(0, state.prestigeCount || 0));
  if (currentCount >= 10 || (state.stats?.totalEarned || 0) < PRESTIGE_REQ_EARNINGS) return;

  const nextCount = currentCount + 1;
  const nextRate = PRESTIGE_CRYSTAL_RATES[nextCount] || 1.0;

  if (prestigeModalLevelText) {
    prestigeModalLevelText.textContent = `Переход на уровень престижа: ${nextCount} / 10`;
  }
  if (prestigeModalRateVal) {
    prestigeModalRateVal.textContent = `+${nextRate.toFixed(2)} 💎 / сек`;
  }
  if (prestigeConfirmModal) {
    prestigeConfirmModal.classList.add('active');
  }
  soundManager.playTap();
}

function closePrestigeConfirmModal() {
  if (prestigeConfirmModal) {
    prestigeConfirmModal.classList.remove('active');
  }
}

function doDiamondPrestige() {
  if ((state.stats?.totalEarned || 0) < PRESTIGE_REQ_EARNINGS) return;
  if ((state.prestigeCount || 0) >= 10) return;

  state.prestigeCount = Math.min(10, (state.prestigeCount || 0) + 1);

  // Стартовый капитал из магазина кристаллов
  const startCapLvl = state.crystalShop?.starting_capital || 0;
  const startCaps = [0, 500000, 5000000, 50000000, 500000000, 5000000000];
  const starterMoney = startCaps[startCapLvl] || 0;

  // ПОЛНЫЙ ВАЙП ВСЕХ ДАННЫХ ПО ТЗ:
  // "ВСЕ сбрасывается даже предметы и игрок начинает заново и также перерождения тоже сбрасываются"
  state.balance = starterMoney;
  state.tapLevel = 1;
  state.clickModifiers = { power_mult: 0, crit_tap: 0, resonance: 0, golden_touch: 0 };
  state.rebirthCount = 0; // СБРОС ВСЕХ ПЕРЕРОЖДЕНИЙ В 0!
  state.inventory = {};   // СБРОС ВСЕХ ПРЕДМЕТОВ!
  state.sideJobs = JSON.parse(JSON.stringify(DEFAULT_SIDE_JOBS));
  state.businesses = JSON.parse(JSON.stringify(DEFAULT_BUSINESSES));
  state.realEstate = JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE));
  state.airline = JSON.parse(JSON.stringify(DEFAULT_AIRLINE));
  state.rainbowBoost = { active: false, timeLeft: 0, multiplier: 5 };
  state.market = { lastUpdate: Date.now(), multipliers: {} };
  
  if (!state.stats) state.stats = {};
  state.stats.totalEarned = starterMoney;
  state.stats.totalTaps = 0;

  closePrestigeConfirmModal();

  soundManager.playCaseWin('mythic');
  triggerHaptic('success');

  applyTheme();
  updateHeader();
  renderEarningsScreen();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();
  renderPrestigeScreen();
  saveGameState();

  alert(`💎 АЛМАЗНЫЙ ПРЕСТИЖ ВЫПОЛНЕН!\n\nУровень престижа: ${state.prestigeCount}/10\nДобыча кристаллов: +${PRESTIGE_CRYSTAL_RATES[state.prestigeCount]} 💎 / сек навсегда!`);
}

bindTouchClick(btnDoPrestige, openPrestigeConfirmModal);
bindTouchClick(btnCancelPrestigeModal, closePrestigeConfirmModal);
bindTouchClick(btnConfirmPrestigeModal, doDiamondPrestige);
prestigeConfirmModal?.addEventListener('click', (e) => {
  if (e.target === prestigeConfirmModal) closePrestigeConfirmModal();
});

const screens = {
  screenWallet: document.getElementById('screenWallet'),
  screenEarnings: document.getElementById('screenEarnings'),
  screenBusiness: document.getElementById('screenBusiness'),
  screenCases: document.getElementById('screenCases'),
  screenRealEstate: document.getElementById('screenRealEstate'),
  screenSettings: document.getElementById('screenSettings'),
  screenPrestige: document.getElementById('screenPrestige')
};

const navTabs = {
  screenWallet: document.getElementById('navTabWallet'),
  screenEarnings: document.getElementById('navTabEarnings'),
  screenBusiness: document.getElementById('navTabBusiness'),
  screenCases: document.getElementById('navTabCases'),
  screenRealEstate: document.getElementById('navTabRealEstate'),
  screenPrestige: document.getElementById('navTabPrestige')
};

let previousActiveScreenId = 'screenWallet';

function switchScreen(targetScreenId) {
  if (targetScreenId !== 'screenSettings') {
    previousActiveScreenId = targetScreenId;
  }

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
  if (targetScreenId === 'screenSettings') {
    updateStatsUI();
    renderCurrencyGrid();
    updateVolumeUI();
    renderThemesSelector();
  }
  if (targetScreenId === 'screenBusiness') renderBusinesses();
  if (targetScreenId === 'screenCases') {
    showCasesShopView();
  }
  if (targetScreenId === 'screenRealEstate') {
    renderRealEstate();
    renderLeaderboard();
    updateRebirthUI();
  }
  if (targetScreenId === 'screenPrestige') {
    renderPrestigeScreen();
  }

  soundManager.playTap();
  triggerHaptic('light');
}

// Кнопка открытия/закрытия настроек в шапке
if (btnHeaderSettings) {
  bindTouchClick(btnHeaderSettings, () => {
    if (screens.screenSettings && screens.screenSettings.classList.contains('active')) {
      switchScreen(previousActiveScreenId || 'screenWallet');
    } else {
      switchScreen('screenSettings');
    }
  });
}

// Кнопка назад из экрана настроек
if (btnBackFromSettings) {
  bindTouchClick(btnBackFromSettings, () => {
    switchScreen(previousActiveScreenId || 'screenWallet');
  });
}

// Кнопка быстрого перехода в заработок с кошелька
if (btnGoEarnings) {
  bindTouchClick(btnGoEarnings, () => {
    switchScreen('screenEarnings');
  });
}

document.querySelectorAll('.nav-tab, .nav-tab-center').forEach(btn => {
  bindTouchClick(btn, () => {
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

if (subtabCatalog) bindTouchClick(subtabCatalog, () => switchRealEstateSubtab('catalog'));
if (subtabLeaderboard) bindTouchClick(subtabLeaderboard, () => switchRealEstateSubtab('leaderboard'));
if (subtabRebirth) bindTouchClick(subtabRebirth, () => switchRealEstateSubtab('rebirth'));

if (headerRebirthBadge) {
  bindTouchClick(headerRebirthBadge, () => {
    switchScreen('screenRealEstate');
    switchRealEstateSubtab('rebirth');
  });
}

// Кнопка вызова модалки перерождения
if (btnDoRebirth) {
  bindTouchClick(btnDoRebirth, () => {
    const nextMult = getRebirthMultiplier(state.rebirthCount + 1);
    modalNewMultiplier.textContent = `x${nextMult.toFixed(1)}`;
    rebirthModal.classList.add('active');
  });
}

if (btnCancelRebirth) {
  bindTouchClick(btnCancelRebirth, () => {
    rebirthModal.classList.remove('active');
  });
}

if (btnConfirmRebirth) {
  bindTouchClick(btnConfirmRebirth, () => {
    rebirthModal.classList.remove('active');
    performRebirth();
  });
}

// ==========================================
// СЛУШАТЕЛИ КЕЙСОВ И ИНВЕНТАРЯ
// ==========================================

if (btnOpenNoviceCase) bindTouchClick(btnOpenNoviceCase, () => openCase('novice'));
if (btnOpenBronzeCase) bindTouchClick(btnOpenBronzeCase, () => openCase('bronze'));
if (btnOpenSilverCase) bindTouchClick(btnOpenSilverCase, () => openCase('silver'));
if (btnOpenGoldCase) bindTouchClick(btnOpenGoldCase, () => openCase('gold'));
if (btnOpenDiamondCase) bindTouchClick(btnOpenDiamondCase, () => openCase('diamond'));
if (btnOpenCryptoCase) bindTouchClick(btnOpenCryptoCase, () => openCase('crypto'));
if (btnOpenPropertyCase) bindTouchClick(btnOpenPropertyCase, () => openCase('property'));
if (btnOpenCyberpunkCase) bindTouchClick(btnOpenCyberpunkCase, () => openCase('cyberpunk'));
if (btnOpenSpaceCase) bindTouchClick(btnOpenSpaceCase, () => openCase('space'));
if (btnOpenMythicCase) bindTouchClick(btnOpenMythicCase, () => openCase('mythic'));

if (btnToggleInventory) bindTouchClick(btnToggleInventory, toggleCasesViews);
if (btnBackToCases) bindTouchClick(btnBackToCases, showCasesShopView);

document.querySelectorAll('.inv-chip').forEach(chip => {
  bindTouchClick(chip, () => {
    document.querySelectorAll('.inv-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.getAttribute('data-filter') || 'all';
    renderInventory(filter);
    soundManager.playTap();
  });
});

if (btnCloseCaseModal) bindTouchClick(btnCloseCaseModal, closeCaseModal);
if (btnCaseCollect) bindTouchClick(btnCaseCollect, closeCaseModal);

if (btnCaseReopen) {
  bindTouchClick(btnCaseReopen, () => {
    if (currentOpeningCaseId) {
      if (state.balance < CASE_TYPES[currentOpeningCaseId].cost) {
        soundManager.playError();
        triggerHaptic('error');
        return;
      }
      openCase(currentOpeningCaseId);
    }
  });
}

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

  // Добыча кристаллов от Алмазного Престижа
  const crystalPerSec = getCrystalPassiveIncome();
  if (crystalPerSec > 0 && delta > 0) {
    const crystalsGained = crystalPerSec * delta;
    state.crystals = (state.crystals || 0) + crystalsGained;
    updateHeader();
  }

  // Обновление экрана престижа в реальном времени, если он открыт
  if (screens.screenPrestige && screens.screenPrestige.classList.contains('active')) {
    const totalEarned = state.stats?.totalEarned || 0;
    const percent = Math.min(100, (totalEarned / PRESTIGE_REQ_EARNINGS) * 100);
    if (prestigeProgressBarFill) prestigeProgressBarFill.style.width = `${Math.max(1, percent)}%`;
    if (prestigeCurrentEarnedVal) prestigeCurrentEarnedVal.textContent = `${formatNumber(totalEarned)} ₽`;
    if (prestigeProgressPercentVal) prestigeProgressPercentVal.textContent = `${percent.toFixed(1)}%`;
    if (crystalShopBalanceVal) crystalShopBalanceVal.textContent = formatCrystals(state.crystals || 0);

    const currentCount = Math.min(10, Math.max(0, state.prestigeCount || 0));
    const isMax = currentCount >= 10;
    const canPrestige = !isMax && totalEarned >= PRESTIGE_REQ_EARNINGS;
    if (btnDoPrestige) {
      if (isMax) {
        btnDoPrestige.disabled = true;
      } else if (canPrestige) {
        btnDoPrestige.disabled = false;
        if (btnDoPrestigeText) btnDoPrestigeText.textContent = `💎 Совершить Престиж ${currentCount + 1}/10`;
      } else {
        btnDoPrestige.disabled = true;
        if (btnDoPrestigeText) btnDoPrestigeText.textContent = `Требуется 1 Квадриллион ₽ (${percent.toFixed(1)}%)`;
      }
    }
  }

  // Обновление таймеров флиппинга недвижимости
  let estateUpdated = false;
  if (state.realEstate) {
    state.realEstate.forEach(estate => {
      if (estate.owned && estate.onSale && !estate.saleCompleted) {
        estate.saleTimeRemaining = Math.max(0, (estate.saleTimeRemaining || 0) - delta);
        if (estate.saleTimeRemaining <= 0) {
          estate.saleCompleted = true;
          soundManager.playUpgrade();
          triggerHaptic('success');
        }
        estateUpdated = true;
      }
    });
  }

  if (estateUpdated) {
    if (currentInspectedEstateId) {
      updateEstateModalUI();
    }
  }

  // Обновление таймера рынка инвентаря
  if (state.market && state.market.lastUpdate) {
    const elapsed = Date.now() - state.market.lastUpdate;
    if (elapsed >= 3600 * 1000) {
      updateMarketMultipliers(true);
    } else if (marketTimerDisplay) {
      const remSec = Math.max(0, 3600 - Math.floor(elapsed / 1000));
      marketTimerDisplay.textContent = 'Обновление цен через: ' + formatSeconds(remSec);
    }
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

  // Обработка таймера радужного буста
  if (state.rainbowBoost && state.rainbowBoost.active) {
    rainbowSecondAccumulator += delta;
    if (rainbowSecondAccumulator >= 1) {
      state.rainbowBoost.timeLeft -= Math.floor(rainbowSecondAccumulator);
      rainbowSecondAccumulator = 0;
      if (state.rainbowBoost.timeLeft <= 0) {
        state.rainbowBoost.active = false;
        state.rainbowBoost.timeLeft = 0;
        soundManager.playUpgrade();
      }
      updateRainbowBannerUI();
      updateHeader();
      renderEarningsScreen();
    }
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
      state.rebirthCount = typeof saved.rebirthCount === 'number' ? Math.min(30, saved.rebirthCount) : 0;
      state.currency = saved.currency && CURRENCIES[saved.currency] ? saved.currency : 'RUB';
      state.volume = typeof saved.volume === 'number' ? saved.volume : 80;
      state.vibration = typeof saved.vibration === 'boolean' ? saved.vibration : true;
      if (typeof saved.selectedThemeId === 'string' || saved.selectedThemeId === null) {
        state.selectedThemeId = saved.selectedThemeId;
      }

      state.crystals = typeof saved.crystals === 'number' ? saved.crystals : 0;
      state.prestigeCount = typeof saved.prestigeCount === 'number' ? Math.min(10, Math.max(0, saved.prestigeCount)) : 0;
      if (saved.crystalShop && typeof saved.crystalShop === 'object') {
        state.crystalShop = {
          income_mult: typeof saved.crystalShop.income_mult === 'number' ? saved.crystalShop.income_mult : 0,
          tap_mult: typeof saved.crystalShop.tap_mult === 'number' ? saved.crystalShop.tap_mult : 0,
          crystal_haste: typeof saved.crystalShop.crystal_haste === 'number' ? saved.crystalShop.crystal_haste : 0,
          starting_capital: typeof saved.crystalShop.starting_capital === 'number' ? saved.crystalShop.starting_capital : 0,
          discount: typeof saved.crystalShop.discount === 'number' ? saved.crystalShop.discount : 0,
          rainbow_magnet: typeof saved.crystalShop.rainbow_magnet === 'number' ? saved.crystalShop.rainbow_magnet : 0
        };
      }
      if (saved.clickModifiers && typeof saved.clickModifiers === 'object') {
        state.clickModifiers = {
          power_mult: typeof saved.clickModifiers.power_mult === 'number' ? saved.clickModifiers.power_mult : 0,
          crit_tap: typeof saved.clickModifiers.crit_tap === 'number' ? saved.clickModifiers.crit_tap : 0,
          resonance: typeof saved.clickModifiers.resonance === 'number' ? saved.clickModifiers.resonance : 0,
          golden_touch: typeof saved.clickModifiers.golden_touch === 'number' ? saved.clickModifiers.golden_touch : 0
        };
      }
      
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

      // Мерджим недвижимость, улучшения и статус продажи
      if (Array.isArray(saved.realEstate)) {
        state.realEstate.forEach(defaultEstate => {
          const found = saved.realEstate.find(r => r.id === defaultEstate.id);
          if (found) {
            if (typeof found.owned === 'boolean') defaultEstate.owned = found.owned;
            if (typeof found.onSale === 'boolean') defaultEstate.onSale = found.onSale;
            if (typeof found.saleTimeRemaining === 'number') defaultEstate.saleTimeRemaining = found.saleTimeRemaining;
            if (typeof found.saleCompleted === 'boolean') defaultEstate.saleCompleted = found.saleCompleted;
            if (typeof found.salePrice === 'number') defaultEstate.salePrice = found.salePrice;
            if (Array.isArray(found.upgrades) && Array.isArray(defaultEstate.upgrades)) {
              defaultEstate.upgrades.forEach(u => {
                const savedU = found.upgrades.find(x => x.id === u.id);
                if (savedU && typeof savedU.bought === 'boolean') u.bought = savedU.bought;
              });
            }
          }
        });
      }

      // Мерджим рынок инвентаря
      if (saved.market && typeof saved.market === 'object') {
        state.market = saved.market;
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

          // Офлайн-прогресс аукционов недвижимости
          state.realEstate.forEach(estate => {
            if (estate.owned && estate.onSale && !estate.saleCompleted) {
              estate.saleTimeRemaining = Math.max(0, (estate.saleTimeRemaining || 0) - validSeconds);
              if (estate.saleTimeRemaining <= 0) {
                estate.saleCompleted = true;
              }
            }
          });

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
  if (offlineRewardValue) offlineRewardValue.textContent = `+${formatNumber(amount)}`;
  if (offlineModal) offlineModal.classList.add('active');
}

function collectOfflineReward() {
  if (offlineModal) {
    offlineModal.classList.remove('active');
  }
  try {
    soundManager.playUpgrade();
  } catch (e) {}
  try {
    triggerHaptic('success');
  } catch (e) {}
  try {
    updateHeader();
    updateTapUpgradeCard();
    saveGameState();
  } catch (e) {}
}

if (btnCollectOffline) bindTouchClick(btnCollectOffline, collectOfflineReward);
if (btnCloseOfflineModal) bindTouchClick(btnCloseOfflineModal, collectOfflineReward);
offlineModal?.addEventListener('click', (e) => {
  if (e.target === offlineModal) {
    collectOfflineReward();
  }
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

bindTouchClick(btnToggleMute, () => {
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

bindTouchClick(btnTestSound, () => {
  soundManager.playUpgrade();
  triggerHaptic('light');
});

vibrationToggle.addEventListener('change', (e) => {
  state.vibration = e.target.checked;
  if (state.vibration) triggerHaptic('medium');
  saveGameState();
});

bindTouchClick(btnResetProgress, () => {
  resetModal.classList.add('active');
});

bindTouchClick(btnCancelReset, () => {
  resetModal.classList.remove('active');
});

bindTouchClick(btnConfirmReset, () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('money_tapper_save_v1');
  resetModal.classList.remove('active');

  state.balance = 0;
  state.tapLevel = 1;
  state.selectedThemeId = null;
  state.rainbowBoost = { active: false, timeLeft: 0, multiplier: 5 };
  state.rebirthCount = 0;
  state.currency = 'RUB';
  state.volume = 80;
  state.vibration = true;
  state.sideJobs = JSON.parse(JSON.stringify(DEFAULT_SIDE_JOBS));
  state.crystals = 0;
  state.prestigeCount = 0;
  state.crystalShop = {
    income_mult: 0,
    tap_mult: 0,
    crystal_haste: 0,
    starting_capital: 0,
    discount: 0,
    rainbow_magnet: 0
  };
  state.clickModifiers = { power_mult: 0, crit_tap: 0, resonance: 0, golden_touch: 0 };
  state.businesses = JSON.parse(JSON.stringify(DEFAULT_BUSINESSES));
  state.realEstate = JSON.parse(JSON.stringify(DEFAULT_REAL_ESTATE));
  state.airline = JSON.parse(JSON.stringify(DEFAULT_AIRLINE));
  state.inventory = {};
  state.market = { lastUpdate: Date.now(), multipliers: {} };
  state.stats = { totalEarned: 0, totalTaps: 0, playTimeSeconds: 0 };

  soundManager.setVolume(state.volume);
  vibrationToggle.checked = true;

  applyTheme();
  updateRainbowBannerUI();
  updateVolumeUI();
  renderCurrencyGrid();
  renderThemesSelector();
  updateCurrencySymbols();
  updateHeader();
  updateTapUpgradeCard();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();
  renderPrestigeScreen();
  updateStatsUI();
  switchScreen('screenWallet');

  soundManager.playUpgrade();
});

// Слушатели модальных окон ангара и авиакомпании
if (btnCloseHangar) bindTouchClick(btnCloseHangar, closeHangarModal);
if (btnCancelRenameAirline) bindTouchClick(btnCancelRenameAirline, closeRenameModal);
if (btnSaveAirlineName) bindTouchClick(btnSaveAirlineName, saveAirlineName);

// Слушатели модального окна кристаллов
const crystalsPill = document.getElementById('crystalsPill');
const crystalsInfoModal = document.getElementById('crystalsInfoModal');
const btnCloseCrystalsModal = document.getElementById('btnCloseCrystalsModal');
const btnOkCrystalsModal = document.getElementById('btnOkCrystalsModal');
const modalCrystalsVal = document.getElementById('modalCrystalsVal');

if (crystalsPill) {
  bindTouchClick(crystalsPill, (e) => {
    e.stopPropagation();
    if (modalCrystalsVal) modalCrystalsVal.textContent = formatCrystals(state.crystals || 0);
    crystalsInfoModal?.classList.add('active');
    soundManager.playTap();
  });
}

const closeCrystalsModal = () => {
  crystalsInfoModal?.classList.remove('active');
};
if (btnCloseCrystalsModal) bindTouchClick(btnCloseCrystalsModal, closeCrystalsModal);
if (btnOkCrystalsModal) bindTouchClick(btnOkCrystalsModal, closeCrystalsModal);
crystalsInfoModal?.addEventListener('click', (e) => {
  if (e.target === crystalsInfoModal) closeCrystalsModal();
});

// Слушатель кликов по купюре и по фону кошелька
tapTarget?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleTap(e.clientX, e.clientY, e);
});

screens.screenWallet?.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button, input, select, a, .btn-upgrade-click, .btn-go-earnings, .rate-pill')) return;
  e.preventDefault();
  handleTap(e.clientX, e.clientY, e);
});

if (btnUpgradeClick) {
  bindTouchClick(btnUpgradeClick, () => {
    upgradeTap();
  });
}

setInterval(saveGameState, 3000);
window.addEventListener('beforeunload', saveGameState);

// ==========================================
// СТАРТ ИГРЫ
// ==========================================

function initGame() {
  loadGameState();
  
  vibrationToggle.checked = state.vibration;
  updateVolumeUI();
  renderCurrencyGrid();
  updateCurrencySymbols();
  updateHeader();
  updateTapUpgradeCard();
  renderBusinesses();
  renderRealEstate();
  renderLeaderboard();
  updateRebirthUI();

  
  // Слушатели модального окна деталей недвижимости
  if (btnCloseEstateModal) bindTouchClick(btnCloseEstateModal, closeEstateModal);
  estateDetailModal?.addEventListener('click', (e) => {
    if (e.target === estateDetailModal) closeEstateModal();
  });

  if (btnStartEstateFlip) {
    bindTouchClick(btnStartEstateFlip, () => {
      if (currentInspectedEstateId) {
        startEstateFlip(currentInspectedEstateId);
      }
    });
  }

  if (btnCollectEstateFlip) {
    bindTouchClick(btnCollectEstateFlip, () => {
      if (currentInspectedEstateId) {
        collectEstateFlip(currentInspectedEstateId);
      }
    });
  }

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
