import { useState } from 'react';

/**
 * 反馈系统钩子
 * 提供显示和管理反馈消息的功能
 */
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

export default useFeedback;
