/**
 * API 接口工具函数
 */

// 后端 API 基础地址
const API_BASE = 'http://localhost:3000/api';

/**
 * 获取所有商品
 * @returns {Promise<Array>} 商品列表
 */
export const getItems = async () => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch(`${API_BASE}/items`);
  // return response.json();
  
  // 当前从 localStorage 读取
  const items = localStorage.getItem('marketplace_items');
  return items ? JSON.parse(items) : [];
};

/**
 * 创建新商品
 * @param {Object} item - 商品数据
 * @returns {Promise<Object>} 创建的商品
 */
export const createItem = async (item) => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch(`${API_BASE}/items`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(item),
  // });
  // return response.json();
  
  // 当前保存到 localStorage
  const items = await getItems();
  const newItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem('marketplace_items', JSON.stringify(items));
  return newItem;
};

/**
 * 更新商品
 * @param {string} id - 商品 ID
 * @param {Object} item - 更新的商品数据
 * @returns {Promise<Object>} 更新后的商品
 */
export const updateItem = async (id, item) => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch(`${API_BASE}/items/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(item),
  // });
  // return response.json();
  
  // 当前更新 localStorage
  const items = await getItems();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...item, updatedAt: new Date().toISOString() };
    localStorage.setItem('marketplace_items', JSON.stringify(items));
    return items[index];
  }
  throw new Error('Item not found');
};

/**
 * 删除商品
 * @param {string} id - 商品 ID
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  // TODO: 替换为实际 API 调用
  // await fetch(`${API_BASE}/items/${id}`, {
  //   method: 'DELETE',
  // });
  
  // 当前从 localStorage 删除
  const items = await getItems();
  const filtered = items.filter(i => i.id !== id);
  localStorage.setItem('marketplace_items', JSON.stringify(filtered));
};

// ========================= 交易相关 API =========================

/**
 * 创建交易
 * @param {Object} transaction - 交易数据
 * @returns {Promise<Object>} 创建的交易
 */
export const createTransaction = async (transaction) => {
  try {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `创建交易失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('创建交易时出错:', error);
    throw error;
  }
};

/**
 * 获取交易列表
 * @param {Object} filters - 过滤条件
 * @returns {Promise<Array>} 交易列表
 */
export const getTransactions = async (filters = {}) => {
  try {
    // 构建查询参数
    const params = new URLSearchParams();
    if (filters.fromUserId) params.append('fromUserId', filters.fromUserId);
    if (filters.toUserId) params.append('toUserId', filters.toUserId);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    
    const queryString = params.toString();
    const url = queryString ? `${API_BASE}/transactions?${queryString}` : `${API_BASE}/transactions`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`获取交易列表失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取交易列表时出错:', error);
    throw error;
  }
};

/**
 * 获取交易详情
 * @param {string} id - 交易 ID
 * @returns {Promise<Object>} 交易详情
 */
export const getTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/transactions/${id}`);
    
    if (!response.ok) {
      throw new Error(`获取交易详情失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取交易详情时出错:', error);
    throw error;
  }
};

/**
 * 审核交易
 * @param {string} id - 交易 ID
 * @param {Object} reviewData - 审核数据
 * @returns {Promise<Object>} 审核后的交易
 */
export const reviewTransaction = async (id, reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/transactions/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `审核交易失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('审核交易时出错:', error);
    throw error;
  }
};

