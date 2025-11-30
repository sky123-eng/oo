import { useState, useEffect, useCallback } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../utils/api';

/**
 * 自定义 Hook：管理商品数据
 * @returns {Object} 商品管理相关的状态和方法
 */
export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载商品列表
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // 添加商品
  const addItem = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await createItem(itemData);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新商品
  const updateItemById = useCallback(async (id, itemData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateItem(id, itemData);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除商品
  const removeItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    error,
    loadItems,
    addItem,
    updateItem: updateItemById,
    removeItem,
  };
};

