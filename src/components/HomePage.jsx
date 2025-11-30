import { useMemo, useState, useEffect, useCallback } from 'react';
import { useItems } from '../hooks/useItems';
import { useValuePoints } from '../hooks/useValuePoints';
import { useAppraisal } from '../hooks/useAppraisal';
import { PublishIcon, AIIcon, ValuePointsIcon, OrderIcon, SearchIcon, TransactionIcon, LeafIcon, CompanionIcon, ProductIcon } from './Icons';
import LoginModal from './LoginModal';
import ItemList from './ItemList';
import MapView from './MapView';

/**
 * 主界面/首页组件
 * @param {Function} onNavigate - 导航回调函数
 */
const HomePage = ({ onNavigate }) => {
  const { items } = useItems();
  const { valuePoints } = useValuePoints();
  const { appraisalHistory } = useAppraisal();
  
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showProductMenu, setShowProductMenu] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const loggedIn = localStorage.getItem('is_logged_in') === 'true';
    const savedUserInfo = localStorage.getItem('user_info');
    setIsLoggedIn(loggedIn);
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  // 模拟获取用户当前位置
  const [userLocation, setUserLocation] = useState({
    latitude: 31.0283, // 模拟上海交通大学位置
    longitude: 121.4347
  });

  // 统计数据
  const stats = useMemo(() => {
    const totalItems = items.length;
    const valuePointItems = items.filter(item => item.allowValuePoints).length;
    const totalAppraisals = appraisalHistory.length;
    
    return {
      totalItems,
      valuePointItems,
      totalAppraisals,
    };
  }, [items, appraisalHistory]);

  // 处理登录成功
  const handleLoginSuccess = useCallback((user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  }, []);

  // 处理登出
  const handleLogout = useCallback(() => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    setUserInfo(null);
    alert('已退出登录');
  }, []);

  // 处理导航 - 使用useCallback缓存函数
  const handleNavigate = useCallback((path) => {
    onNavigate?.(path);
  }, [onNavigate]);

  // 处理视图切换 - 使用useCallback缓存函数
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* 黑白主色调背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#121212]"></div>
      
      {/* 增强的纹理效果 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6bTMwLTE1aC0zMHYtMzBIMHYzMGgzMHoiIGZpbGw9IiMxYTFhMWEiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTAgMGgzMHYzMEgwem0wIDMwaDMwdjMwSDB6IiBmaWxsPSIjMWExYTFhIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMwem0wIDMwaDMwdjMwSDMweiIgZmlsbD0iIzFhMWExYSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      {/* 网格背景效果 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(230,0,35,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(230,0,35,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Nike风格装饰元素 - 红色调 */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#E60023]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#E60023]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] right-[15%] w-64 h-64 bg-[#E60023]/3 rounded-full blur-3xl"></div>
      
      {/* 几何装饰元素 - Nike风格 */}
      <div className="absolute top-[20%] right-[8%] w-24 h-24 border border-[#E60023]/20 rotate-45"></div>
      <div className="absolute bottom-[30%] left-[12%] w-32 h-32 border border-[#E60023]/20 rounded-full"></div>
      <div className="absolute top-[60%] right-[25%] w-16 h-16 border border-[#E60023]/20 rotate-12"></div>
      
      {/* Nike风格装饰线条 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E60023]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E60023]/30 to-transparent"></div>
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#E60023]/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#E60023]/30 to-transparent"></div>
      
      {/* 登录按钮区域 - 移到最上方 */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-black/90 border-b border-[#E60023]/30 z-50 backdrop-blur-sm">
        <span className="text-white text-3xl sm:text-3xl md:text-3xl font-bold tracking-wide">专属于重庆大学生的平台</span>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-[#141414] rounded-lg border border-[#E60023]/20">
              <span className="text-white text-sm">
                欢迎，{userInfo?.name || '用户'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white text-black rounded-lg hover:bg-gray-300 transition-all btn-hover-effect font-medium text-sm"
            >
              退出登录
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-1.5 bg-white text-black rounded-lg hover:bg-gray-300 transition-all btn-hover-effect font-medium text-sm"
          >
            登录
          </button>
        )}
      </div>
      
      {/* 为固定的登录区域添加占位空间 */}
      <div className="h-20"></div>

      {/* 主容器 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* 主标题区域 */}
        <div className="text-center mb-16 py-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent rounded-full transform scale-150 blur-3xl"></div>
          <h1 className="text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold mb-8 text-white relative z-10 tracking-wide">
            校园巷
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto relative z-10 leading-relaxed">
            安全、便捷、智能的二手商品交易平台<br />
            支持价值点兑换、AI 智能鉴定、地图寻物
          </p>
        </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
        <button 
          onClick={() => onNavigate?.('browse')}
          className="bg-white text-black rounded-lg p-4 sm:p-5 hover:bg-gray-300 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-white/20 cursor-pointer transform hover:-translate-y-1 duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-md shadow-white/20">
              <SearchIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{stats.totalItems}</p>
              <p className="text-xs sm:text-sm text-gray-600">在售商品</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate?.('valuePoints')}
          className="bg-white text-black rounded-lg p-4 sm:p-5 hover:bg-gray-300 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-white/20 cursor-pointer transform hover:-translate-y-1 duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-md shadow-white/20">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{stats.valuePointItems}</p>
              <p className="text-xs sm:text-sm text-gray-600">支持碳积分兑换</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate?.('appraisalHistory')}
          className="bg-white text-black rounded-lg p-4 sm:p-5 hover:bg-gray-300 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-white/20 cursor-pointer transform hover:-translate-y-1 duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-md shadow-white/20">
              <AIIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{stats.totalAppraisals}</p>
              <p className="text-xs sm:text-sm text-gray-600">AI 鉴定记录</p>
            </div>
          </div>
        </button>
      </div>

      {/* 快速入口 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
        {/* 合并的商品管理按钮 */}
        <div className="relative h-full">
          <button
            onClick={() => setShowProductMenu(!showProductMenu)}
            className="bg-[#E60023] text-white rounded-lg p-6 hover:bg-[#c4001e] transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-[#E60023]/20 flex flex-col items-center text-center h-full group w-full"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md shadow-[#E60023]/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <ProductIcon className="w-8 h-8 text-black group-hover:text-[#E60023] transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E60023] transition-colors duration-300">商品管理</h3>
            <p className="text-sm text-gray-300">发布或浏览商品</p>
          </button>
          
          {/* 下拉菜单 */}
          {showProductMenu && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden z-50">
              <button
                onClick={() => {
                  onNavigate?.('publish');
                  setShowProductMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <PublishIcon className="w-5 h-5 text-[#E60023]" />
                <span>发布商品</span>
              </button>
              <button
                onClick={() => {
                  handleNavigate('browse');
                  setShowProductMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <SearchIcon className="w-5 h-5 text-[#E60023]" />
                <span>浏览商品</span>
              </button>
            </div>
          )}
        </div>

        <button
            onClick={() => handleNavigate('companion')}
            className="bg-[#E60023] text-white rounded-lg p-6 hover:bg-[#c4001e] transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-[#E60023]/20 flex flex-col items-center text-center h-full group"
          >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md shadow-[#E60023]/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <CompanionIcon className="w-8 h-8 text-black group-hover:text-[#E60023] transition-colors duration-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E60023] transition-colors duration-300">随机匹配搭子</h3>
          <p className="text-sm text-gray-300">寻找志同道合的伙伴</p>
        </button>



        <button
            onClick={() => handleNavigate('transactionTesting')}
            className="bg-[#E60023] text-white rounded-lg p-6 hover:bg-[#c4001e] transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-[#E60023]/20 flex flex-col items-center text-center h-full group"
          >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md shadow-[#E60023]/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <TransactionIcon className="w-8 h-8 text-black group-hover:text-[#E60023] transition-colors duration-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E60023] transition-colors duration-300">交易测试</h3>
          <p className="text-sm text-gray-300">测试交易功能</p>
        </button>
      </div>


        {/* 商品列表/地图视图 */}
        <div className="mb-16 relative z-10">
          {/* 视图切换 */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-lg">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-[#666] hover:text-white'}`}
              >
                列表视图
              </button>
              <button
                onClick={() => handleViewModeChange('map')}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'map' ? 'bg-white text-black' : 'text-[#666] hover:text-white'}`}
              >
                地图视图
              </button>
            </div>
          </div>

          {/* 商品列表或地图视图 */}
          <div className="mb-8">
            {viewMode === 'list' ? (
              <ItemList items={items} onItemClick={(item) => handleNavigate('itemDetail', { id: item.id })} />
            ) : (
              <MapView 
                items={items} 
                userLocation={userLocation}
                onItemClick={(item) => handleNavigate('itemDetail', { id: item.id })}
                hasPurchased={false} // 概览视图默认不显示完整位置信息
              />
            )}
          </div>
        </div>
      </div>

      {/* 登录模态框 */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

export default HomePage;

