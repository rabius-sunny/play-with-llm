import { db, products } from './index';

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    price: '999.00',
    specifications:
      '6.1-inch Super Retina XDR display, A17 Pro chip, 48MP camera system, 128GB storage, Titanium build, iOS 17',
    category: 'smartphones'
  },
  {
    name: 'iPhone 16 Pro',
    price: '1999.00',
    specifications:
      '6.1-inch Super Retina DDR display, A18 Pro chip, 50MP camera system, 164GB storage, Titanium build, iOS 19',
    category: 'smartphones'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: '1199.00',
    specifications:
      '6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, 200MP camera, 256GB storage, S Pen included, Android 14',
    category: 'smartphones'
  },
  {
    name: 'MacBook Pro 14-inch M3',
    price: '1599.00',
    specifications:
      '14.2-inch Liquid Retina XDR display, Apple M3 chip, 8GB unified memory, 512GB SSD storage, macOS Sonoma',
    category: 'laptops'
  },
  {
    name: 'Dell XPS 13',
    price: '899.00',
    specifications:
      '13.4-inch InfinityEdge display, Intel Core i7-1360P, 16GB LPDDR5 RAM, 512GB SSD, Windows 11, ultraportable design',
    category: 'laptops'
  },
  {
    name: 'ASUS ROG Gaming Laptop',
    price: '1299.00',
    specifications:
      '15.6-inch FHD 144Hz display, AMD Ryzen 7 6800H, NVIDIA RTX 3060, 16GB DDR5 RAM, 1TB NVMe SSD, RGB keyboard',
    category: 'laptops'
  },
  {
    name: 'HP Pavilion Gaming',
    price: '799.00',
    specifications:
      '15.6-inch FHD IPS display, Intel Core i5-12500H, NVIDIA GTX 1650, 8GB DDR4 RAM, 512GB SSD, backlit keyboard',
    category: 'laptops'
  },
  {
    name: 'Sony WH-1000XM5',
    price: '399.00',
    specifications:
      'Wireless noise-canceling headphones, 30-hour battery life, premium sound quality, touch controls, multipoint connection',
    category: 'headphones'
  },
  {
    name: 'AirPods Pro 2nd Gen',
    price: '249.00',
    specifications:
      'Active noise cancellation, adaptive transparency, spatial audio, H2 chip, up to 6 hours listening time, wireless charging case',
    category: 'headphones'
  },
  {
    name: 'iPad Air 5th Gen',
    price: '599.00',
    specifications:
      '10.9-inch Liquid Retina display, Apple M1 chip, 64GB storage, Wi-Fi 6, Touch ID, Apple Pencil compatible, iPadOS',
    category: 'tablets'
  },
  {
    name: 'Samsung Galaxy Tab S9',
    price: '799.00',
    specifications:
      '11-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, 128GB storage, S Pen included, 120Hz refresh rate, Android 13',
    category: 'tablets'
  },
  {
    name: 'Google Pixel 9 Pro',
    price: '1099.00',
    specifications:
      '6.7-inch LTPO OLED display, Google Tensor G4, 50MP triple camera, 12GB RAM, 256GB storage, Android 15, IP68 water resistance',
    category: 'smartphones'
  },
  {
    name: 'OnePlus 12',
    price: '799.00',
    specifications:
      '6.82-inch AMOLED 120Hz display, Snapdragon 8 Gen 3, 16GB RAM, 512GB storage, 100W fast charging, Android 14',
    category: 'smartphones'
  },
  {
    name: 'MacBook Air 13-inch M3',
    price: '1099.00',
    specifications:
      '13.6-inch Liquid Retina display, Apple M3 chip, 8GB unified memory, 256GB SSD, fanless design, macOS Sequoia',
    category: 'laptops'
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    price: '1499.00',
    specifications:
      '14-inch 2.8K OLED display, Intel Core i7-1370P, 16GB RAM, 1TB SSD, Windows 11 Pro, MIL-STD-810H durability',
    category: 'laptops'
  },
  {
    name: 'Bose QuietComfort Ultra',
    price: '429.00',
    specifications:
      'Wireless noise-canceling headphones, immersive spatial audio, 24-hour battery life, multipoint Bluetooth 5.3, USB-C charging',
    category: 'headphones'
  },
  {
    name: 'Sony WF-1000XM5',
    price: '299.00',
    specifications:
      'True wireless earbuds with industry-leading noise cancelation, 8-hour battery (earbuds) + case, LDAC support, IPX4 rating',
    category: 'headphones'
  },
  {
    name: 'iPad Pro 11-inch M4',
    price: '999.00',
    specifications:
      '11-inch Ultra Retina OLED display, Apple M4 chip, 256GB storage, Wi‑Fi 6E, Face ID, Apple Pencil Pro support, iPadOS',
    category: 'tablets'
  },
  {
    name: 'Amazon Fire HD 10 (2023)',
    price: '149.00',
    specifications:
      '10.1-inch Full HD display, octa-core processor, 3GB RAM, 64GB storage, microSD expansion, up to 13-hour battery, Fire OS',
    category: 'tablets'
  },
  {
    name: 'Apple Watch Series 10',
    price: '399.00',
    specifications:
      '45mm Always‑On Retina display, S10 SiP, GPS, heart rate and ECG, fast charging, swimproof 50m, watchOS 11',
    category: 'smartwatches'
  },
  {
    name: 'Samsung Galaxy Watch7',
    price: '329.00',
    specifications:
      '44mm Super AMOLED display, Exynos W1000, Wear OS, body composition analysis, GPS, 5ATM water resistance, Sapphire crystal',
    category: 'smartwatches'
  },
  // Audio: over‑ear headphones
  {
    name: 'Sennheiser Momentum 4 Wireless',
    price: '349.00',
    specifications:
      'Over-ear wireless headphones with adaptive noise cancelation, up to 60-hour battery life, aptX Adaptive, Bluetooth 5.3, multipoint pairing, fold-flat design',
    category: 'headphones'
  },
  {
    name: 'Beats Studio Pro',
    price: '349.00',
    specifications:
      'Over-ear ANC headphones, personalized spatial audio, USB‑C audio, up to 40-hour battery (ANC off), fast charge, Find My integration',
    category: 'headphones'
  },
  {
    name: 'JBL Tour One M2',
    price: '299.00',
    specifications:
      'Adaptive noise-canceling over-ear headphones, 50-hour battery life, Smart Ambient, multipoint Bluetooth, Google Fast Pair, foldable design',
    category: 'headphones'
  },
  // Audio: TWS earbuds
  {
    name: 'Nothing Ear (2)',
    price: '149.00',
    specifications:
      'True wireless earbuds with active noise cancelation, 11.6mm custom drivers, LHDC high-res audio, up to 36-hour total playtime, IP54 rating, wireless charging case',
    category: 'headphones'
  },
  {
    name: 'Jabra Elite 8 Active',
    price: '199.00',
    specifications:
      'Rugged TWS earbuds with ANC, secure fit for workouts, Dolby Audio, up to 32-hour total battery, IP68 buds/IP54 case, multipoint Bluetooth',
    category: 'headphones'
  },
  {
    name: 'Samsung Galaxy Buds3 Pro',
    price: '229.00',
    specifications:
      'Premium TWS earbuds with intelligent ANC, dual dynamic drivers, 24-bit audio processing, up to 30-hour total battery, Qi wireless charging, seamless Galaxy integration',
    category: 'headphones'
  },
  // Audio: neckband earphones
  {
    name: 'OnePlus Bullets Wireless Z2',
    price: '49.00',
    specifications:
      'Neckband-style wireless earphones, 12.4mm drivers, up to 30-hour playback, fast charging (10 min = 20 hours), Bluetooth 5.0, IP55 water and sweat resistance',
    category: 'headphones'
  },
  {
    name: 'Sony WI-C100',
    price: '49.00',
    specifications:
      'Lightweight neckband wireless earphones, up to 25-hour battery, DSEE sound enhancement, USB-C charging, voice assistant support, splash resistant',
    category: 'headphones'
  },
  {
    name: 'realme Buds Wireless 3',
    price: '39.00',
    specifications:
      'Neckband Bluetooth earphones with 13.6mm dynamic drivers, active noise cancelation, up to 40-hour playback, low-latency mode, magnetic instant connect',
    category: 'headphones'
  }
];

async function seed() {
  console.log('Seeding database...');

  try {
    await db.insert(products).values(sampleProducts);
    console.log('Successfully seeded', sampleProducts.length, 'products');
  } catch (error) {
    console.error('Seeding failed:', error);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
