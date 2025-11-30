import { useState, useEffect, useRef } from 'react';
import { LocationIcon } from './Icons';

/**
 * 地图视图组件，在地图上显示商品位置标记
 */
const MapView = ({ items = [], userLocation, onItemClick, hasPurchased = false }) => {
  const [mapContainer, setMapContainer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const mapRef = useRef(null);

  // 计算两点之间的距离（使用Haversine公式）
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // 格式化距离显示
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}米`;
    }
    return `${distance.toFixed(1)}公里`;
  };

  // 模拟商品位置数据（实际项目中应该从后端获取）
  const itemsWithLocation = items.map(item => {
    // 为每个商品生成一个模拟位置（围绕用户位置）
    const randomOffset = () => (Math.random() - 0.5) * 0.05; // 约5公里范围内
    return {
      ...item,
      location: {
        latitude: userLocation.latitude + randomOffset(),
        longitude: userLocation.longitude + randomOffset()
      }
    };
  });

  // 计算每个商品到用户的距离
  const itemsWithDistance = itemsWithLocation.map(item => ({
    ...item,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.location.latitude,
      item.location.longitude
    )
  }));

  // 按距离排序
  const sortedItems = [...itemsWithDistance].sort((a, b) => a.distance - b.distance);

  // 处理标记点击
  const handleMarkerClick = (item) => {
    setSelectedItem(item);
  };

  // 处理商品点击
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  useEffect(() => {
    // 这里可以集成真实的地图库，如Google Maps、百度地图等
    // 目前使用模拟的地图视图
    if (mapRef.current) {
      // 地图初始化逻辑
      console.log('地图初始化，中心点坐标:', userLocation);
    }
  }, [userLocation]);

  if (!items.length) {
    return (
      <div className="w-full h-[500px] bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#2a2a2a]">
        <p className="text-[#666] text-lg">暂无商品</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {hasPurchased ? (
        <>
          {/* 模拟地图容器 */}
          <div 
            ref={mapRef}
            className="w-full h-[500px] bg-[#1a1a1a] rounded-lg overflow-hidden relative border border-[#2a2a2a]"
          >
        {/* 地图网格背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232a2a2a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E')]"
        ></div>

        {/* 用户当前位置标记 */}
        <div 
          className="absolute bg-white rounded-full p-2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
          style={{
            left: '50%',
            top: '50%'
          }}
          title="您的当前位置"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-black">
            <div className="w-2 h-2 rounded-full bg-black"></div>
          </div>
        </div>

        {/* 商品位置标记 */}
        {sortedItems.map((item, index) => {
          // 计算标记在地图上的相对位置（简化版，实际应根据经纬度计算）
          const relativeLat = (item.location.latitude - userLocation.latitude) / 0.05;
          const relativeLon = (item.location.longitude - userLocation.longitude) / 0.05;
          const left = `${50 + relativeLon * 50}%`;
          const top = `${50 - relativeLat * 50}%`;

          return (
            <div
              key={item.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${selectedItem?.id === item.id ? 'z-30 scale-110' : 'z-10 hover:scale-105'}`}
              style={{ left, top }}
              onClick={() => handleMarkerClick(item)}
            >
              <div className={`w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center border-2 ${selectedItem?.id === item.id ? 'border-[#E60023] shadow-lg' : 'border-transparent'}`}>
                <LocationIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/90 text-white px-2 py-1 rounded text-xs">
                {item.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* 商品详情卡片（点击标记时显示） */}
      {selectedItem && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border border-[#E60023] rounded-lg p-4 w-full max-w-md shadow-xl z-50">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={selectedItem.images?.[0] || 'https://via.placeholder.com/200'} 
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1 line-clamp-2">{selectedItem.title}</h3>
              <div className="flex items-center gap-2 text-white font-bold mb-2">
                <span>¥{selectedItem.price}</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {formatDistance(selectedItem.distance)}
                </span>
              </div>
              <p className="text-[#666] text-sm mb-3 line-clamp-2">{selectedItem.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleItemClick(selectedItem)}
                  className="flex-1 bg-white text-black px-4 py-2 rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect text-sm"
                >
                  查看详情
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-2 bg-[#2a2a2a] text-[#666] rounded-lg hover:bg-[#3a3a3a] transition-all text-sm"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 地图控制和筛选 */}
      <div className="absolute top-4 right-4 z-20 bg-black/70 rounded-lg p-2 flex flex-col gap-2">
        <button className="bg-[#1a1a1a] text-white p-2 rounded hover:bg-[#2a2a2a] transition-all">
          <span className="text-xs">+</span>
        </button>
        <button className="bg-[#1a1a1a] text-white p-2 rounded hover:bg-[#2a2a2a] transition-all">
          <span className="text-xs">-</span>
        </button>
      </div>

      {/* 距离筛选 */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">商品距离排序</h3>
          <span className="text-[#666] text-sm">共{items.length}件商品</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sortedItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className={`bg-[#1a1a1a] rounded-lg p-3 border ${selectedItem?.id === item.id ? 'border-[#E60023]' : 'border-[#2a2a2a]'} hover:border-[#E60023] transition-all cursor-pointer`}
              onClick={() => handleMarkerClick(item)}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.images?.[0] || 'https://via.placeholder.com/200'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium mb-1 line-clamp-2">{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">¥{item.price}</span>
                    <span className="text-[#666] text-xs">{formatDistance(item.distance)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      ) : (
        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <div className="text-center p-6">
            <svg className="w-16 h-16 text-white mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h4 className="text-xl font-bold text-white mb-2">位置信息已隐藏</h4>
            <p className="text-[#a0a0a0] mb-4">购买商品后即可查看完整位置信息</p>
            <button 
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              立即购买
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;