import { useState, useEffect, useCallback } from 'react';

/**
 * 自定义 Hook：管理商品鉴定记录
 * @returns {Object} 鉴定管理相关的状态和方法
 */
export const useAppraisal = () => {
  const [appraisalHistory, setAppraisalHistory] = useState([]);
  const [isAppraising, setIsAppraising] = useState(false);

  // 从 localStorage 加载鉴定历史
  useEffect(() => {
    const saved = localStorage.getItem('appraisal_history');
    if (saved) {
      setAppraisalHistory(JSON.parse(saved));
    }
  }, []);

  // 保存鉴定历史到 localStorage
  const saveAppraisalHistory = useCallback((history) => {
    setAppraisalHistory(history);
    localStorage.setItem('appraisal_history', JSON.stringify(history));
  }, []);

  // 添加鉴定记录
  const addAppraisal = useCallback((appraisalResult) => {
    const updated = [appraisalResult, ...appraisalHistory];
    saveAppraisalHistory(updated);
    return appraisalResult;
  }, [appraisalHistory, saveAppraisalHistory]);

  // 获取商品的鉴定记录
  const getItemAppraisal = useCallback((itemId) => {
    return appraisalHistory.find(appraisal => appraisal.itemId === itemId);
  }, [appraisalHistory]);

  // 删除鉴定记录
  const removeAppraisal = useCallback((itemId) => {
    const updated = appraisalHistory.filter(appraisal => appraisal.itemId !== itemId);
    saveAppraisalHistory(updated);
  }, [appraisalHistory, saveAppraisalHistory]);

  return {
    appraisalHistory,
    isAppraising,
    setIsAppraising,
    addAppraisal,
    getItemAppraisal,
    removeAppraisal,
  };
};

