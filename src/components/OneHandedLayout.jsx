import React, { useState, useCallback } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { 
  PublishIcon, 
  SearchIcon, 
  OrderIcon, 
  ValuePointsIcon, 
  AIIcon, 
  HomeIcon,
  BackIcon,
  MenuIcon
} from './Icons';

/**
 * 单手操作布局组件
 * 为精细手部操作困难或单手/无手操作的用户提供简化的垂直布局
 * 所有按钮尺寸≥48px，适合拇指操作
 */
const OneHandedLayout = ({ 
  onNavigate, 
  onClose, 
  stats = { totalItems: 0, valuePointItems: 0, totalAppraisals: 0, totalValuePoints: 0 } 
}) => {
  const { settings, announce } = useAccessibility();
  const [activeSection, setActiveSection] = useState('main'); // 'main', 'browse', 'publish', 'orders', 'valuePoints'
  const [showSideMenu, setShowSideMenu] = useState(false);

  // 处理导航，添加语音反馈
  const handleNavigate = useCallback((section, params) => {
    announce(`导航到${getSectionName(section)}`);
    if (section === 'back') {
      if (activeSection !== 'main') {
        setActiveSection('main');
      } else {
        onClose?.();
      }
    } else {
      setActiveSection(section);
      onNavigate?.(section, params);
    }
  }, [announce, activeSection, onNavigate, onClose]);

  // 获取区域名称，用于语音反馈
  const getSectionName = (section) => {
    const names = {
      main: '主菜单',
      browse: '浏览商品',
      publish: '发布商品',
      orders: '我的订单',
      valuePoints: '价值点',
      companion: '随机匹配搭子',
      appraisals: 'AI鉴定',
      back: '返回'
    };
    return names[section] || section;
  };

  // 生成主菜单按钮
  const renderMainMenu = () => {
    return (
      <div className="space-y-6">
        {/* 欢迎信息 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">单手操作模式</h2>
          <p className="text-gray-300">选择以下功能</p>
        </div>

        {/* 统计信息卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <AccessibilityButton 
            icon={<SearchIcon className="w-8 h-8 text-black" />}
            label={`浏览商品 (${stats.totalItems})`}
            onClick={() => handleNavigate('browse')}
            color="primary"
          />
          <AccessibilityButton 
            icon={<ValuePointsIcon className="w-8 h-8 text-black" />}
            label={`价值点 (${stats.totalValuePoints})`}
            onClick={() => handleNavigate('valuePoints')}
            color="primary"
          />
        </div>

        {/* 主要功能按钮 */}
        <AccessibilityButton 
          icon={<PublishIcon className="w-8 h-8 text-black" />}
          label="发布商品"
          onClick={() => handleNavigate('publish')}
          color="primary"
          description="快速发布您的闲置商品"
        />
        
        <AccessibilityButton 
          icon={<SearchIcon className="w-8 h-8 text-black" />}
          label="浏览商品"
          onClick={() => handleNavigate('browse')}
          color="primary"
          description={`查看全部 ${stats.totalItems} 个商品`}
        />
        
        <AccessibilityButton 
          icon={<OrderIcon className="w-8 h-8 text-black" />}
          label="我的订单"
          onClick={() => handleNavigate('orders')}
          color="primary"
          description="查看购买和销售记录"
        />
        
        <AccessibilityButton 
          icon={<ValuePointsIcon className="w-8 h-8 text-black" />}
          label="价值点中心"
          onClick={() => handleNavigate('valuePoints')}
          color="primary"
          description={`当前余额: ${stats.totalValuePoints} 点`}
        />
        
        <AccessibilityButton 
          icon={<AIIcon className="w-8 h-8 text-black" />}
          label="AI鉴定"
          onClick={() => handleNavigate('appraisals')}
          color="primary"
          description={`已鉴定 ${stats.totalAppraisals} 个商品`}
        />
      </div>
    );
  };

  // 渲染简化的浏览界面
  const renderBrowseSection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">浏览商品</h2>
          <p className="text-gray-300">选择浏览方式</p>
        </div>

        <AccessibilityButton 
          icon={<SearchIcon className="w-8 h-8 text-black" />}
          label="全部商品"
          onClick={() => handleNavigate('browse', { filter: 'all' })}
          color="primary"
          description={`共 ${stats.totalItems} 个商品`}
        />
        
        <AccessibilityButton 
          icon={<ValuePointsIcon className="w-8 h-8 text-black" />}
          label="支持价值点兑换"
          onClick={() => handleNavigate('browse', { filter: 'valuePoints' })}
          color="primary"
          description={`共 ${stats.valuePointItems} 个商品`}
        />
        
        <AccessibilityButton 
          icon={<BackIcon className="w-8 h-8 text-black" />}
          label="返回主菜单"
          onClick={() => handleNavigate('back')}
          color="secondary"
        />
      </div>
    );
  };

  // 渲染简化的发布界面
  const renderPublishSection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">发布商品</h2>
          <p className="text-gray-300">选择发布方式</p>
        </div>

        <AccessibilityButton 
          icon={<PublishIcon className="w-8 h-8 text-black" />}
          label="普通发布表单"
          onClick={() => handleNavigate('publish', { mode: 'form' })}
          color="primary"
          description="填写完整商品信息"
        />
        
        <AccessibilityButton 
          icon={<AIIcon className="w-8 h-8 text-black" />}
          label="AI辅助发布"
          onClick={() => handleNavigate('publish', { mode: 'ai' })}
          color="primary"
          description="使用AI快速识别和填写"
        />
        
        <AccessibilityButton 
          icon={<PublishIcon className="w-8 h-8 text-black" />}
          label="对话式发布"
          onClick={() => handleNavigate('publish', { mode: 'conversational' })}
          color="primary"
          description="一步一步引导发布"
        />
        
        <AccessibilityButton 
          icon={<BackIcon className="w-8 h-8 text-black" />}
          label="返回主菜单"
          onClick={() => handleNavigate('back')}
          color="secondary"
        />
      </div>
    );
  };

  // 渲染简化的订单界面
  const renderOrdersSection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">我的订单</h2>
          <p className="text-gray-300">选择订单类型</p>
        </div>

        <AccessibilityButton 
          icon={<SearchIcon className="w-8 h-8 text-black" />}
          label="我买到的"
          onClick={() => handleNavigate('orders', { type: 'buyer' })}
          color="primary"
          description="查看已购买的商品"
        />
        
        <AccessibilityButton 
          icon={<PublishIcon className="w-8 h-8 text-black" />}
          label="我卖出的"
          onClick={() => handleNavigate('orders', { type: 'seller' })}
          color="primary"
          description="查看已售出的商品"
        />
        
        <AccessibilityButton 
          icon={<BackIcon className="w-8 h-8 text-black" />}
          label="返回主菜单"
          onClick={() => handleNavigate('back')}
          color="secondary"
        />
      </div>
    );
  };

  // 渲染简化的价值点界面
  const renderValuePointsSection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">价值点中心</h2>
          <p className="text-gray-300">当前余额: {stats.totalValuePoints} 点</p>
        </div>

        <AccessibilityButton 
          icon={<ValuePointsIcon className="w-8 h-8 text-black" />}
          label="价值点兑换"
          onClick={() => handleNavigate('valuePoints', { action: 'redeem' })}
          color="primary"
          description="使用价值点兑换商品"
        />
        
        <AccessibilityButton 
          icon={<AIIcon className="w-8 h-8 text-black" />}
          label="AI鉴定服务"
          onClick={() => handleNavigate('valuePoints', { action: 'appraisal' })}
          color="primary"
          description="使用价值点进行AI鉴定"
        />
        
        <AccessibilityButton 
          icon={<BackIcon className="w-8 h-8 text-black" />}
          label="返回主菜单"
          onClick={() => handleNavigate('back')}
          color="secondary"
        />
      </div>
    );
  };

  // 根据当前区域渲染内容
  const renderContent = () => {
    switch (activeSection) {
      case 'browse':
        return renderBrowseSection();
      case 'publish':
        return renderPublishSection();
      case 'orders':
        return renderOrdersSection();
      case 'valuePoints':
        return renderValuePointsSection();
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className={`
      fixed inset-0 z-50 flex flex-col bg-black transition-all duration-300 ease-in-out
      ${settings.highContrast ? 'high-contrast' : ''}
      ${settings.fontSize ? `font-size-${settings.fontSize}` : ''}
    `}>
      {/* 顶部导航栏 */}
      <header className="bg-[#121212] border-b border-[#E60023]/30 p-4 flex items-center justify-between z-10">
        <button 
          onClick={() => setShowSideMenu(!showSideMenu)}
          className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#e0e0e0] transition-all"
          aria-label="菜单"
          aria-expanded={showSideMenu}
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-xl font-bold text-white">二手交易平台</h1>
        
        <button 
          onClick={() => handleNavigate('back')}
          className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#e0e0e0] transition-all"
          aria-label="返回"
        >
          <BackIcon className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* 侧边菜单 */}
      {showSideMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-20 transition-opacity duration-300 ease-in-out">
          <div className={`
            absolute top-0 left-0 h-full w-3/4 max-w-sm bg-[#121212]
            border-r border-[#E60023]/30 p-4 overflow-y-auto
            transform transition-transform duration-300 ease-in-out
          `}>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setShowSideMenu(false)}
                className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#e0e0e0] transition-all"
                aria-label="关闭菜单"
              >
                <BackIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">快速导航</h3>
              
              <SidebarButton 
                icon={<HomeIcon className="w-6 h-6 text-black" />}
                label="主菜单"
                isActive={activeSection === 'main'}
                onClick={() => { handleNavigate('main'); setShowSideMenu(false); }}
              />
              
              <SidebarButton 
                icon={<SearchIcon className="w-6 h-6 text-black" />}
                label="浏览商品"
                isActive={activeSection === 'browse'}
                onClick={() => { handleNavigate('browse'); setShowSideMenu(false); }}
              />
              
              <SidebarButton 
                icon={<PublishIcon className="w-6 h-6 text-black" />}
                label="发布商品"
                isActive={activeSection === 'publish'}
                onClick={() => { handleNavigate('publish'); setShowSideMenu(false); }}
              />
              
              <SidebarButton 
                icon={<OrderIcon className="w-6 h-6 text-black" />}
                label="我的订单"
                isActive={activeSection === 'orders'}
                onClick={() => { handleNavigate('orders'); setShowSideMenu(false); }}
              />
              
              <SidebarButton 
                icon={<ValuePointsIcon className="w-6 h-6 text-black" />}
                label="价值点中心"
                isActive={activeSection === 'valuePoints'}
                onClick={() => { handleNavigate('valuePoints'); setShowSideMenu(false); }}
              />
              
              <SidebarButton 
                icon={<AIIcon className="w-6 h-6 text-black" />}
                label="AI鉴定服务"
                isActive={activeSection === 'appraisals'}
                onClick={() => { handleNavigate('appraisals'); setShowSideMenu(false); }}
              />
              
              <div className="pt-6 border-t border-[#333]">
                <h3 className="text-lg font-semibold text-white mb-4">设置</h3>
                
                <SidebarButton 
                  icon={<BackIcon className="w-6 h-6 text-black" />}
                  label="退出单手模式"
                  onClick={() => { onClose?.(); setShowSideMenu(false); }}
                  variant="danger"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto p-6 pb-24">
        {renderContent()}
      </main>

      {/* 底部导航栏 - 始终可见，方便单手操作 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-[#E60023]/30 p-4 z-10">
        <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
          <BottomNavButton 
            icon={<HomeIcon className="w-6 h-6 text-white" />}
            label="首页"
            isActive={activeSection === 'main'}
            onClick={() => handleNavigate('main')}
          />
          
          <BottomNavButton 
            icon={<SearchIcon className="w-6 h-6 text-white" />}
            label="浏览"
            isActive={activeSection === 'browse'}
            onClick={() => handleNavigate('browse')}
          />
          
          <BottomNavButton 
            icon={<PublishIcon className="w-6 h-6 text-white" />}
            label="发布"
            isActive={activeSection === 'publish'}
            onClick={() => handleNavigate('publish')}
          />
          
          <BottomNavButton 
            icon={<ValuePointsIcon className="w-6 h-6 text-white" />}
            label="我的"
            isActive={['orders', 'valuePoints'].includes(activeSection)}
            onClick={() => handleNavigate('valuePoints')}
          />
        </div>
      </footer>
    </div>
  );
};

// 无障碍按钮组件 - 确保尺寸≥48px，支持键盘导航和ARIA属性
const AccessibilityButton = ({ 
  icon, 
  label, 
  description, 
  onClick, 
  color = 'primary',
  disabled = false,
  className = ''
}) => {
  const buttonColor = color === 'primary' ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#333] hover:bg-[#444]';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full min-h-[64px] flex items-center gap-4 p-6 rounded-xl transition-all duration-300
        ${buttonColor} focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 focus:ring-offset-black
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:shadow-white/20'}
        ${className}
      `}
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        {icon}
      </div>
      
      <div className="flex-1 text-left">
        <h3 className="text-lg font-bold">{label}</h3>
        {description && (
          <p 
            id={`${label}-description`}
            className="text-sm text-gray-300 mt-1"
          >
            {description}
          </p>
        )}
      </div>
    </button>
  );
};

// 侧边栏按钮组件
const SidebarButton = ({ 
  icon, 
  label, 
  onClick, 
  isActive = false,
  variant = 'default'
}) => {
  const baseClasses = 'w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-300';
  const activeClasses = isActive ? 'bg-[#E60023]/20 border border-[#E60023]/50' : 'hover:bg-[#222]';
  const variantClasses = variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-white';
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${variantClasses}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

// 底部导航按钮组件
const BottomNavButton = ({ 
  icon, 
  label, 
  onClick, 
  isActive = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all duration-300
        ${isActive ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-[#222]'}
      `}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default OneHandedLayout;