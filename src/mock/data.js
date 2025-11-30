/**
 * Mock 数据 - 示例商品数据
 * 用于初始化项目，实际数据会存储在 localStorage 中
 */

export const mockItems = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256GB',
    description: '九成新 iPhone 13 Pro Max，256GB 存储，原装充电器和数据线，无拆修，功能完好。',
    price: 5999,
    category: '电子产品',
    condition: '九成新',
    images: [],
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Nike Air Max 270 运动鞋',
    description: '全新未穿，尺码 42，原盒包装，支持验货。',
    price: 699,
    category: '运动户外',
    condition: '全新',
    images: [],
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    title: 'MacBook Pro 14寸 M1 Pro',
    description: '2021款 MacBook Pro 14寸，M1 Pro 芯片，16GB 内存，512GB 存储，使用一年，外观良好。',
    price: 12999,
    category: '电子产品',
    condition: '九成新',
    images: [],
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '4',
    title: '宜家书桌 白色',
    description: '八成新宜家书桌，尺寸 120x60cm，白色，轻微使用痕迹，功能完好。',
    price: 299,
    category: '家具家电',
    condition: '八成新',
    images: [],
    createdAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '5',
    title: '《JavaScript 高级程序设计》第四版',
    description: '正版图书，九成新，无笔记无划痕，适合学习前端开发。',
    price: 89,
    category: '图书文具',
    condition: '九成新',
    images: [],
    createdAt: new Date('2024-01-18').toISOString(),
  },
];

/**
 * 初始化 localStorage 数据（如果为空）
 */
export const initMockData = () => {
  const existing = localStorage.getItem('marketplace_items');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('marketplace_items', JSON.stringify(mockItems));
  }
};

