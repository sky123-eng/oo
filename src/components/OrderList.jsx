import { useState, useEffect } from 'react';
import { getBuyerOrders, getSellerOrders, updateOrderStatus } from '../utils/order';
import { formatDate, formatPrice } from '../utils/formatters';
import ItemLocationMap from './ItemLocationMap';
import { HomeIcon } from './Icons';

/**
 * 订单列表组件
 * @param {string} mode - 'buyer' 或 'seller'
 * @param {function} onBack - 返回功能页面的回调函数
 */
const OrderList = ({ mode = 'buyer', onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, confirmed, completed

  // 加载订单
  useEffect(() => {
    loadOrders();
  }, [mode]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = mode === 'buyer' 
        ? await getBuyerOrders()
        : await getSellerOrders('current_seller'); // 实际应用中应使用真实 sellerId
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // 获取状态标签
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-[#E60023]/20 text-white border border-[#E60023]/30',
      confirmed: 'bg-[#0066CC]/20 text-[#0066CC] border border-[#0066CC]/30',
      completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    const labels = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  // 处理订单状态更新
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert('订单状态已更新');
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('更新失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60023] mx-auto"></div>
        <p className="text-[#a0a0a0] mt-2">加载中...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#E60023]/30 rounded-lg p-6 animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium flex items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            返回首页
          </button>
        )}
        <h2 className="text-2xl font-bold text-white">
          {mode === 'buyer' ? '我的订单（买方）' : '我的订单（卖方）'}
        </h2>
      </div>

      {/* 订单详情 */}
      {selectedOrder ? (
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">订单信息</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#a0a0a0]">订单号</p>
                <p className="font-medium text-white">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-[#a0a0a0]">状态</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-[#a0a0a0]">商品名称</p>
                <p className="font-medium text-white">{selectedOrder.itemTitle}</p>
              </div>
              <div>
                <p className="text-[#a0a0a0]">创建时间</p>
                <p className="font-medium text-white">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-[#a0a0a0]">支付方式</p>
                <p className="font-medium text-white">
                  {selectedOrder.paymentMethod === 'valuePoints'
                    ? `使用 ${selectedOrder.valuePointsUsed} 价值点`
                    : `现金 ${formatPrice(selectedOrder.amount)}`}
                </p>
              </div>
            </div>
          </div>

          {/* 位置信息 */}
          {selectedOrder.location && (
            <div>
              <h3 className="font-semibold text-white mb-3">取货位置</h3>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mb-3">
                <p className="text-sm text-[#a0a0a0] mb-1">地址</p>
                <p className="font-medium text-white">{selectedOrder.location.address}</p>
                {selectedOrder.location.contactInfo && (
                  <p className="text-sm text-[#a0a0a0] mt-2">
                    联系方式: {selectedOrder.location.contactInfo}
                  </p>
                )}
              </div>
              <ItemLocationMap
                latitude={selectedOrder.location.latitude}
                longitude={selectedOrder.location.longitude}
                address={selectedOrder.location.address}
                itemTitle={selectedOrder.itemTitle}
                height={300}
              />
            </div>
          )}

          {/* 操作按钮 */}
          {mode === 'seller' && selectedOrder.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium shadow-md shadow-white/20"
              >
                确认订单
              </button>
              <button
                onClick={() => {
                  if (window.confirm('确定要取消这个订单吗？')) {
                    handleUpdateStatus(selectedOrder.id, 'cancelled');
                  }
                }}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
              >
                取消订单
              </button>
            </div>
          )}

          {mode === 'buyer' && selectedOrder.status === 'confirmed' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium shadow-md shadow-white/20"
              >
                确认收货
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 标签页 */}
          <div className="flex border-b border-[#2a2a2a] mb-4">
            {['all', 'pending', 'confirmed', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#E60023] text-white'
                    : 'text-[#a0a0a0] hover:text-white'
                }`}
              >
                {tab === 'all' ? '全部' :
                 tab === 'pending' ? '待确认' :
                 tab === 'confirmed' ? '已确认' :
                 '已完成'}
                {tab !== 'all' && (
                  <span className="ml-2 text-xs bg-[#1a1a1a] border border-[#E60023]/30 text-white px-2 py-0.5 rounded">
                    {orders.filter(o => o.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 订单列表 */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-[#a0a0a0]">
              <p>还没有订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 border border-[#E60023]/30 bg-[#1a1a1a] rounded-lg hover:bg-[#E60023]/10 transition-all cursor-pointer card-hover group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white group-hover:text-white transition-colors">{order.itemTitle}</h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-[#a0a0a0] space-y-1">
                        <p>订单号: {order.id}</p>
                        <p>
                          支付: {order.paymentMethod === 'valuePoints'
                            ? `${order.valuePointsUsed} 价值点`
                            : formatPrice(order.amount)}
                        </p>
                        <p>时间: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;

