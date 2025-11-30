import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { FeedbackManager } from './FeedbackMessage';
import useFeedback from '../hooks/useFeedback';

// 定义无障碍设置的类型
export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  voiceNavigation: boolean;
  simplifiedLayout: boolean;
  oneHandedMode: boolean;
  soundFeedback: boolean;
  vibrationFeedback: boolean;
}

// 定义无障碍上下文的类型
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleVoiceNavigation: () => void;
  toggleSimplifiedLayout: () => void;
  toggleOneHandedMode: () => void;
  feedback: ReturnType<typeof useFeedback>;
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

// 创建无障碍上下文
export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// 无障碍设置的默认值
const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  voiceNavigation: false,
  simplifiedLayout: false,
  oneHandedMode: false,
  soundFeedback: true,
  vibrationFeedback: true,
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * 无障碍提供者组件 - 管理全局无障碍设置
 * 提供无障碍功能的状态管理和控制方法
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // 获取反馈功能
  const feedback = useFeedback();
  
  // 从本地存储加载设置，如果没有则使用默认值
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('accessibilitySettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      return defaultSettings;
    }
  });

  // 当设置改变时，保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  // 根据无障碍设置更新文档类名
  useEffect(() => {
    const root = document.documentElement;
    
    // 切换高对比度类名
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // 设置字体大小类名
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-x-large');
    root.classList.add(`font-${settings.fontSize}`);
    
    // 切换简化布局类名
    if (settings.simplifiedLayout) {
      root.classList.add('simplified-layout');
    } else {
      root.classList.remove('simplified-layout');
    }
    
    // 切换单手操作模式类名
    if (settings.oneHandedMode) {
      root.classList.add('one-handed-mode');
    } else {
      root.classList.remove('one-handed-mode');
    }
  }, [settings]);

  // 更新设置的方法
  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // 屏幕阅读器播报
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    // 创建或获取实时区域
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-9999px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // 直接更新内容，避免setTimeout延迟
    liveRegion.textContent = message;
  }, []);

  // 提供反馈（声音、震动和视觉）
  const provideFeedback = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    // 声音反馈
    if (settings.soundFeedback) {
      console.log('Sound feedback');
    }
    
    // 震动反馈
    if (settings.vibrationFeedback && typeof navigator.vibrate === 'function') {
      navigator.vibrate(50); // 震动50毫秒
    }
    
    // 视觉反馈
    if (feedback[type]) {
      feedback[type](message);
    }
    
    // 屏幕阅读器反馈
    announce(message);
  }, [settings.soundFeedback, settings.vibrationFeedback, feedback, announce]);

  // 切换高对比度模式
  const toggleHighContrast = useCallback(() => {
    setSettings(prev => {
      const newValue = !prev.highContrast;
      provideFeedback(newValue ? '高对比度模式已开启' : '高对比度模式已关闭');
      return { ...prev, highContrast: newValue };
    });
  }, [provideFeedback]);

  // 增加字体大小
  const increaseFontSize = useCallback(() => {
    const sizes: Array<'small' | 'medium' | 'large' | 'x-large'> = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      setSettings(prev => {
        const newSize = sizes[currentIndex + 1];
        provideFeedback(`字体大小已调整为${newSize === 'small' ? '小' : newSize === 'medium' ? '中' : newSize === 'large' ? '大' : '特大'}`);
        return { ...prev, fontSize: newSize };
      });
    } else {
      provideFeedback('已达到最大字体大小', 'warning');
    }
  }, [settings.fontSize, provideFeedback]);

  // 减小字体大小
  const decreaseFontSize = useCallback(() => {
    const sizes: Array<'small' | 'medium' | 'large' | 'x-large'> = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      setSettings(prev => {
        const newSize = sizes[currentIndex - 1];
        provideFeedback(`字体大小已调整为${newSize === 'small' ? '小' : newSize === 'medium' ? '中' : newSize === 'large' ? '大' : '特大'}`);
        return { ...prev, fontSize: newSize };
      });
    } else {
      provideFeedback('已达到最小字体大小', 'warning');
    }
  }, [settings.fontSize, provideFeedback]);

  // 切换语音导航
  const toggleVoiceNavigation = useCallback(() => {
    setSettings(prev => {
      const newValue = !prev.voiceNavigation;
      provideFeedback(newValue ? '语音导航已开启' : '语音导航已关闭');
      return { ...prev, voiceNavigation: newValue };
    });
  }, [provideFeedback]);

  // 切换简化布局
  const toggleSimplifiedLayout = useCallback(() => {
    setSettings(prev => {
      const newValue = !prev.simplifiedLayout;
      provideFeedback(newValue ? '简化布局已开启' : '简化布局已关闭');
      return { ...prev, simplifiedLayout: newValue };
    });
  }, [provideFeedback]);

  // 切换单手操作模式
  const toggleOneHandedMode = useCallback(() => {
    setSettings(prev => {
      const newValue = !prev.oneHandedMode;
      provideFeedback(newValue ? '单手操作模式已开启' : '单手操作模式已关闭');
      return { ...prev, oneHandedMode: newValue };
    });
  }, [provideFeedback]);

  const value: AccessibilityContextType = {
    settings,
    updateSettings,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleVoiceNavigation,
    toggleSimplifiedLayout,
    toggleOneHandedMode,
    feedback,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <FeedbackManager />
    </AccessibilityContext.Provider>
  );
};

/**
 * 使用无障碍功能的钩子
 * 提供对无障碍设置和控制方法的访问
 * 
 * @returns 包含所有无障碍功能的对象，包括设置、控制方法、反馈系统和屏幕阅读器播报功能
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

/**
 * 使用屏幕阅读器播报的便捷钩子
 * 
 * @returns 屏幕阅读器播报函数
 */
export const useAnnounce = () => {
  const { announce } = useAccessibility();
  return announce;
};

/**
 * 使用反馈系统的便捷钩子
 * 
 * @returns 反馈系统对象
 */
export const useAccessibilityFeedback = () => {
  const { feedback } = useAccessibility();
  return feedback;
};
