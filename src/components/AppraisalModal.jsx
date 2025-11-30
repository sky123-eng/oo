import { useState } from 'react';
import { aiAppraiseItem } from '../utils/aiAppraisal';
import AppraisalResult from './AppraisalResult';
import { AIIcon } from './Icons';

/**
 * AI 鉴定模态框组件
 * @param {Object} item - 要鉴定的商品
 * @param {Function} onClose - 关闭回调
 * @param {Function} onComplete - 鉴定完成回调
 */
const AppraisalModal = ({ item, onClose, onComplete }) => {
  const [isAppraising, setIsAppraising] = useState(false);
  const [appraisalResult, setAppraisalResult] = useState(null);
  const [error, setError] = useState(null);

  // 执行鉴定
  const handleAppraise = async () => {
    if (!item) return;

    setIsAppraising(true);
    setError(null);

    try {
      const result = await aiAppraiseItem(item, item.images || []);
      setAppraisalResult(result);
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error('Appraisal error:', err);
      setError('鉴定失败，请重试');
    } finally {
      setIsAppraising(false);
    }
  };

  // 如果已有鉴定结果，显示结果
  if (appraisalResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="w-full max-w-4xl">
          <AppraisalResult
            appraisal={appraisalResult}
            onClose={() => {
              setAppraisalResult(null); // 重置结果状态
              onClose(); // 关闭模态框
            }}
          />
        </div>
      </div>
    );
  }

  // 显示鉴定界面
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
              <AIIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 智能鉴定</h2>
            <p className="text-gray-600 text-sm">
              使用 AI 技术对商品进行全方位评估
            </p>
          </div>

          {/* 商品信息预览 */}
          {item && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>分类: {item.category || '未分类'}</p>
                <p>成色: {item.condition || '未知'}</p>
                <p>价格: ¥{item.price?.toLocaleString() || '0'}</p>
                <p>图片: {item.images?.length || 0} 张</p>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 鉴定中状态 */}
          {isAppraising && (
            <div className="mb-4">
              <div className="flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-sm text-gray-600">AI 正在分析商品信息...</p>
              <p className="text-xs text-gray-500 mt-1">这可能需要几秒钟</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isAppraising}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAppraise}
              disabled={isAppraising}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {isAppraising ? '鉴定中...' : '开始鉴定'}
            </button>
          </div>

          {/* 说明 */}
          <p className="text-xs text-gray-500 mt-4">
            AI 将分析商品图片、描述、价格等信息，生成综合评估报告
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppraisalModal;

