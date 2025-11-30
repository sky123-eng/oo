import { useState, useMemo, useEffect } from 'react';
import { useItems } from './hooks/useItems';
import { useValuePoints } from './hooks/useValuePoints';
import { useAppraisal } from './hooks/useAppraisal';
import ItemCard from './components/ItemCard';
import ItemForm from './components/ItemForm';
import ConversationalItemPublisher from './components/ConversationalItemPublisher';
import SearchAndFilter from './components/SearchAndFilter';
import Pagination from './components/Pagination';
import ValuePointsPanel from './components/ValuePointsPanel';
import AppraisalModal from './components/AppraisalModal';
import AppraisalResult from './components/AppraisalResult';
import AppraisalHistory from './components/AppraisalHistory';
import CheckoutSuccess from './components/CheckoutSuccess';
import OrderList from './components/OrderList';
import HomePage from './components/HomePage';
import TransactionTesting from './components/TransactionTesting';
import OneHandedLayout from './components/OneHandedLayout';
import CompanionMatching from './components/CompanionMatching';
import { createOrder } from './utils/order';
import { initMockData } from './mock/data';
import { ValuePointsIcon, AIIcon, OrderIcon, PublishIcon, BuyerIcon, SellerIcon, SearchIcon, TransactionIcon, LeafIcon, SettingsIcon, HomeIcon, CompanionIcon } from './components/Icons';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import AccessibilityControlPanel from './components/AccessibilityControlPanel';

/**
 * 主应用组件
 */
function App() {
  const { items, addItem, updateItem, removeItem } = useItems();
  const {
    valuePoints,
    accompanimentRecords,
    addAccompanimentRecord,
    approveAccompaniment,
    redeemItem,
  } = useValuePoints();
  
  const {
    appraisalHistory,
    addAppraisal,
    getItemAppraisal,
    removeAppraisal,
  } = useAppraisal();
  
  const [showForm, setShowForm] = useState(false);
  const [showConversationalPublisher, setShowConversationalPublisher] = useState(false);
  const [showValuePointsPanel, setShowValuePointsPanel] = useState(false);
  const [showAppraisalHistory, setShowAppraisalHistory] = useState(false);
  const [showCompanionMatching, setShowCompanionMatching] = useState(false);
  const [appraisingItem, setAppraisingItem] = useState(null);
  const [viewingAppraisal, setViewingAppraisal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [showBuyerOrders, setShowBuyerOrders] = useState(false);
  const [showSellerOrders, setShowSellerOrders] = useState(false);
  const [showBrowseItems, setShowBrowseItems] = useState(false); // 浏览商品页面
  const [showTransactionTesting, setShowTransactionTesting] = useState(false); // 交易测试页面
  const [userRole, setUserRole] = useState('buyer'); // 'buyer' 或 'seller'
  const [useOneHandedLayout, setUseOneHandedLayout] = useState(false); // 单手操作布局状态
  const [publishTemplates, setPublishTemplates] = useState([
    { id: 1, name: '教材模板', template: { category: '图书文具', condition: '九成新' } },
    { id: 2, name: '电子产品模板', template: { category: '电子产品', condition: '九成新' } },
    { id: 3, name: '服装模板', template: { category: '服装配饰', condition: '八成新' } },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showValuePointsOnly, setShowValuePointsOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 初始化 mock 数据（仅首次加载）
  useEffect(() => {
    initMockData();
  }, []);

  // 筛选和排序商品
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // 分类筛选
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    // 价值点兑换筛选
    if (showValuePointsOnly) {
      result = result.filter(item => item.allowValuePoints && item.valuePointsPrice);
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // 默认排序（不排序）
        break;
    }

    return result;
  }, [items, searchQuery, selectedCategory, sortBy, showValuePointsOnly]);

  // 分页计算
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 处理导航
  const handleNavigate = (page) => {
    // 只设置必要的状态，避免不必要的状态更新
    // 首先检查当前需要显示的页面，然后只更新相关状态
    switch (page) {
      case 'main':
        // 回到主页，隐藏所有其他页面
        setShowForm(false);
        setShowConversationalPublisher(false);
        setShowValuePointsPanel(false);
        setShowAppraisalHistory(false);
        setShowCompanionMatching(false);
        setShowBuyerOrders(false);
        setShowSellerOrders(false);
        setShowBrowseItems(false);
        setShowTransactionTesting(false);
        break;
      case 'browse':
        // 显示浏览页面，隐藏可能冲突的页面
        setShowBrowseItems(true);
        setShowForm(false);
        setShowConversationalPublisher(false);
        break;
      case 'publish':
        // 显示发布页面，隐藏可能冲突的页面
        setShowConversationalPublisher(true);
        setShowForm(false);
        setShowBrowseItems(false);
        break;
      case 'valuePoints':
        // 显示价值点页面，隐藏可能冲突的页面
        setShowValuePointsPanel(true);
        setShowBrowseItems(false);
        break;
      case 'companion':
        // 显示搭子匹配页面，隐藏可能冲突的页面
        setShowCompanionMatching(true);
        setShowBrowseItems(false);
        break;
      case 'orders':
        // 显示订单页面，隐藏可能冲突的页面
        setShowBuyerOrders(true);
        setShowSellerOrders(false);
        setShowBrowseItems(false);
        break;
      case 'transactionTesting':
        // 显示交易测试页面，隐藏可能冲突的页面
        setShowTransactionTesting(true);
        setShowBrowseItems(false);
        break;
      case 'toggleLayout':
        // 切换布局，不影响其他页面状态
        setUseOneHandedLayout(prev => !prev);
        break;
      default:
        // 默认为浏览页面
        setShowBrowseItems(true);
        setShowForm(false);
        setShowConversationalPublisher(false);
    }
  };

  // 处理表单提交
  const handleSubmit = (itemData) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
      setEditingItem(null);
    } else {
      addItem(itemData);
    }
    setShowForm(false);
  };

  // 处理对话式发布
  const handleConversationalPublish = (itemData) => {
    addItem(itemData);
    setShowConversationalPublisher(false);
  };

  // 处理模板选择
  const handleTemplateSelect = (template) => {
    // 创建新商品，应用模板
    const newItem = {
      title: '',
      description: '',
      price: 0,
      valuePointsPrice: 0,
      category: template.category,
      condition: template.condition,
      allowValuePoints: true,
      images: [],
      location: '',
      sellerId: '1',
      sellerName: '测试卖家',
    };
    setEditingItem(newItem);
    setShowForm(true);
    setShowConversationalPublisher(false);
  };

  // 切换单手操作布局
  const toggleOneHandedLayout = () => {
    setUseOneHandedLayout(prev => !prev);
  };

  // 处理商品购买
  const handlePurchase = async (item) => {
    try {
      // 创建订单
      const order = await createOrder({
        itemId: item.id,
        buyerId: '1',
        sellerId: item.sellerId,
        amount: item.price,
        location: item.location,
      });

      // 构建订单信息
      const orderInfo = {
        orderId: order.id,
        itemId: item.id,
        itemTitle: item.title,
        amount: item.price,
        location: item.location,
        createdAt: order.createdAt,
      };

      // 显示结算成功界面
      setCheckoutOrder(orderInfo);
      
      alert(`订单创建成功！\n订单号: ${order.id}\n等待卖方确认后即可取货。`);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('购买失败，请重试');
    }
  };

  // 处理商品兑换（使用价值点）
  const handleRedeem = async (item) => {
    try {
      // 检查价值点是否足够
      if (valuePoints < item.valuePointsPrice) {
        alert('价值点不足，无法兑换');
        return;
      }

      // 兑换商品
      await redeemItem(item.id);

      // 创建订单
      const order = await createOrder({
        itemId: item.id,
        buyerId: '1',
        sellerId: item.sellerId,
        amount: 0,
        valuePointsUsed: item.valuePointsPrice,
        location: item.location,
      });

      // 构建订单信息
      const orderInfo = {
        orderId: order.id,
        itemTitle: item.title,
        itemId: item.id,
        paymentMethod: 'valuePoints',
        valuePointsUsed: item.valuePointsPrice,
        amount: item.price,
        location: item.location,
        createdAt: order.createdAt,
      };

      // 显示结算成功界面
      setCheckoutOrder(orderInfo);
      
      alert(`兑换成功！\n订单号: ${order.id}\n等待卖方确认后即可取货。`);
    } catch (error) {
      console.error('Redeem error:', error);
      alert('兑换失败，请重试');
    }
  };

  // 渲染主界面
  const renderMainContent = () => {
    // 如果启用了单手操作布局，直接渲染单手操作界面
    if (useOneHandedLayout) {
      return (
        <OneHandedLayout 
          onNavigate={handleNavigate}
          onToggleLayout={toggleOneHandedLayout}
          userRole={userRole}
        />
      );
    }

    // 主页
    if (!showBrowseItems && !showForm && !showConversationalPublisher && !showValuePointsPanel && 
        !showAppraisalHistory && !showBuyerOrders && !showSellerOrders && !showTransactionTesting && 
        !viewingAppraisal && !checkoutOrder) {
      return <HomePage onNavigate={handleNavigate} userRole={userRole} />;
    }

    // 浏览商品页面
    if (showBrowseItems) {
      return (
        <div className="container mx-auto px-4 py-8">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showValuePointsOnly={showValuePointsOnly}
            onValuePointsOnlyChange={setShowValuePointsOnly}
            onPublishClick={() => setShowConversationalPublisher(true)}
          />

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">
              浏览商品
              {searchQuery && <span className="text-gray-400 ml-2">- "{searchQuery}"</span>}
            </h2>
            
            {paginatedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      onDelete={() => {
                        if (window.confirm(`确定要删除商品 "${item.title}" 吗？`)) {
                          removeItem(item.id);
                        }
                      }}
                      onPurchase={handlePurchase}
                      onRedeem={handleRedeem}
                      onAppraise={() => setAppraisingItem(item)}
                      canEdit={userRole === 'seller'}
                      valuePoints={valuePoints}
                    />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <SearchIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">未找到商品</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? `没有找到与 "${searchQuery}" 相关的商品` 
                    : '当前没有可浏览的商品'}
                </p>
                {userRole === 'seller' && (
                  <button
                    onClick={() => setShowConversationalPublisher(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2"
                  >
                    <PublishIcon className="h-5 w-5" />
                    <span>发布商品</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 碳积分面板
    if (showValuePointsPanel) {
      return (
        <ValuePointsPanel
          valuePoints={valuePoints}
          accompanimentRecords={accompanimentRecords}
          onAddRecord={addAccompanimentRecord}
          onApprove={approveAccompaniment}
          items={items.filter(item => item.allowValuePoints && item.valuePointsPrice)}
          onRedeem={handleRedeem}
          onClose={() => setShowValuePointsPanel(false)}
        />
      );
    }

    // 搭子匹配面板
    if (showCompanionMatching) {
      return (
        <CompanionMatching
          onClose={() => setShowCompanionMatching(false)}
        />
      );
    }

    // AI鉴定历史
    if (showAppraisalHistory) {
      return (
        <AppraisalHistory
          appraisalHistory={appraisalHistory}
          items={items}
          onRemoveAppraisal={removeAppraisal}
          onClose={() => setShowAppraisalHistory(false)}
          onBack={() => setShowAppraisalHistory(false)}
        />
      );
    }

    // 买家订单列表
    if (showBuyerOrders) {
      return (
        <OrderList
          role="buyer"
          onClose={() => setShowBuyerOrders(false)}
          onBack={() => setShowBuyerOrders(false)}
        />
      );
    }

    // 卖家订单列表
    if (showSellerOrders) {
      return (
        <OrderList
          role="seller"
          onClose={() => setShowSellerOrders(false)}
          onBack={() => setShowSellerOrders(false)}
        />
      );
    }

    // 交易测试页面
    if (showTransactionTesting) {
      return (
        <TransactionTesting
          items={items}
          onClose={() => setShowTransactionTesting(false)}
          onAppraise={(item) => setAppraisingItem(item)}
        />
      );
    }

    return null;
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <LeafIcon className="h-6 w-6 text-green-400" />
              <h1 className="text-xl font-bold">环保商城</h1>
            </div>
            

            
            {!useOneHandedLayout && (
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => handleNavigate('browse')}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  aria-label="浏览商品"
                >
                  <SearchIcon className="h-5 w-5" />
                  <span>浏览</span>
                </button>
                <button 
                  onClick={() => handleNavigate('publish')}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  aria-label="发布商品"
                >
                  <PublishIcon className="h-5 w-5" />
                  <span>发布</span>
                </button>
                <button 
                  onClick={() => handleNavigate('valuePoints')}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  aria-label="碳积分中心"
                >
                  <ValuePointsIcon className="h-5 w-5" />
                  <span>碳积分</span>
                </button>
                <button 
                  onClick={() => handleNavigate('orders')}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  aria-label="我的订单"
                >
                  <OrderIcon className="h-5 w-5" />
                  <span>订单</span>
                </button>
              </nav>
            )}
            
            <div className="flex items-center space-x-4">
              {/* 单手操作布局切换按钮 */}
              <button
                onClick={toggleOneHandedLayout}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label={useOneHandedLayout ? "退出单手操作布局" : "切换到单手操作布局"}
                title={useOneHandedLayout ? "退出单手操作布局" : "切换到单手操作布局"}
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              
              {!useOneHandedLayout && (
                <>
                  {/* 角色切换 */}
                  <div className="flex items-center space-x-2 bg-gray-700 p-1 rounded-full">
                    <button 
                      onClick={() => setUserRole('buyer')}
                      className={`px-3 py-1 rounded-full flex items-center space-x-1 ${userRole === 'buyer' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                      aria-label="买家角色"
                    >
                      <BuyerIcon className="h-4 w-4" />
                      <span className="text-sm">买家</span>
                    </button>
                    <button 
                      onClick={() => setUserRole('seller')}
                      className={`px-3 py-1 rounded-full flex items-center space-x-1 ${userRole === 'seller' ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'}`}
                      aria-label="卖家角色"
                    >
                      <SellerIcon className="h-4 w-4" />
                      <span className="text-sm">卖家</span>
                    </button>
                  </div>
                  
                  {/* 无障碍控制面板按钮 */}
                  <AccessibilityControlPanel />
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* 主要内容区域 */}
        <main className="flex-grow">
          {renderMainContent()}
        </main>
        
        {/* 页脚 */}
        <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-gray-400 text-sm">
          <div className="container mx-auto">
            <p>© 2023 环保商城 - 让环保成为生活方式</p>
          </div>
        </footer>
        
        {/* 各种模态框 */}
        {showForm && (
          <ItemForm 
            onClose={() => { setShowForm(false); setEditingItem(null); }}
            onSubmit={handleSubmit}
            initialData={editingItem}
          />
        )}
        
        {showConversationalPublisher && (
          <ConversationalItemPublisher 
            onClose={() => setShowConversationalPublisher(false)}
            onSubmit={handleConversationalPublish}
            onTemplateSelect={handleTemplateSelect}
            templates={publishTemplates}
          />
        )}
        
        {appraisingItem && (
          <AppraisalModal 
            item={appraisingItem}
            onClose={() => setAppraisingItem(null)}
            onAppraise={(result) => {
              addAppraisal(appraisingItem.id, result);
              setAppraisingItem(null);
              setViewingAppraisal({ itemId: appraisingItem.id, ...result });
            }}
          />
        )}
        
        {viewingAppraisal && (
          <AppraisalResult 
            appraisal={viewingAppraisal}
            onClose={() => setViewingAppraisal(null)}
          />
        )}
        
        {checkoutOrder && (
          <CheckoutSuccess 
            order={checkoutOrder}
            onClose={() => setCheckoutOrder(null)}
            onContinueShopping={() => {
              setCheckoutOrder(null);
              setShowBrowseItems(true);
            }}
          />
        )}
      </div>
    </AccessibilityProvider>
  );
}

export default App;