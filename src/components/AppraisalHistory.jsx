import { getAppraisalLevel, getAuthenticityLabel } from '../utils/aiAppraisal';
import { formatDate } from '../utils/formatters';
import { AIIcon, HomeIcon } from './Icons';

/**
 * 鉴定历史记录组件
 * @param {Array} appraisalHistory - 鉴定历史记录
 * @param {Function} onViewDetail - 查看详情回调
 * @param {Function} onRemove - 删除记录回调
 * @param {Function} onBack - 返回首页回调
 */
const AppraisalHistory = ({ appraisalHistory, onViewDetail, onRemove, onBack }) => {
  if (!appraisalHistory || appraisalHistory.length === 0) {
    return (
      <div className="text-center py-8 text-[#a0a0a0]">
        <p>还没有鉴定记录</p>
        <p className="text-sm mt-2">对商品进行 AI 鉴定后，记录会显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 返回首页按钮 */}
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium flex items-center gap-2 mb-4"
        >
          <HomeIcon className="w-4 h-4" />
          返回首页
        </button>
      )}
      {appraisalHistory.map((appraisal) => {
        const level = getAppraisalLevel(appraisal.overallScore);
        const authenticityInfo = getAuthenticityLabel(appraisal.authenticity.verdict);

        return (
          <div
            key={appraisal.itemId}
            className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-all card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    level.color === 'green' ? 'bg-[#1a1a1a] border-[#E60023] text-white' :
              level.color === 'blue' ? 'bg-[#1a1a1a] border-[#E60023] text-white' :
                    level.color === 'yellow' ? 'bg-[#1a1a1a] border-yellow-500 text-yellow-400' :
                    level.color === 'orange' ? 'bg-[#1a1a1a] border-orange-500 text-orange-400' :
                    'bg-[#1a1a1a] border-red-500 text-red-400'
                  }`}>
                    {appraisal.overallScore} 分 - {level.label}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded border font-medium ${
                    authenticityInfo.color === 'green' ? 'bg-[#1a1a1a] border-[#E60023] text-white' :
              authenticityInfo.color === 'blue' ? 'bg-[#1a1a1a] border-[#E60023] text-white' :
                    authenticityInfo.color === 'orange' ? 'bg-[#1a1a1a] border-orange-500 text-orange-400' :
                    'bg-[#1a1a1a] border-red-500 text-red-400'
                  }`}>
                    {authenticityInfo.label}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-[#a0a0a0]">真伪性: </span>
                    <span className="font-semibold text-white">{appraisal.authenticity.score}/100</span>
                  </div>
                  <div>
                    <span className="text-[#a0a0a0]">成色: </span>
                    <span className="font-semibold text-white">{appraisal.condition.score}/100</span>
                  </div>
                  <div>
                    <span className="text-[#a0a0a0]">价格: </span>
                    <span className="font-semibold text-white">{appraisal.price.score}/100</span>
                  </div>
                </div>

                <p className="text-xs text-[#666] flex items-center gap-1">
                  <AIIcon className="w-3 h-3" />
                  <span>
                    鉴定时间: {formatDate(appraisal.timestamp)} | 
                    模型: {appraisal.aiModel} | 
                    处理时间: {appraisal.processingTime}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onViewDetail(appraisal)}
                className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
              >
                查看详情
              </button>
              {onRemove && (
                <button
                  onClick={() => {
                    if (window.confirm('确定要删除这条鉴定记录吗？')) {
                      onRemove(appraisal.itemId);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium"
                >
                  删除
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppraisalHistory;

