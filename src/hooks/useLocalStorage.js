import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：使用 localStorage 进行状态持久化
 * @param {string} key - localStorage 的 key
 * @param {*} initialValue - 初始值
 * @returns {[*, Function]} 返回 [值, 更新函数]
 */
export const useLocalStorage = (key, initialValue) => {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新值的函数
  const setValue = (value) => {
    try {
      // 支持函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

