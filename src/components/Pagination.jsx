/**
 * 分页组件
 * @param {number} currentPage - 当前页码
 * @param {number} totalPages - 总页数
 * @param {Function} onPageChange - 页码变化回调
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-lg transition-colors ${
      currentPage === 1
        ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'border-black bg-white text-black hover:bg-gray-200'
    }`}
      >
        上一页
      </button>

      {/* 第一页 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-[#f0f0f0] text-black hover:bg-gray-300 transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* 页码 */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
      page === currentPage
        ? 'bg-white text-black border-black hover:bg-gray-200'
        : 'border-gray-300 bg-[#f0f0f0] text-black hover:bg-gray-300'
    }`}
        >
          {page}
        </button>
      ))}

      {/* 最后一页 */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-[#f0f0f0] text-black hover:bg-gray-300 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-lg transition-colors ${
      currentPage === totalPages
        ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'border-black bg-white text-black hover:bg-gray-200'
    }`}
      >
        下一页
      </button>
    </div>
  );
};

export default Pagination;

