import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * 无障碍控制面板组件
 * 提供用户友好的界面来调整无障碍设置
 */
const AccessibilityControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    settings,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleVoiceNavigation,
    toggleSimplifiedLayout,
    toggleOneHandedMode,
  } = useAccessibility();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 无障碍控制按钮 - 总是可见 */}
      <button
        onClick={togglePanel}
        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 btn-hover-effect"
        aria-label={isOpen ? "关闭无障碍设置" : "打开无障碍设置"}
        aria-expanded={isOpen}
        role="button"
      >
        <span className="sr-only">无障碍设置</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </button>

      {/* 无障碍设置面板 */}
      {isOpen && (
        <div className="mt-4 bg-[#1a1a1a] border border-[#E60023] rounded-lg p-4 shadow-2xl max-w-xs animate-slide-in">
          <h3 className="text-xl font-bold text-white mb-4 text-center">无障碍设置</h3>
          
          <div className="space-y-4">
            {/* 高对比度模式 */}
            <div className="flex items-center justify-between">
              <label htmlFor="highContrast" className="text-white font-medium">
                高对比度模式
              </label>
              <button
            id="highContrast"
            onClick={toggleHighContrast}
            className={`w-12 h-6 rounded-full flex items-center transition-all focus:outline-none focus:ring-2 focus:ring-[#E60023] ${settings.highContrast ? 'bg-white justify-end' : 'bg-[#444] justify-start'}`}
            aria-label={settings.highContrast ? "关闭高对比度模式" : "开启高对比度模式"}
            aria-pressed={settings.highContrast}
            role="switch"
          >
                <span className="w-5 h-5 bg-white rounded-full transition-all"></span>
              </button>
            </div>

            {/* 字体大小调整 */}
            <div className="flex items-center justify-between">
              <label className="text-white font-medium">
                字体大小
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decreaseFontSize}
                  className="w-8 h-8 rounded-lg bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  aria-label="减小字体大小"
                  disabled={settings.fontSize === 'small'}
                >
                  <span className="text-lg">-</span>
                </button>
                <span className="text-white font-medium px-2">
                  {settings.fontSize === 'small' ? '小' :
                   settings.fontSize === 'medium' ? '中' :
                   settings.fontSize === 'large' ? '大' : '特大'}
                </span>
                <button
                  onClick={increaseFontSize}
                  className="w-8 h-8 rounded-lg bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  aria-label="增大字体大小"
                  disabled={settings.fontSize === 'x-large'}
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* 语音导航 */}
            <div className="flex items-center justify-between">
              <label htmlFor="voiceNavigation" className="text-white font-medium">
                语音导航
              </label>
              <button
            id="voiceNavigation"
            onClick={toggleVoiceNavigation}
            className={`w-12 h-6 rounded-full flex items-center transition-all focus:outline-none focus:ring-2 focus:ring-[#E60023] ${settings.voiceNavigation ? 'bg-white justify-end' : 'bg-[#444] justify-start'}`}
            aria-label={settings.voiceNavigation ? "关闭语音导航" : "开启语音导航"}
            aria-pressed={settings.voiceNavigation}
            role="switch"
          >
                <span className="w-5 h-5 bg-white rounded-full transition-all"></span>
              </button>
            </div>

            {/* 简化布局 */}
            <div className="flex items-center justify-between">
              <label htmlFor="simplifiedLayout" className="text-white font-medium">
                简化布局
              </label>
              <button
            id="simplifiedLayout"
            onClick={toggleSimplifiedLayout}
            className={`w-12 h-6 rounded-full flex items-center transition-all focus:outline-none focus:ring-2 focus:ring-[#E60023] ${settings.simplifiedLayout ? 'bg-white justify-end' : 'bg-[#444] justify-start'}`}
            aria-label={settings.simplifiedLayout ? "关闭简化布局" : "开启简化布局"}
            aria-pressed={settings.simplifiedLayout}
            role="switch"
          >
                <span className="w-5 h-5 bg-white rounded-full transition-all"></span>
              </button>
            </div>

            {/* 单手操作模式 */}
            <div className="flex items-center justify-between">
              <label htmlFor="oneHandedMode" className="text-white font-medium">
                单手操作模式
              </label>
              <button
            id="oneHandedMode"
            onClick={toggleOneHandedMode}
            className={`w-12 h-6 rounded-full flex items-center transition-all focus:outline-none focus:ring-2 focus:ring-[#E60023] ${settings.oneHandedMode ? 'bg-white justify-end' : 'bg-[#444] justify-start'}`}
            aria-label={settings.oneHandedMode ? "关闭单手操作模式" : "开启单手操作模式"}
            aria-pressed={settings.oneHandedMode}
            role="switch"
          >
                <span className="w-5 h-5 bg-white rounded-full transition-all"></span>
              </button>
            </div>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={togglePanel}
            className="w-full mt-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="关闭设置面板"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControlPanel;
