import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 自定义红色主题样式
  const customStyles = `
  <style>
    .leaflet-container {
      background-color: #000000;
    }
    
    .custom-popup .leaflet-popup-content-wrapper {
      background-color: #1a1a1a;
      color: #ffffff;
      border: 1px solid rgba(230, 0, 35, 0.3);
      border-radius: 8px;
    }
    
    .custom-popup .leaflet-popup-tip {
      background-color: #1a1a1a;
      border: 1px solid rgba(230, 0, 35, 0.3);
    }
    
    .leaflet-control-zoom-in,
    .leaflet-control-zoom-out {
      background-color: #1a1a1a !important;
      color: #ffffff !important;
      border: 1px solid rgba(230, 0, 35, 0.3) !important;
    }
    
    .leaflet-control-zoom-in:hover,
    .leaflet-control-zoom-out:hover {
      background-color: #2a2a2a !important;
    }
    
    .leaflet-control-attribution {
      background-color: rgba(0, 0, 0, 0.7) !important;
      color: #ffffff !important;
      border-top: 1px solid rgba(230, 0, 35, 0.3) !important;
      border-left: 1px solid rgba(230, 0, 35, 0.3) !important;
    }
    
    .leaflet-control-attribution a {
      color: #E60023 !important;
    }
  </style>
`;

// 修复 Leaflet 默认图标问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// 使用黑白主题的自定义图标
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 自定义弹出窗口样式
const popupOptions = {
  className: 'custom-popup'
};

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * 商品位置地图组件
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @param {string} address - 地址文本
 * @param {string} itemTitle - 商品标题
 * @param {number} height - 地图高度（默认 400px）
 */
const ItemLocationMap = ({ latitude, longitude, address, itemTitle, height = 400 }) => {
  // 添加自定义样式到文档头部
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // 如果没有坐标，使用默认位置（北京天安门）
    const lat = latitude || 39.9042;
    const lng = longitude || 116.4074;

    // 初始化地图
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);

      // 添加 OpenStreetMap 瓦片图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // 添加标记
      markerRef.current = L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="text-align: center; color: #000;">
            <strong>${itemTitle || '商品位置'}</strong><br/>
            <small>${address || '位置信息'}</small>
          </div>
        `, popupOptions)
        .openPopup();
    }

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address, itemTitle]);

  // 当坐标变化时更新地图
  useEffect(() => {
    if (mapInstanceRef.current && (latitude || longitude)) {
      const lat = latitude || 39.9042;
      const lng = longitude || 116.4074;
      
      mapInstanceRef.current.setView([lat, lng], 13);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.setPopupContent(`
          <div style="text-align: center; color: #000;">
            <strong>${itemTitle || '商品位置'}</strong><br/>
            <small>${address || '位置信息'}</small>
          </div>
        `);
      }
    }
  }, [latitude, longitude, address, itemTitle]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-[#E60023]/30">
      <div ref={mapRef} style={{ height: `${height}px`, width: '100%' }} />
    </div>
  );
};

export default ItemLocationMap;

