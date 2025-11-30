import { getAppraisalLevel, getAuthenticityLabel } from '../utils/aiAppraisal';
import { formatPrice } from '../utils/formatters';
import { AIIcon, StarIcon, CloseIcon } from './Icons';

/**
 * AI 鉴定结果展示组件
 * @param {Object} appraisal - 鉴定结果数据
 * @param {Function} onClose - 关闭回调
 */
const AppraisalResult = ({ appraisal, onClose }) => {
  if (!appraisal) return null;

  const { overallScore, authenticity, condition, price, images, recommendations, aiModel, processingTime } = appraisal;
  const level = getAppraisalLevel(overallScore);
  const authenticityInfo = getAuthenticityLabel(authenticity.verdict);

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-lg p-6 max-w-4xl mx-auto animate-slide-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AIIcon className="w-6 h-6" />
            <span>AI 鉴定结果</span>
          </h2>
          <p className="text-sm text-[#a0a0a0] mt-1">
            使用 {aiModel} 模型 | 处理时间: {processingTime}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#a0a0a0] hover:text-white transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      {/* 综合评分 */}
      <div className={`mb-6 p-6 rounded-lg bg-gradient-to-r ${
        level.color === 'green' ? 'from-green-500 to-emerald-600' :
        level.color === 'blue' ? 'from-blue-500 to-cyan-600' :
        level.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
        level.color === 'orange' ? 'from-orange-500 to-red-500' :
        'from-red-500 to-pink-600'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">综合评分</p>
            <p className="text-5xl font-bold">{overallScore}</p>
            <p className="text-lg mt-2 opacity-90">{level.label}</p>
          </div>
          <div className="text-right">
            <StarIcon className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* 详细评估 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 真伪性 */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">真伪性</h3>
            <span className={`px-2 py-1 text-xs rounded ${
              authenticityInfo.color === 'green' ? 'bg-green-100 text-green-800' :
              authenticityInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              authenticityInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {authenticityInfo.label}
            </span>
          </div>
            <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a0a0]">评分</span>
              <span className="font-semibold text-white">{authenticity.score}/100</span>
            </div>
            <div className="w-full bg-[#0a0a0a] rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  authenticityInfo.color === 'green' ? 'bg-green-500' :
                  authenticityInfo.color === 'blue' ? 'bg-blue-500' :
                  authenticityInfo.color === 'orange' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${authenticity.score}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#a0a0a0] mt-2">{authenticity.details}</p>
          <p className="text-xs text-[#666] mt-1">
            置信度: {authenticity.confidence === 'high' ? '高' : authenticity.confidence === 'medium' ? '中' : '低'}
          </p>
        </div>

        {/* 成色 */}
        <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">成色</h3>
            <span className="px-2 py-1 text-xs rounded bg-[#0a0a0a] border border-[#2a2a2a] text-white">
              {condition.assessment}
            </span>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a0a0]">评分</span>
              <span className="font-semibold text-white">{condition.score}/100</span>
            </div>
            <div className="w-full bg-[#0a0a0a] rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${condition.score}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#a0a0a0] mt-2">{condition.details}</p>
        </div>

        {/* 价格 */}
        <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">价格</h3>
            <span className={`px-2 py-1 text-xs rounded ${
              price.reasonableness === 'reasonable' ? 'bg-green-100 text-green-800' :
              price.reasonableness === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {price.reasonableness === 'reasonable' ? '合理' :
               price.reasonableness === 'moderate' ? '一般' : '存疑'}
            </span>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#a0a0a0]">评分</span>
              <span className="font-semibold text-white">{price.score}/100</span>
            </div>
            <div className="w-full bg-[#0a0a0a] rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  price.reasonableness === 'reasonable' ? 'bg-green-500' :
                  price.reasonableness === 'moderate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${price.score}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-[#a0a0a0] mt-2">
            <p>建议价格: {formatPrice(price.estimatedValue.suggested)}</p>
            <p className="text-[#666] mt-1">
              范围: {formatPrice(price.estimatedValue.min)} - {formatPrice(price.estimatedValue.max)}
            </p>
          </div>
        </div>
      </div>

      {/* 图片分析 */}
      {images && (
        <div className="mb-6 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <h3 className="font-semibold text-white mb-2">图片分析</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#a0a0a0]">图片数量: {images.count}</span>
            <span className={`px-2 py-1 text-xs rounded border ${
              images.quality === 'good' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' :
              images.quality === 'fair' ? 'bg-[#1a1a1a] border-[#666] text-[#ccc]' :
              'bg-[#1a1a1a] border-[#666] text-[#999]'
            }`}>
              {images.quality === 'good' ? '良好' : images.quality === 'fair' ? '一般' : '不足'}
            </span>
          </div>
          <p className="text-sm text-[#a0a0a0] mt-2">{images.analysis}</p>
        </div>
      )}

      {/* 建议 */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-3">AI 建议</h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  rec.type === 'success' ? 'bg-[#1a1a1a] border-[#2a2a2a]' :
                  rec.type === 'warning' ? 'bg-[#1a1a1a] border-yellow-500' :
                  'bg-[#1a1a1a] border-[#2a2a2a]'
                }`}
              >
                <p className={`font-medium text-sm ${
                  rec.type === 'success' ? 'text-white' :
                  rec.type === 'warning' ? 'text-yellow-400' :
                  'text-white'
                }`}>
                  {rec.title}
                </p>
                <p className={`text-xs mt-1 ${
                  rec.type === 'success' ? 'text-[#a0a0a0]' :
                  rec.type === 'warning' ? 'text-yellow-300' :
                  'text-[#a0a0a0]'
                }`}>
                  {rec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
        <p className="text-xs text-[#a0a0a0] text-center">
          ⚠️ 本鉴定结果由 AI 模型生成，仅供参考。实际交易时请仔细核实商品信息，建议选择平台担保交易。
        </p>
      </div>
    </div>
  );
};

export default AppraisalResult;

