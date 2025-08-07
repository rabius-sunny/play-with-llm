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
