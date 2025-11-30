import { useState, useEffect, useCallback } from 'react';

/**
 * 自定义 Hook：管理用户价值点
 * @returns {Object} 价值点管理相关的状态和方法
 */
export const useValuePoints = () => {
  const [valuePoints, setValuePoints] = useState(0);
  const [accompanimentRecords, setAccompanimentRecords] = useState([]);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedPoints = localStorage.getItem('user_value_points');
    const savedRecords = localStorage.getItem('accompaniment_records');
    
    if (savedPoints) {
      setValuePoints(parseInt(savedPoints, 10));
    }
    
    if (savedRecords) {
      setAccompanimentRecords(JSON.parse(savedRecords));
    }
  }, []);

  // 保存价值点到 localStorage
  const saveValuePoints = useCallback((points) => {
    setValuePoints(points);
    localStorage.setItem('user_value_points', points.toString());
  }, []);

  // 保存陪伴记录到 localStorage
  const saveAccompanimentRecords = useCallback((records) => {
    setAccompanimentRecords(records);
    localStorage.setItem('accompaniment_records', JSON.stringify(records));
  }, []);

  // 添加价值陪伴记录
  const addAccompanimentRecord = useCallback((record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending: 待审核, approved: 已通过, rejected: 已拒绝
    };
    
    const updatedRecords = [...accompanimentRecords, newRecord];
    saveAccompanimentRecords(updatedRecords);
    
    return newRecord;
  }, [accompanimentRecords, saveAccompanimentRecords]);

  // 审核陪伴记录（通过后增加价值点）
  const approveAccompaniment = useCallback((recordId, points) => {
    const updatedRecords = accompanimentRecords.map(record => 
      record.id === recordId 
        ? { ...record, status: 'approved', approvedAt: new Date().toISOString() }
        : record
    );
    saveAccompanimentRecords(updatedRecords);
    
    // 增加价值点
    const newPoints = valuePoints + points;
    saveValuePoints(newPoints);
    
    return newPoints;
  }, [accompanimentRecords, valuePoints, saveAccompanimentRecords, saveValuePoints]);

  // 使用价值点兑换商品
  const redeemItem = useCallback((points) => {
    if (valuePoints < points) {
      throw new Error('价值点不足');
    }
    
    const newPoints = valuePoints - points;
    saveValuePoints(newPoints);
    
    return newPoints;
  }, [valuePoints, saveValuePoints]);

  // 添加价值点（管理员操作或系统奖励）
  const addValuePoints = useCallback((points) => {
    const newPoints = valuePoints + points;
    saveValuePoints(newPoints);
    return newPoints;
  }, [valuePoints, saveValuePoints]);

  return {
    valuePoints,
    accompanimentRecords,
    addAccompanimentRecord,
    approveAccompaniment,
    redeemItem,
    addValuePoints,
  };
};

