// products.js – Product database
// New Life Laptops

const products = [
  {
    id: 1,
    name: 'HP EliteBook 820 G3',
    brand: 'HP',
    model: 'EliteBook 820 G3',
    category: 'budget',
    processor: 'Intel Core i5-6200U (2.3GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    display: '12.5" HD Anti-Glare',
    os: 'Windows 11 Pro',
    condition: 'Grade B – Good',
    battery: 'Holds 70%+ charge',
    price: 169.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'Best Value',
    description: 'A compact, durable business laptop perfect for everyday tasks. Features a fast SSD, solid battery life, and comes with Windows 11 Pro pre-installed.',
    features: [
      'Fast 256GB SSD – near-instant boot',
      'Windows 11 Pro pre-installed & activated',
      'Compact 12.5" form factor – easy to carry',
      'Dual-core Intel Core i5 6th Gen',
      'USB 3.0, HDMI, VGA, SD card ports'
    ]
  },
  {
    id: 2,
    name: 'Lenovo ThinkPad T430',
    brand: 'Lenovo',
    model: 'ThinkPad T430',
    category: 'budget',
    processor: 'Intel Core i5-3320M (2.6GHz)',
    ram: '8GB DDR3',
    storage: '500GB HDD',
    display: '14" HD TN',
    os: 'Windows 10 Pro',
    condition: 'Grade B – Good',
    battery: 'Holds 60%+ charge',
    price: 149.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: null,
    description: 'The legendary ThinkPad build quality at an unbeatable price. Rock-solid keyboard, durable chassis — perfect for students and everyday users.',
    features: [
      'Legendary ThinkPad durability',
      'Military-grade build standard (MIL-SPEC)',
      'Full-size keyboard with numpad',
      'Multiple USB 3.0 and display ports',
      'Windows 10 Pro included'
    ]
  },
  {
    id: 3,
    name: 'Dell Latitude E7470',
    brand: 'Dell',
    model: 'Latitude E7470',
    category: 'business',
    processor: 'Intel Core i5-6300U (2.4GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    display: '14" FHD IPS',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'Holds 80%+ charge',
    price: 249.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'Popular',
    description: 'A premium business ultrabook with a stunning Full HD display. Slim, lightweight, and powerful — ideal for professionals on the go.',
    features: [
      'Full HD 1080p IPS display',
      'Ultra-slim & lightweight design',
      'Intel 6th Gen Core i5 – fast & efficient',
      'Fast 256GB SSD storage',
      'Windows 11 Pro ready'
    ]
  },
  {
    id: 4,
    name: 'HP EliteBook 840 G4',
    brand: 'HP',
    model: 'EliteBook 840 G4',
    category: 'business',
    processor: 'Intel Core i7-7600U (2.8GHz)',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    display: '14" FHD IPS',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'Holds 85%+ charge',
    price: 389.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'Premium',
    description: 'Top-tier business performance with a Core i7 processor and 16GB RAM. Handles everything from presentations to heavy multitasking with ease.',
    features: [
      'Intel Core i7 7th Gen – peak performance',
      '16GB DDR4 RAM for heavy multitasking',
      '512GB SSD – blazing-fast storage',
      'HP enterprise build quality',
      'Windows 11 Pro pre-installed'
    ]
  },
  {
    id: 5,
    name: 'Lenovo ThinkPad T470',
    brand: 'Lenovo',
    model: 'ThinkPad T470',
    category: 'student',
    processor: 'Intel Core i5-7300U (2.6GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    display: '14" FHD IPS',
    os: 'Windows 11 Home',
    condition: 'Grade A – Excellent',
    battery: 'Holds 80%+ charge (dual battery)',
    price: 199.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'Student Pick',
    description: 'The ideal student laptop with legendary ThinkPad reliability. Dual battery design offers incredible battery life — perfect for long school days.',
    features: [
      'Dual battery design – exceptional life',
      'Backlit keyboard for night study',
      'Lightweight yet durable',
      'Full HD IPS display',
      'Windows 11 Home included'
    ]
  },
  {
    id: 6,
    name: 'HP ProBook 450 G5',
    brand: 'HP',
    model: 'ProBook 450 G5',
    category: 'student',
    processor: 'Intel Core i5-8250U (1.6GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    display: '15.6" FHD',
    os: 'Windows 11 Home',
    condition: 'Grade B – Good',
    battery: 'Holds 70%+ charge',
    price: 179.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: null,
    description: 'A 15.6" student laptop with 8th Gen Core i5 and a Full HD display. Great screen size for studying, research, and entertainment.',
    features: [
      'Large 15.6" Full HD display',
      '8th Gen Intel Core i5 – latest in class',
      '256GB SSD for fast performance',
      'Numeric keypad included',
      'Windows 11 Home pre-installed'
    ]
  },
  {
    id: 7,
    name: 'Dell Precision 7510',
    brand: 'Dell',
    model: 'Precision 7510',
    category: 'gaming',
    processor: 'Intel Core i7-6820HQ (2.7GHz)',
    ram: '32GB DDR4',
    storage: '512GB SSD',
    display: '15.6" FHD IPS',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'Holds 75%+ charge',
    price: 499.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'High Performance',
    description: 'A mobile workstation with desktop-class power. 32GB RAM and a dedicated NVIDIA Quadro GPU make this ideal for gaming, design, and video editing.',
    features: [
      '32GB DDR4 RAM – maximum multitasking',
      'NVIDIA Quadro M1000M dedicated GPU',
      'Quad-core Intel Core i7 (4 cores)',
      '512GB SSD – fast storage',
      '15.6" Full HD IPS display'
    ]
  },
  {
    id: 8,
    name: 'HP ZBook 15 G4',
    brand: 'HP',
    model: 'ZBook 15 G4',
    category: 'gaming',
    processor: 'Intel Core i7-7700HQ (2.8GHz)',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    display: '15.6" FHD IPS',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'Holds 80%+ charge',
    price: 449.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: null,
    description: "HP's professional mobile workstation engineered for performance. The 7th Gen i7 and NVIDIA GPU handle gaming, streaming, and creative work effortlessly.",
    features: [
      'NVIDIA Quadro M620M dedicated GPU',
      'Intel Core i7 7th Gen (quad-core)',
      '16GB DDR4 RAM',
      '512GB SSD – fast load times',
      '15.6" Full HD IPS anti-glare display'
    ]
  },
  {
    id: 9,
    name: 'Dell OptiPlex 7050',
    brand: 'Dell',
    model: 'OptiPlex 7050',
    category: 'desktop',
    processor: 'Intel Core i7-7700 (3.6GHz)',
    ram: '16GB DDR4',
    storage: '256GB SSD',
    display: 'Monitor Not Included',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'N/A – Desktop Unit',
    price: 299.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: 'Desktop',
    description: 'A powerful mini desktop with desktop-class performance. Perfect for home offices, schools, or anywhere you need reliable computing power without a laptop.',
    features: [
      'Intel Core i7 desktop processor (3.6GHz)',
      '16GB DDR4 RAM',
      '256GB SSD (easily upgradeable)',
      'Small form factor – minimal desk space',
      'Multiple USB 3.0, DisplayPort & HDMI outputs'
    ]
  },
  {
    id: 10,
    name: 'HP EliteDesk 800 G3',
    brand: 'HP',
    model: 'EliteDesk 800 G3',
    category: 'desktop',
    processor: 'Intel Core i5-7500 (3.4GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    display: 'Monitor Not Included',
    os: 'Windows 11 Pro',
    condition: 'Grade A – Excellent',
    battery: 'N/A – Desktop Unit',
    price: 199.99,
    availability: 'in-stock',
    image: 'images/products/placeholder.svg',
    badge: null,
    description: "HP's enterprise-grade mini PC at a fraction of the cost. Quiet, energy-efficient, and built to last — an excellent home or office desktop solution.",
    features: [
      'Intel Core i5 7th Gen (3.4GHz)',
      'Energy-efficient & quiet operation',
      '8GB DDR4 RAM (expandable)',
      '256GB SSD',
      'HP enterprise build quality & reliability'
    ]
  }
];

const featuredProductIds = [3, 5, 9];

function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

function getFeaturedProducts() {
  return featuredProductIds.map(id => getProductById(id)).filter(Boolean);
}
