import React, { useState } from 'react';
import { createTransaction, getTransactions, getTransaction, reviewTransaction } from '../utils/api';

/**
 * 交易测试组件
 * 用于测试前端与后端的交易API交互
 */
const TransactionTesting = () => {
  const [formData, setFormData] = useState({
    fromUserId: 'user1',
    toUserId: 'user2',
    type: 'MIXED',
    monetaryAmount: 100,
    humanValueAmount: 200,
    description: '测试交易'
  });
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // 创建交易
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await createTransaction(formData);
      setMessage(`交易创建成功！ID: ${result.id}`);
      // 清空表单
      setFormData({
        fromUserId: 'user1',
        toUserId: 'user2',
        type: 'MIXED',
        monetaryAmount: 100,
        humanValueAmount: 200,
        description: '测试交易'
      });
    } catch (error) {
      setMessage(`创建交易失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取交易列表
  const handleGetTransactions = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await getTransactions();
      setTransactions(result);
      setMessage(`获取到 ${result.length} 条交易记录`);
    } catch (error) {
      setMessage(`获取交易列表失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取单个交易详情
  const handleGetTransaction = async (id) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await getTransaction(id);
      setSelectedTransaction(result);
      setMessage(`获取交易详情成功！`);
    } catch (error) {
      setMessage(`获取交易详情失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 审核交易
  const handleReviewTransaction = async (id, action) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await reviewTransaction(id, { action });
      setMessage(`交易审核成功！新状态: ${result.status}`);
      // 更新交易列表
      handleGetTransactions();
    } catch (error) {
      setMessage(`审核交易失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">交易系统测试</h1>
      
      {/* 消息显示 */}
      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('失败') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* 创建交易表单 */}
      <div className="mb-8 p-6 bg-black border border-[#E60023]/20 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">创建交易</h2>
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发起用户ID</label>
              <input
                type="text"
                name="fromUserId"
                value={formData.fromUserId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">接收用户ID</label>
              <input
                type="text"
                name="toUserId"
                value={formData.toUserId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交易类型</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MIXED">混合交易</option>
                <option value="PHYSICAL_SALE">实物买卖</option>
                <option value="BARTER">以物换物</option>
                <option value="FAVOR_GIFT">人情礼品</option>
                <option value="LABOR_SERVICE">劳务交易</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">交易描述</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">实付金额</label>
              <input
                type="number"
                name="monetaryAmount"
                value={formData.monetaryAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">人情价值</label>
              <input
                type="number"
                name="humanValueAmount"
                value={formData.humanValueAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#E60023] text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed btn-hover-effect shadow-lg shadow-[#E60023]/20"
          >
            {isLoading ? '创建中...' : '创建交易'}
          </button>
        </form>
      </div>

      {/* 获取交易列表按钮 */}
      <div className="mb-6">
        <button 
          onClick={handleGetTransactions}
          disabled={isLoading}
          className="bg-[#E60023] text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed btn-hover-effect shadow-lg shadow-[#E60023]/20"
        >
          {isLoading ? '加载中...' : '获取交易列表'}
        </button>
      </div>

      {/* 交易列表 */}
      {transactions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">交易列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black border border-[#E60023]/20 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">发起者</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">接收者</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">实付金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">人情价值</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">风险等级</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.fromUserId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.toUserId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.monetaryAmount}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.humanValueAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : transaction.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.riskLevel === 'NORMAL' ? 'bg-green-100 text-green-800' : transaction.riskLevel === 'REVIEW' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleGetTransaction(transaction.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          查看
                        </button>
                        {transaction.status === 'PENDING' && transaction.riskLevel === 'REVIEW' && (
                          <>
                            <button 
                              onClick={() => handleReviewTransaction(transaction.id, 'APPROVE')}
                              className="px-3 py-1 bg-[#E60023] text-white font-medium rounded hover:bg-[#c4001e] text-sm shadow-md"
                            >
                              通过
                            </button>
                            <button 
                              onClick={() => handleReviewTransaction(transaction.id, 'REJECT')}
                              className="px-3 py-1 bg-[#E60023] text-white font-medium rounded hover:bg-[#c4001e] text-sm shadow-md"
                            >
                              拒绝
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 交易详情 */}
      {selectedTransaction && (
        <div className="mb-8 p-6 bg-black border border-[#E60023]/20 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">交易详情</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">ID:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">创建时间:</span>
                <p className="text-sm text-gray-900">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">发起用户:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.fromUserId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">接收用户:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.toUserId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">交易类型:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">交易描述:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">实付金额:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.monetaryAmount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">人情价值:</span>
                <p className="text-sm text-gray-900">{selectedTransaction.humanValueAmount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">状态:</span>
                <p className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTransaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : selectedTransaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : selectedTransaction.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {selectedTransaction.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">风险等级:</span>
                <p className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTransaction.riskLevel === 'NORMAL' ? 'bg-green-100 text-green-800' : selectedTransaction.riskLevel === 'REVIEW' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedTransaction.riskLevel}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTesting;