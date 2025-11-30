import { useState } from 'react';
import ItemCard from './ItemCard';
import Pagination from './Pagination';

/**
 * 商品列表组件
 * @param {Array} items - 商品数据数组
 * @param {Function} onItemClick - 商品点击回调
 * @param {number} pageSize - 每页显示的商品数量
 */
const ItemList = ({ items = [], onItemClick, pageSize = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 计算总页数
  const totalPages = Math.ceil(items.length / pageSize);

  // 获取当前页的商品
  const currentItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="text-[#666] text-lg">暂无商品</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 商品卡片水平滚动列表 */}
      <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar">
        {currentItems.map((item) => (
          <div key={item.id} className="min-w-[280px] sm:min-w-[320px] w-full flex-shrink-0">
            <ItemCard
              item={item}
              onClick={() => onItemClick(item)}
            />
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 分页信息 */}
      <div className="mt-4 text-center text-[#666] text-sm">
        显示 {currentItems.length} 件商品中的 {items.length} 件
      </div>
    </div>
  );
};

export default ItemList;