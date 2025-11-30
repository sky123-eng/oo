/**
 * 订单管理工具函数
 * 处理买方与卖方之间的交易
 */

/**
 * 创建订单（买方兑换卖方的商品）
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} 创建的订单
 */
export const createOrder = async (orderData) => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderData),
  // });
  // return response.json();

  // 当前保存到 localStorage
  const orders = await getOrders();
  const newOrder = {
    ...orderData,
    id: `ORD-${Date.now()}`,
    status: 'pending', // pending: 待确认, confirmed: 已确认, completed: 已完成, cancelled: 已取消
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem('marketplace_orders', JSON.stringify(orders));
  return newOrder;
};

/**
 * 获取所有订单
 * @returns {Promise<Array>} 订单列表
 */
export const getOrders = async () => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch('/api/orders');
  // return response.json();

  // 当前从 localStorage 读取
  const orders = localStorage.getItem('marketplace_orders');
  return orders ? JSON.parse(orders) : [];
};

/**
 * 获取买方的订单
 * @param {string} buyerId - 买方 ID（当前使用 'current_user'）
 * @returns {Promise<Array>} 订单列表
 */
export const getBuyerOrders = async (buyerId = 'current_user') => {
  const orders = await getOrders();
  return orders.filter(order => order.buyerId === buyerId);
};

/**
 * 获取卖方的订单
 * @param {string} sellerId - 卖方 ID
 * @returns {Promise<Array>} 订单列表
 */
export const getSellerOrders = async (sellerId) => {
  const orders = await getOrders();
  return orders.filter(order => order.sellerId === sellerId);
};

/**
 * 更新订单状态
 * @param {string} orderId - 订单 ID
 * @param {string} status - 新状态
 * @returns {Promise<Object>} 更新后的订单
 */
export const updateOrderStatus = async (orderId, status) => {
  // TODO: 替换为实际 API 调用
  // const response = await fetch(`/api/orders/${orderId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status }),
  // });
  // return response.json();

  // 当前更新 localStorage
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('marketplace_orders', JSON.stringify(orders));
    return orders[index];
  }
  throw new Error('Order not found');
};

