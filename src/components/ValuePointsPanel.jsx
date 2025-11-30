import { useState } from 'react';
import AccompanimentForm from './AccompanimentForm';
import { ValuePointsIcon, AwardIcon, ShopIcon, LeafIcon } from './Icons';

/**
 * 环保碳积分管理面板组件
 * @param {number} valuePoints - 当前碳积分余额
 * @param {Array} accompanimentRecords - 陪伴记录列表
 * @param {Array} transactionRecords - 交易记录列表
 * @param {Array} exchangeItems - 可兑换商品列表
 * @param {Function} onAddAccompaniment - 添加陪伴记录回调
 * @param {Function} onApproveAccompaniment - 审核陪伴记录回调（管理员功能）
 * @param {Function} onExchangeItem - 兑换商品回调
 * @param {Function} onBack - 返回平台功能回调
 */
const ValuePointsPanel = ({
  valuePoints = 0,
  accompanimentRecords = [],
  items = [],
  onAddRecord,
  onApprove,
  onRedeem,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, records, shop
  const [selectedExchangeItem, setSelectedExchangeItem] = useState(null);

  // 处理添加陪伴记录
  const handleAddAccompaniment = async (recordData) => {
    try {
      await onAddRecord(recordData);
      setShowForm(false);
      setActiveTab('records');
      alert('陪伴记录已提交，等待审核');
    } catch (error) {
      console.error('Failed to add accompaniment:', error);
      alert('提交失败，请重试');
    }
  };

  // 处理审核（管理员功能）
  const handleApprove = (recordId, points) => {
    if (window.confirm(`确定通过此记录并奖励 ${points} 价值点吗？`)) {
      onApprove(recordId, points);
    }
  };

  // 获取状态标签样式
  const getStatusBadge = (status) => {
    const styles = {
    pending: 'bg-[#1a1a1a] border border-[#E60023]/50 text-white',
    approved: 'bg-[#1a1a1a] border border-[#E60023] text-white',
    rejected: 'bg-[#1a1a1a] border border-[#E60023]/50 text-white',
  };
    const labels = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || '未知'}
      </span>
    );
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#E60023]/30 rounded-lg p-6 animate-slide-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <LeafIcon className="w-6 h-6 text-white" />
          <span>环保碳积分中心</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
          >
            返回首页
          </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium flex-1"
                >
                  <AwardIcon className="w-4 h-4 inline mr-1" />
                  {showForm ? '取消' : '记录陪伴'}
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium flex-1"
                >
                  <ShopIcon className="w-4 h-4 inline mr-1" />
                  兑换商品
                </button>
              </div>
        </div>
      </div>

      {/* 陪伴记录表单 */}
      {showForm && (
        <div className="mb-6">
          <AccompanimentForm
            onSubmit={handleAddAccompaniment}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 标签页 */}
      {!showForm && (
        <>
          <div className="flex border-b border-[#E60023]/20 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#E60023] text-white'
                  : 'text-[#a0a0a0] hover:text-white'
              }`}
            >
              概览
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === 'records'
                  ? 'border-b-2 border-[#E60023] text-white'
                  : 'text-[#a0a0a0] hover:text-white'
              }`}
            >
              陪伴记录 ({accompanimentRecords.length})
            </button>
          </div>

          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* 价值点余额 */}
              <div className="p-6 bg-gradient-to-r from-black to-[#1a1a1a] border border-[#E60023]/50 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-2">当前价值点余额</p>
                <p className="text-4xl font-bold text-white">{valuePoints}</p>
                <p className="text-sm opacity-75 mt-2">
                  可用于兑换商品或服务
                </p>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1a1a1a] border border-[#E60023]/20 rounded-lg hover:bg-[#E60023]/10 transition-all">
                  <p className="text-sm text-gray-400 mb-1">总记录数</p>
                  <p className="text-2xl font-bold text-white">
                    {accompanimentRecords.length}
                  </p>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-[#E60023]/20 rounded-lg hover:bg-[#E60023]/10 transition-all">
                  <p className="text-sm text-gray-400 mb-1">待审核</p>
                  <p className="text-2xl font-bold text-white">
                    {accompanimentRecords.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>

              {/* 说明 */}
              <div className="p-4 bg-[#1a1a1a] border border-[#E60023]/20 rounded-lg">
                <h3 className="font-semibold text-white mb-2">如何获得价值点？</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 提供陪伴服务（聊天、学习辅导、生活帮助等）</li>
                  <li>• 记录您的陪伴服务，等待审核</li>
                  <li>• 审核通过后即可获得价值点</li>
                  <li>• 使用价值点兑换心仪的商品</li>
                </ul>
              </div>
            </div>
          )}

          {/* 记录列表标签页 */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              {accompanimentRecords.length + transactionRecords.length === 0 ? (
                <div className="text-center py-8 text-[#a0a0a0]">
                  <p>还没有积分记录</p>
                  <p className="text-sm mt-2">卖出商品或提供陪伴服务开始获得碳积分</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 合并并排序所有记录 */}
                  {[
                    ...accompanimentRecords.map(record => ({
                      ...record,
                      type: 'accompaniment',
                      displayPoints: record.points,
                      displayTitle: record.serviceType
                    })),
                    ...transactionRecords.map(record => ({
                      ...record,
                      type: 'transaction',
                      displayPoints: 5, // 每笔交易固定5积分
                      displayTitle: `出售商品: ${record.itemName || '未知商品'}`,
                      status: 'approved',
                      createdAt: record.createdAt || new Date().toISOString()
                    }))
                  ]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(record => (
                      <div
                        key={record.id}
                        className="p-4 border border-[#E60023]/20 bg-[#1a1a1a] rounded-lg hover:bg-[#E60023]/10 transition-all card-hover group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {record.type === 'transaction' ? (
                              <LeafIcon className="w-4 h-4 text-green-400" />
                            ) : (
                              <AwardIcon className="w-4 h-4 text-yellow-400" />
                            )}
                            <h3 className="font-semibold text-white">{record.displayTitle}</h3>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${record.status === 'approved' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}>
                            {record.status === 'approved' ? '已通过' : '待审核'}
                          </span>
                        </div>
                        {record.description && (
                          <p className="text-sm text-gray-400 mb-2">{record.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="text-white font-medium">获得 {record.displayPoints} 碳积分</span>
                          <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                        {record.status === 'pending' && onApproveAccompaniment && (
                          <button
                            onClick={() => onApproveAccompaniment(record.id)}
                            className="mt-3 text-xs bg-white text-black px-3 py-1 rounded hover:bg-[#e0e0e0] transition-colors"
                          >
                            审核通过
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 兑换商店标签页 */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ShopIcon className="w-5 h-5 text-white" />
                积分兑换商店
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exchangeItems.length === 0 ? (
                  <div className="text-center py-8 text-[#a0a0a0] col-span-full">
                    <p>暂无可兑换商品</p>
                  </div>
                ) : (
                  exchangeItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all ${selectedExchangeItem === item.id ? 'border-[#E60023] bg-[#E60023]/10' : 'border-gray-700 bg-[#1a1a1a] hover:border-[#E60023]/50'}`}
                    >
                      <h4 className="font-semibold text-white mb-2">{item.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">{item.points} 积分</span>
                        <button
                          onClick={() => {
                            if (valuePoints >= item.points) {
                              setSelectedExchangeItem(item.id);
                              onExchangeItem && onExchangeItem(item.id);
                            }
                          }}
                          disabled={valuePoints < item.points}
                          className={`text-sm px-3 py-1 rounded transition-colors ${valuePoints >= item.points ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                          立即兑换
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* 兑换提示 */}
              <div className="p-3 bg-yellow-900/30 border border-yellow-800/50 rounded-lg text-sm text-yellow-300">
                <p className="flex items-center gap-2">
                  <LeafIcon className="w-4 h-4" />
                  <span>环保小贴士：每兑换一次商品，系统将为环保事业捐赠1角钱！</span>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ValuePointsPanel;

