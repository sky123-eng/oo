import { useState, useEffect } from 'react';
import ItemLocationMap from './ItemLocationMap';
import { formatPrice, formatDate } from '../utils/formatters';
import { SuccessIcon, NavigationIcon, LocationIcon, CloseIcon, HomeIcon } from './Icons';

/**
 * 结算成功界面组件
 * @param {Object} orderInfo - 订单信息
 * @param {Function} onClose - 关闭回调
 */
const CheckoutSuccess = ({ orderInfo, onClose }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // 获取用户当前位置（用于计算距离）
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('获取位置失败:', error);
        }
      );
    }
  }, []);

  // 计算距离（简单的 Haversine 公式）
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const distance = currentLocation && orderInfo.location
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        orderInfo.location.latitude,
        orderInfo.location.longitude
      )
    : null;

  // 打开地图导航
  const openNavigation = () => {
    if (orderInfo.location) {
      const { latitude, longitude } = orderInfo.location;
      // 使用高德地图导航（如果在中国）
      const amapUrl = `https://uri.amap.com/navigation?to=${longitude},${latitude}&mode=car&policy=1&src=mypage&callnative=0`;
      // 使用 Google Maps（如果在国外）
      const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      
      // 尝试打开高德地图，如果失败则打开 Google Maps
      window.open(amapUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="bg-black text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onClose && onClose()}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              返回首页
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="关闭"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <SuccessIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">兑换成功！</h2>
              <p className="text-sm opacity-90">订单号: {orderInfo.orderId}</p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 商品信息 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-3">商品信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#a0a0a0] mb-1">商品名称</p>
                <p className="font-medium text-white">{orderInfo.itemTitle}</p>
              </div>
              <div>
                <p className="text-sm text-[#a0a0a0] mb-1">兑换方式</p>
                <p className="font-medium text-white">
                  {orderInfo.paymentMethod === 'valuePoints' 
                    ? `使用 ${orderInfo.valuePointsUsed} 价值点兑换`
                    : `现金支付 ${formatPrice(orderInfo.amount)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#a0a0a0] mb-1">兑换时间</p>
                <p className="font-medium text-white">
                  {formatDate(orderInfo.createdAt)}
                </p>
              </div>
              {distance && (
                <div>
                  <p className="text-sm text-[#a0a0a0] mb-1">距离您</p>
                  <p className="font-medium text-white">{distance} 公里</p>
                </div>
              )}
            </div>
          </div>

          {/* 位置信息 */}
          {orderInfo.location && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LocationIcon className="w-5 h-5" />
                  <span>商品位置</span>
                </h3>
                <button
                  onClick={openNavigation}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-colors btn-hover-effect flex items-center gap-2"
                >
                  <NavigationIcon className="w-4 h-4" />
                  <span>导航前往</span>
                </button>
              </div>

              {/* 地址文本 */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-[#a0a0a0] mb-1">详细地址</p>
                <p className="font-medium text-white">{orderInfo.location.address}</p>
                {orderInfo.location.contactInfo && (
                  <p className="text-sm text-[#a0a0a0] mt-2">
                    联系方式: {orderInfo.location.contactInfo}
                  </p>
                )}
                
                {/* 查看地图按钮 */}
                {!showMap && (
                  <button
                    onClick={() => setShowMap(true)}
                    className="mt-3 px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-colors btn-hover-effect flex items-center gap-2 w-full"
                  >
                    <LocationIcon className="w-4 h-4" />
                    <span>查看地图位置</span>
                  </button>
                )}
              </div>

              {/* 地图 */}
              {showMap && (
                <ItemLocationMap
                  latitude={orderInfo.location.latitude}
                  longitude={orderInfo.location.longitude}
                  address={orderInfo.location.address}
                  itemTitle={orderInfo.itemTitle}
                  height={400}
                />
              )}
            </div>
          )}

          {/* 取货说明 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>取货说明</span>
            </h4>
            <ul className="text-sm text-[#a0a0a0] space-y-1">
              <li>• 请按照地图位置前往取货</li>
              <li>• 建议提前联系卖家确认取货时间</li>
              <li>• 到达后请仔细检查商品</li>
              <li>• 如有问题请及时联系卖家</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
              >
                关闭
              </button>
            {orderInfo.location && (
              <button
                onClick={openNavigation}
                className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium flex items-center justify-center gap-2"
              >
                <NavigationIcon className="w-5 h-5" />
                <span>开始导航</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

