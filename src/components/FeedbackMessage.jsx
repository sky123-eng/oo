import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, UndoIcon } from './Icons';

/**
 * 反馈消息组件
 * 提供操作结果的视觉和听觉反馈，支持撤销功能
 * 符合WCAG 2.2 AA标准，支持无障碍访问
 */
const FeedbackMessage = ({ 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose, 
  onUndo,
  canUndo = false,
  className = ""
}) => {
  // 屏幕阅读器播报函数（简化实现，不依赖useAccessibility）
  const announce = useCallback((message) => {
    // 创建或获取实时区域
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-9999px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  }, []);
  const [remainingTime, setRemainingTime] = useState(duration / 1000);
  
  // 根据类型获取配置
  const typeConfig = {
    success: {
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
      background: 'bg-green-900/20',
      border: 'border-green-500/30',
      color: 'text-green-400',
      role: 'alert',
      alertType: 'polite'
    },
    error: {
      icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
      background: 'bg-red-900/20',
      border: 'border-red-500/30',
      color: 'text-red-400',
      role: 'alert',
      alertType: 'assertive'
    },
    warning: {
      icon: <AlertCircleIcon className="w-5 h-5 text-yellow-500" />,
      background: 'bg-yellow-900/20',
      border: 'border-yellow-500/30',
      color: 'text-yellow-400',
      role: 'alert',
      alertType: 'polite'
    },
    info: {
      icon: <AlertCircleIcon className="w-5 h-5 text-blue-500" />,
      background: 'bg-blue-900/20',
      border: 'border-blue-500/30',
      color: 'text-blue-400',
      role: 'status',
      alertType: 'polite'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  // 倒计时效果
  useEffect(() => {
    if (canUndo && duration > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [canUndo, duration]);

  // 自动关闭
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // 屏幕阅读器播报
  useEffect(() => {
    if (message) {
      announce(message, config.alertType);
    }
  }, [message, announce, config.alertType]);

  // 处理撤销
  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ease-in-out shadow-lg min-h-[48px] min-w-[280px] max-w-[90vw] ${config.background} ${config.border} ${className}`}
      role={config.role}
      aria-live={config.alertType}
      aria-atomic="true"
    >
      {/* 图标 */}
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      
      {/* 消息内容 */}
      <div className={`flex-1 ${config.color} text-sm`}>
        {message}
      </div>
      
      {/* 撤销按钮 */}
      {canUndo && (
        <button
          type="button"
          onClick={handleUndo}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-black/30 hover:bg-black/50 text-white text-xs transition-all min-h-[32px]"
          aria-label="撤销操作"
          title="撤销操作"
        >
          <UndoIcon className="w-4 h-4" />
          <span>撤销 ({remainingTime})</span>
        </button>
      )}
      
      {/* 关闭按钮 */}
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/30 text-white transition-colors"
        aria-label="关闭消息"
        title="关闭消息"
      >
        <XCircleIcon className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};

/**
 * 反馈管理器组件
 * 管理多个反馈消息的显示和隐藏
 */
const FeedbackManager = () => {
  const [messages, setMessages] = useState([]);
  const [nextId, setNextId] = useState(1);

  // 添加反馈消息
  const showFeedback = useCallback((options) => {
    const id = nextId;
    setNextId(id + 1);
    
    const newMessage = {
      id,
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // 返回消息ID，可用于手动关闭
    return id;
  }, [nextId]);

  // 关闭反馈消息
  const closeFeedback = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  // 撤销操作
  const undoFeedback = useCallback((id) => {
    const message = messages.find(msg => msg.id === id);
    if (message && message.onUndo) {
      message.onUndo();
    }
    closeFeedback(id);
  }, [messages, closeFeedback]);

  // 显示成功消息
  const showSuccess = useCallback((message, options = {}) => {
    return showFeedback({
      type: 'success',
      message,
      ...options
    });
  }, [showFeedback]);

  // 显示错误消息
  const showError = useCallback((message, options = {}) => {
    return showFeedback({
      type: 'error',
      message,
      duration: 8000, // 错误消息显示时间更长
      ...options
    });
  }, [showFeedback]);

  // 显示警告消息
  const showWarning = useCallback((message, options = {}) => {
    return showFeedback({
      type: 'warning',
      message,
      duration: 6000, // 警告消息显示时间稍长
      ...options
    });
  }, [showFeedback]);

  // 显示信息消息
  const showInfo = useCallback((message, options = {}) => {
    return showFeedback({
      type: 'info',
      message,
      ...options
    });
  }, [showFeedback]);

  // 显示可撤销的消息
  const showWithUndo = useCallback((message, onUndo, options = {}) => {
    return showFeedback({
      message,
      canUndo: true,
      onUndo,
      duration: 10000, // 可撤销的消息显示时间更长
      ...options
    });
  }, [showFeedback]);

  // 关闭所有消息
  const closeAll = useCallback(() => {
    setMessages([]);
  }, []);

  // 暴露给子组件的上下文值
  const contextValue = {
    showFeedback,
    closeFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showWithUndo,
    closeAll
  };

  return (
    <>
      {messages.map(msg => (
        <FeedbackMessage
          key={msg.id}
          type={msg.type}
          message={msg.message}
          duration={msg.duration}
          onClose={() => closeFeedback(msg.id)}
          onUndo={() => undoFeedback(msg.id)}
          canUndo={msg.canUndo}
          className={msg.className}
        />
      ))}
    </>
  );
};

// 创建反馈钩子
const useFeedback = () => {
  const [manager] = useState(() => {
    // 这里使用简单的实现，实际项目中可能需要使用Context
    const messages = [];
    let nextId = 1;

    const showFeedback = (options) => {
      const id = nextId++;
      const message = { id, ...options };
      messages.push(message);
      
      // 自动关闭
      if (message.duration > 0) {
        setTimeout(() => {
          closeFeedback(id);
        }, message.duration);
      }
      
      return id;
    };

    const closeFeedback = (id) => {
      const index = messages.findIndex(msg => msg.id === id);
      if (index !== -1) {
        messages.splice(index, 1);
      }
    };

    return {
      showFeedback,
      closeFeedback,
      showSuccess: (message, options = {}) => showFeedback({ type: 'success', message, ...options }),
      showError: (message, options = {}) => showFeedback({ type: 'error', message, duration: 8000, ...options }),
      showWarning: (message, options = {}) => showFeedback({ type: 'warning', message, duration: 6000, ...options }),
      showInfo: (message, options = {}) => showFeedback({ type: 'info', message, ...options }),
      showWithUndo: (message, onUndo, options = {}) => showFeedback({ 
        message, 
        canUndo: true, 
        onUndo, 
        duration: 10000, 
        ...options 
      })
    };
  });

  return manager;
};

export { FeedbackMessage, FeedbackManager };
