import { useState, useEffect, useRef } from 'react';
import { filesToBase64 } from '../utils/imageUtils';
import LocationPicker from './LocationPicker';
import { AIIcon } from './Icons';
import { useAccessibility } from './AccessibilityProvider';

/**
 * 商品表单组件（用于发布和编辑）
 * @param {Object} item - 要编辑的商品（可选）
 * @param {Function} onSubmit - 提交回调
 * @param {Function} onCancel - 取消回调
 */
const ItemForm = ({ item = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '九成新',
    images: [],
    allowValuePoints: false, // 是否允许价值点兑换
    valuePointsPrice: '', // 价值点兑换价格
    location: null, // 商品位置 {latitude, longitude, address, contactInfo}
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { announce } = useAccessibility();

  // 如果是编辑模式，填充表单数据
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || '',
        condition: item.condition || '九成新',
        images: item.images || [],
        allowValuePoints: item.allowValuePoints || false,
        valuePointsPrice: item.valuePointsPrice || '',
        location: item.location || null,
      });
    }
  }, [item]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // 提供输入反馈
    // 这里可以添加自动补全逻辑
    if (name === 'category' && value.length > 1) {
      const categories = ['电子产品', '服装配饰', '家具家电', '图书文具', '运动户外', '美妆护肤', '其他'];
      const matchingCategories = categories.filter(cat => 
        cat.toLowerCase().includes(value.toLowerCase())
      );
      if (matchingCategories.length === 1 && value.toLowerCase() !== matchingCategories[0].toLowerCase()) {
        console.log(`建议: ${matchingCategories[0]}`);
      }
    }
  };

  // 处理图片选择
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      // 转换为 base64
      const base64Images = await filesToBase64(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
      setImageFiles(prev => [...prev, ...files]);
      
      // 提供反馈
      announce(`已选择${files.length}张图片`);
    } catch (error) {
      console.error('Error converting images:', error);
      announce('图片处理失败，请重试', 'assertive');
      // 替换alert为更友好的错误显示
      setErrors({ submit: '图片处理失败，请重试' });
    }
  };

  // 删除图片
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // 提供反馈
    announce('图片已删除');
  };

  // AI商品识别功能
  const handleAIAnalysis = () => {
    if (formData.images.length === 0) {
      announce('请先上传商品图片', 'assertive');
      return;
    }

    setIsAIAnalyzing(true);
    announce('AI正在识别商品信息...', 'assertive');
    
    // 模拟AI分析过程
    setTimeout(() => {
      // 模拟识别结果（实际项目中这里会调用真实的AI API）
      const mockAIResults = {
        name: '高等数学第七版',
        category: '教材教辅',
        description: '同济大学数学系编，高等教育出版社出版，适用于大学一年级学生使用。',
        estimatedPrice: 8, // 校内历史平均成交价
        confidence: 0.95
      };

      // 填充表单数据
      setFormData(prev => ({
        ...prev,
        title: mockAIResults.name,
        category: mockAIResults.category,
        description: mockAIResults.description,
        price: mockAIResults.estimatedPrice.toString()
      }));

      // 提供详细的识别结果反馈
      announce(`AI识别成功！商品名称：${mockAIResults.name}，参考价格：${mockAIResults.estimatedPrice}元，置信度：${(mockAIResults.confidence * 100).toFixed(1)}%`, 'assertive');
      setIsAIAnalyzing(false);
    }, 2000);
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 重置错误
    setErrors({});
    
    // 验证必填字段
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = '请输入商品标题';
    }
    if (!formData.description) {
      newErrors.description = '请输入商品描述';
    }
    if (!formData.price) {
      newErrors.price = '请输入商品价格';
    }
    
    // 验证位置信息
    if (!formData.location || !formData.location.latitude || !formData.location.longitude) {
      newErrors.location = '请选择商品位置';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // 焦点移动到第一个错误字段
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`${firstErrorField}-input`);
      if (errorElement) {
        errorElement.focus();
        announce(`请修正以下错误：${Object.values(newErrors).join('; ')}`, 'assertive');
      }
      return;
    }

    setIsSubmitting(true);
    announce('正在提交商品信息...', 'assertive');
    
    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        sellerId: 'current_seller', // 当前用户作为卖方（实际应用中应使用真实用户ID）
      });
      
      // 提供成功反馈
      announce('商品发布成功！', 'assertive');
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '九成新',
        images: [],
        allowValuePoints: false,
        valuePointsPrice: '',
        location: null,
      });
      setImageFiles([]);
    } catch (error) {
      console.error('Submit error:', error);
      announce('提交失败，请重试', 'assertive');
      setErrors({ submit: '提交失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-[#0a0a0a] border border-[#E60023]/30 p-6 rounded-lg animate-slide-in"
      ref={formRef}
      aria-label={item ? '编辑商品表单' : '发布商品表单'}
    >
      <h2 className="text-2xl font-bold mb-6 text-white">
        {item ? '编辑商品' : '发布商品'}
      </h2>

      {/* 标题 */}
      <div className="mb-6">
        <label 
          htmlFor="title-input" 
          className="block text-sm font-medium text-white mb-2"
          aria-required="true"
        >
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title-input"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-label="商品标题"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent placeholder-[#666] transition-all min-h-[48px]"
          placeholder="请输入商品标题"
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* 描述 */}
      <div className="mb-6">
        <label 
          htmlFor="description-input" 
          className="block text-sm font-medium text-white mb-2"
          aria-required="true"
        >
          描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description-input"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
          aria-label="商品描述"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent placeholder-[#666] transition-all resize-vertical min-h-[120px]"
          placeholder="请输入商品描述"
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* 价格 */}
      <div className="mb-6">
        <label 
          htmlFor="price-input" 
          className="block text-sm font-medium text-white mb-2"
          aria-required="true"
        >
          价格 <span className="text-red-500">*</span>
        </label>
        <input
          id="price-input"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          aria-invalid={errors.price ? 'true' : 'false'}
          aria-describedby={errors.price ? 'price-error' : undefined}
          aria-label="商品价格"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent placeholder-[#666] transition-all min-h-[48px]"
          placeholder="价格（元，AI识别可提供参考价格）"
        />
        {errors.price && (
          <p id="price-error" className="mt-1 text-sm text-red-500">{errors.price}</p>
        )}
      </div>

      {/* 分类 */}
      <div className="mb-6">
        <label 
          htmlFor="category-input" 
          className="block text-sm font-medium text-white mb-2"
        >
          分类
        </label>
        <select
          id="category-input"
          name="category"
          value={formData.category}
          onChange={handleChange}
          aria-label="商品分类"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all cursor-pointer min-h-[48px]"
        >
          <option value="">请选择分类</option>
          <option value="电子产品">电子产品</option>
          <option value="服装配饰">服装配饰</option>
          <option value="家具家电">家具家电</option>
          <option value="图书文具">图书文具</option>
          <option value="运动户外">运动户外</option>
          <option value="美妆护肤">美妆护肤</option>
          <option value="其他">其他</option>
        </select>
      </div>

      {/* 成色 */}
      <div className="mb-6">
        <label 
          htmlFor="condition-input" 
          className="block text-sm font-medium text-white mb-2"
        >
          成色
        </label>
        <select
          id="condition-input"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          aria-label="商品成色"
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all cursor-pointer min-h-[48px]"
        >
          <option value="全新">全新</option>
          <option value="九成新">九成新</option>
          <option value="八成新">八成新</option>
          <option value="七成新">七成新</option>
          <option value="其他">其他</option>
        </select>
      </div>

      {/* 价值点兑换选项 */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <div className="flex items-center mb-3">
          <input
              type="checkbox"
              name="allowValuePoints"
              id="allowValuePoints"
              checked={formData.allowValuePoints}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  allowValuePoints: e.target.checked,
                  valuePointsPrice: e.target.checked ? prev.valuePointsPrice : '',
                }));
                announce(e.target.checked ? '已开启价值点兑换' : '已关闭价值点兑换');
              }}
              className="w-5 h-5 text-white bg-[#1a1a1a] border-[#E60023]/30 rounded focus:ring-[#E60023] cursor-pointer"
          />
          <label 
            htmlFor="allowValuePoints" 
            className="ml-3 text-sm font-medium text-white cursor-pointer"
          >
            允许使用价值点兑换
          </label>
        </div>
        
        {formData.allowValuePoints && (
          <div>
            <label 
              htmlFor="valuePointsPrice-input" 
              className="block text-sm font-medium text-white mb-2"
            >
              价值点兑换价格
            </label>
            <input
              id="valuePointsPrice-input"
              type="number"
              name="valuePointsPrice"
              value={formData.valuePointsPrice}
              onChange={handleChange}
              min="1"
              step="1"
              aria-label="价值点兑换价格"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent placeholder-[#666] transition-all min-h-[48px]"
              placeholder="请输入价值点数量"
            />
            <p className="text-xs text-[#a0a0a0] mt-2">
              用户可以使用价值点兑换此商品
            </p>
          </div>
        )}
      </div>

      {/* 位置选择 */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <h3 
          className="text-sm font-medium text-white mb-4"
          aria-required="true"
        >
          商品位置 <span className="text-red-500">*</span>
        </h3>
        <div 
          aria-invalid={errors.location ? 'true' : 'false'}
          aria-describedby={errors.location ? 'location-error' : undefined}
        >
          <LocationPicker
            value={formData.location}
            onChange={(location) => {
              setFormData(prev => ({ ...prev, location }));
              if (location) {
                announce('位置已选择');
              }
            }}
            showInstruction={true}
          />
          {errors.location && (
            <p id="location-error" className="mt-2 text-sm text-red-500">{errors.location}</p>
          )}
        </div>
        <p className="text-xs text-[#a0a0a0] mt-2">
          设置商品位置，买家购买后将能查看具体位置
        </p>
      </div>

      {/* 图片上传和AI识别 */}
      <div className="mb-6">
        <label 
          htmlFor="images-input" 
          className="block text-sm font-medium text-white mb-2"
        >
          商品图片（可多选）
        </label>
        <div className="relative">
          <input
            id="images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#E60023] file:text-white hover:file:bg-[#c4001e] shadow-md shadow-[#E60023]/20 min-h-[48px]"
            aria-label="选择商品图片"
          />
        </div>
        
        {/* 图片预览 */}
        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`商品图片 ${index + 1}`}
                  loading="lazy"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  aria-label={`删除图片 ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* AI智能识别按钮 */}
        {formData.images.length > 0 && (
          <button
            type="button"
            onClick={handleAIAnalysis}
            disabled={isAIAnalyzing}
            className="mt-4 flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-[#e0e0e0] transition-all btn-hover-effect font-medium min-h-[48px]"
            aria-busy={isAIAnalyzing}
          >
            <AIIcon className="w-5 h-5" />
            {isAIAnalyzing ? 'AI识别中...' : 'AI智能识别商品'}
          </button>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 pt-2">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300 w-full">
            {errors.submit}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-[#E60023] text-white rounded-lg hover:bg-[#c4001e] disabled:bg-[#1a1a1a] disabled:text-[#666] transition-all btn-hover-effect font-medium shadow-md shadow-[#E60023]/20 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E60023]"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? '提交中...' : (item ? '更新' : '发布')}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;

