import { SearchIcon, FilterIcon } from './Icons';

/**
 * 搜索和筛选组件
 * @param {string} searchQuery - 搜索关键词
 * @param {string} category - 选中的分类
 * @param {string} sortBy - 排序方式
 * @param {boolean} showValuePointsOnly - 是否只显示支持碳积分兑换的商品
 * @param {Function} onSearchChange - 搜索变化回调
 * @param {Function} onCategoryChange - 分类变化回调
 * @param {Function} onSortChange - 排序变化回调
 * @param {Function} onValuePointsFilterChange - 碳积分筛选变化回调
 */
const SearchAndFilter = ({
  searchQuery,
  category,
  sortBy,
  showValuePointsOnly = false,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onValuePointsFilterChange,
}) => {
  const categories = [
    '全部',
    '电子产品',
    '服装配饰',
    '家具家电',
    '图书文具',
    '运动户外',
    '美妆护肤',
    '其他',
  ];

  const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'valuepoints-asc', label: '碳积分从低到高' },
    { value: 'valuepoints-desc', label: '碳积分从高到低' },
    { value: 'date-desc', label: '最新发布' },
  ];

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-lg mb-6 animate-slide-in">
      {/* 搜索框 */}
      <div className="mb-4 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666]">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索商品..."
          className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
        />
      </div>
      
      {/* 搜索和重置按钮 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onSearchChange(searchQuery)}
          className="bg-[#E60023] text-white py-2 px-4 rounded-lg hover:bg-[#c4001e] transition-all btn-hover-effect focus:outline-none focus:ring-2 focus:ring-[#E60023] flex-1 shadow-lg shadow-[#E60023]/20"
        >
          搜索
        </button>
        <button
          onClick={() => {
            onSearchChange('');
            onCategoryChange('');
            onSortChange('default');
            onValuePointsFilterChange(false);
          }}
          className="bg-white text-black py-2 px-4 rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect flex-1"
        >
          重置
        </button>
      </div>

      {/* 筛选和排序 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 分类筛选 */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-1.5">
            <FilterIcon className="w-4 h-4" />
            <span>分类筛选</span>
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat === '全部' ? '' : cat} className="bg-[#1a1a1a]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 排序 */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2">
            排序方式
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] transition-all"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 环保碳积分筛选 */}
      {onValuePointsFilterChange && (
        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <input
            type="checkbox"
            checked={showValuePointsOnly}
            onChange={(e) => onValuePointsFilterChange(e.target.checked)}
            className="w-4 h-4 text-[#E60023] bg-[#1a1a1a] border-[#E60023]/30 rounded focus:ring-[#E60023]"
          />
            <span className="ml-2 text-sm font-medium text-white">
              只显示支持环保碳积分兑换的商品
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;

