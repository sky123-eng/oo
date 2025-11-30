import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationIcon } from './Icons';

// 修复 Leaflet 默认图标问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * 位置选择器组件
 * @param {Object} value - 当前选中的位置 {latitude, longitude, address}
 * @param {Function} onChange - 位置变化回调
 * @param {boolean} showInstruction - 是否显示使用说明
 */
const LocationPicker = ({ value, onChange, showInstruction = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState(value?.address || '');
  const [isSelecting, setIsSelecting] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // 默认位置：北京天安门
      const defaultLat = value?.latitude || 39.9042;
      const defaultLng = value?.longitude || 116.4074;

      mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      // 添加 OpenStreetMap 瓦片图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // 添加标记
      if (value?.latitude && value?.longitude) {
        markerRef.current = L.marker([value.latitude, value.longitude])
          .addTo(mapInstanceRef.current);
      }

      // 点击地图选择位置
      mapInstanceRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setIsSelecting(true);

        // 更新标记位置
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        }

        // 反向地理编码获取地址（使用 Nominatim API）
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const addr = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(addr);
          
          if (onChange) {
            onChange({
              latitude: lat,
              longitude: lng,
              address: addr,
            });
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(addr);
          if (onChange) {
            onChange({
              latitude: lat,
              longitude: lng,
              address: addr,
            });
          }
        } finally {
          setIsSelecting(false);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 获取当前位置
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 15);
          }

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          }

          // 获取地址
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const addr = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setAddress(addr);
            
            if (onChange) {
              onChange({
                latitude: lat,
                longitude: lng,
                address: addr,
              });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
          }
        },
        (error) => {
          alert('获取位置失败，请手动在地图上选择位置');
        }
      );
    } else {
      alert('您的浏览器不支持地理位置功能');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          商品位置 <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-3 py-1 text-sm bg-white text-[#0a0a0a] rounded hover:bg-[#f0f0f0] transition-all btn-hover-effect font-medium flex items-center gap-1.5"
        >
          <LocationIcon className="w-4 h-4" />
          <span>使用当前位置</span>
        </button>
      </div>

      {/* 使用说明 */}
      {showInstruction && (
        <div className="bg-[#2a2a2a] bg-opacity-50 border border-[#444] rounded-md p-3">
          <h4 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            位置设置说明
          </h4>
          <ul className="text-xs text-[#a0a0a0] space-y-1">
            <li>• 点击地图上的精确位置设置商品坐标</li>
            <li>• 填写详细地址信息，方便买家找到</li>
            <li>• 位置信息仅对购买该商品的买家可见</li>
            <li>• 建议选择安全、便利的取货地点</li>
          </ul>
        </div>
      )}

      {/* 地图 */}
      <div className="w-full rounded-lg overflow-hidden border border-[#2a2a2a]">
        <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
      </div>

      {/* 提示 */}
      <p className="text-xs text-[#a0a0a0]">
        {isSelecting ? '正在获取地址...' : '点击地图选择商品位置'}
      </p>

      {/* 地址显示 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          详细地址
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (onChange && value) {
              onChange({
                ...value,
                address: e.target.value,
              });
            }
          }}
          placeholder="点击地图选择位置，或手动输入地址"
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
        />
      </div>

      {/* 联系方式 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          联系方式（选填）
        </label>
        <input
          type="text"
          value={value?.contactInfo || ''}
          onChange={(e) => {
            if (onChange) {
              onChange({
                ...value,
                contactInfo: e.target.value,
              });
            }
          }}
          placeholder="电话、微信等联系方式"
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
        />
      </div>

      {/* 坐标显示（调试用） */}
      {value?.latitude && value?.longitude && (
        <div className="text-xs text-[#a0a0a0]">
          坐标: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

