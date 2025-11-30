import { truncateText, formatPrice } from '../utils/formatters';
import { AIIcon, EditIcon, DeleteIcon } from './Icons';
import { useAccessibility } from './AccessibilityProvider'; // 引入无障碍hooks
import { useCallback } from 'react';

/**
 * 商品卡片组件
 * @param {Object} item - 商品数据
 * @param {Function} onEdit - 编辑回调
 * @param {Function} onDelete - 删除回调
 * @param {Function} onRedeem - 价值点兑换回调
 * @param {Function} onAppraise - AI 鉴定回调
 * @param {number} userValuePoints - 用户当前价值点余额
 * @param {Object} appraisalResult - 该商品的鉴定结果（可选）
 */
const ItemCard = ({ item, onEdit, onDelete, onRedeem, onAppraise, onPurchase, userValuePoints = 0, appraisalResult = null }) => {
  const { id, title, description, price, images, category, condition, createdAt, allowValuePoints, valuePointsPrice } = item;
  const { announce } = useAccessibility(); // 使用无障碍反馈功能
  
  // 处理按钮点击和键盘操作 - 使用useCallback缓存函数
  const handleButtonClick = useCallback((action, actionName) => {
    announce(`${actionName} ${title}`);
    action(item);
  }, [announce, title, item]);
  
  // 处理按钮键盘焦点 - 使用useCallback缓存函数
  const handleFocus = useCallback((e) => {
    e.currentTarget.classList.add('focused');
  }, []);
  
  const handleBlur = useCallback((e) => {
    e.currentTarget.classList.remove('focused');
  }, []);

  return (
    <div 
      className="bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden card-hover animate-slide-in"
      role="article"
      aria-labelledby={`item-title-${id}`}
      aria-describedby={`item-description-${id}`}
      tabIndex="0"
    >
      {/* 图片区域 */}
      <div className="relative w-full h-48 bg-[#1a1a1a]">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#666]">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* 多图标识 */}
        {images && images.length > 1 && (
          <div 
            className="absolute top-2 right-2 bg-[#0a0a0a] bg-opacity-80 backdrop-blur-sm border border-[#2a2a2a] text-white px-2 py-1 rounded text-xs font-medium"
            aria-label={`共${images.length}张图片`}
          >
            {images.length}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 
          id={`item-title-${id}`}
          className="text-lg font-semibold text-white mb-2 line-clamp-2"
        >
          {title}
        </h3>

        {/* 描述 */}
        <p 
          id={`item-description-${id}`}
          className="text-sm text-[#a0a0a0] mb-3 line-clamp-2"
          aria-hidden={false}
        >
          {truncateText(description, 60)}
        </p>

        {/* 标签和分类 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {category && (
            <span className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded font-medium">
              {category}
            </span>
          )}
          {condition && (
            <span className={`px-2 py-1 text-xs rounded border font-medium ${
              condition === '全新' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' :
              condition === '九成新' ? 'bg-[#1a1a1a] border-[#666] text-[#ccc]' :
              'bg-[#1a1a1a] border-[#444] text-[#999]'
            }`}>
              {condition}
            </span>
          )}
          {/* AI 鉴定标识 */}
          {appraisalResult && (
            <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 border font-medium ${
              appraisalResult.overallScore >= 85 ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' :
              appraisalResult.overallScore >= 70 ? 'bg-[#1a1a1a] border-[#666] text-[#ccc]' :
              'bg-[#1a1a1a] border-[#666] text-[#999]'
            }`}>
              <AIIcon className="w-3 h-3" />
              <span>已鉴定 {appraisalResult.overallScore}分</span>
            </span>
          )}
        </div>

        {/* 价格信息 */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {formatPrice(price)}
            </span>
            {allowValuePoints && valuePointsPrice && (
              <span className="text-sm text-[#ccc] font-medium">
                或 {valuePointsPrice} 价值点
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-4">
          {/* 购买按钮 */}
          <button 
            onClick={() => handleButtonClick(onPurchase, '购买')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 h-12 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 btn-hover-effect focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#141414]"
            aria-label={`购买 ${title}，价格 ${formatPrice(price)}`}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleButtonClick(onPurchase, '购买');
              }
            }}
          >
            <span>立即购买</span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded">{item.price}元</span>
          </button>
          
          {/* 价值点兑换按钮 */}
          {userValuePoints >= (item.valuePointsPrice || Infinity) && item.allowValuePoints && (
            <button 
              onClick={() => handleButtonClick(onRedeem, '价值点兑换')}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex items-center justify-center gap-2 px-4 py-2 h-12 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 btn-hover-effect focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#141414]"
              aria-label={`价值点兑换 ${title}，需要 ${valuePointsPrice} 价值点`}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleButtonClick(onRedeem, '价值点兑换');
                }
              }}
            >
              <span>价值点兑换</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded">{item.valuePointsPrice}点</span>
            </button>
          )}
          
          {/* AI鉴定按钮 */}
          <button 
            onClick={() => handleButtonClick(onAppraise, 'AI鉴定')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex items-center justify-center gap-2 px-4 py-2 h-12 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 btn-hover-effect focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#141414]"
            aria-label={`AI鉴定 ${title}`}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleButtonClick(onAppraise, 'AI鉴定');
              }
            }}
            disabled={appraisalResult?.isLoading}
          >
            <span>AI鉴定</span>
            <div className="flex items-center">
              {appraisalResult?.isLoading && (
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded" aria-live="polite">鉴定中...</span>
              )}
              {appraisalResult?.result && (
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded">
                  {appraisalResult.result === 'genuine' ? '真品' : '仿品'}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

