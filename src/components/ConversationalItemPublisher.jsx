import React, { useState, useCallback } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import VoiceInterface from './VoiceInterface';
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from './Icons';

/**
 * 对话式发布商品组件
 * 提供一步一步的引导式流程，帮助用户轻松发布商品
 * 符合WCAG 2.2 AA标准，支持无障碍访问
 */
const ConversationalItemPublisher = ({ onItemPublished, onCancel, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '九成新',
    images: [],
    location: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { announce } = useAccessibility();

  // 定义发布流程步骤
  const steps = [
    {
      id: 'title',
      label: '商品标题',
      placeholder: '请输入商品标题（如：高等数学第七版教材）',
      type: 'text',
      required: true,
      voicePrompt: '请告诉我商品标题。',
    },
    {
      id: 'description',
      label: '商品描述',
      placeholder: '请简要描述商品（如：九成新，无笔记，适合大一学生使用）',
      type: 'textarea',
      required: true,
      voicePrompt: '请简要描述商品的成色和状态。',
    },
    {
      id: 'price',
      label: '商品价格',
      placeholder: '请输入价格（元）',
      type: 'number',
      required: true,
      voicePrompt: '请输入商品的价格，单位是元。',
    },
    {
      id: 'category',
      label: '商品分类',
      placeholder: '请选择商品分类',
      type: 'select',
      options: [
        { value: '', label: '请选择分类' },
        { value: '电子产品', label: '电子产品' },
        { value: '服装配饰', label: '服装配饰' },
        { value: '家具家电', label: '家具家电' },
        { value: '图书文具', label: '图书文具' },
        { value: '运动户外', label: '运动户外' },
        { value: '美妆护肤', label: '美妆护肤' },
        { value: '其他', label: '其他' },
      ],
      required: true,
      voicePrompt: '请选择商品分类，如电子产品、图书文具等。',
    },
    {
      id: 'condition',
      label: '商品成色',
      placeholder: '请选择商品成色',
      type: 'select',
      options: [
        { value: '全新', label: '全新' },
        { value: '九成新', label: '九成新' },
        { value: '八成新', label: '八成新' },
        { value: '七成新', label: '七成新' },
        { value: '其他', label: '其他' },
      ],
      required: true,
      voicePrompt: '请选择商品的成色，如全新、九成新等。',
    },
    {
      id: 'location',
      label: '商品位置',
      placeholder: '请选择商品位置',
      type: 'location',
      required: true,
      voicePrompt: '请选择商品的位置，方便买家查看。',
    },
    {
      id: 'images',
      label: '商品图片',
      placeholder: '请上传商品图片',
      type: 'images',
      required: false,
      voicePrompt: '请上传商品图片，多张图片可以更好地展示商品。',
    },
    {
      id: 'review',
      label: '确认信息',
      type: 'review',
      voicePrompt: '请确认商品信息是否正确。',
    },
  ];

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理位置选择
  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  // 处理图片上传
  const handleImageUpload = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  // 处理语音输入
  const handleVoiceInput = (text) => {
    if (!text || currentStep >= steps.length) return;
    
    const currentField = steps[currentStep].id;
    setFormData(prev => ({
      ...prev,
      [currentField]: text,
    }));
    
    announce(`已识别: ${text}`);
  };

  // 下一步
  const handleNext = () => {
    const currentField = steps[currentStep];
    
    // 验证当前步骤
    if (currentField.required && !formData[currentField.id]) {
      announce(`请填写${currentField.label}`, 'assertive');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      announce(`现在请填写${steps[currentStep + 1].label}`);
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      announce(`现在请填写${steps[currentStep - 1].label}`);
    }
  };

  // 提交商品
  const handleSubmit = async () => {
    setIsSubmitting(true);
    announce('正在发布商品，请稍候...', 'assertive');
    
    try {
      // 模拟提交延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 构建商品数据
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: 'current_seller',
        createdAt: new Date().toISOString(),
      };
      
      // 调用父组件提供的回调函数
      if (onItemPublished) {
        await onItemPublished(itemData);
      }
      
      announce('商品发布成功！', 'assertive');
    } catch (error) {
      console.error('发布失败:', error);
      announce('发布失败，请重试', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染当前步骤的表单字段
  const renderCurrentStep = () => {
    const step = steps[currentStep];
    if (!step) return null;
    
    switch (step.type) {
      case 'text':
      case 'number':
        return (
          <div className="step-field">
            <label 
              htmlFor={`step-${step.id}`} 
              className="block text-sm font-medium text-white mb-2"
              aria-required={step.required}
            >
              {step.label} {step.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`step-${step.id}`}
              type={step.type}
              name={step.id}
              value={formData[step.id] || ''}
              onChange={handleInputChange}
              placeholder={step.placeholder}
              required={step.required}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all min-h-[48px]"
              aria-label={step.label}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="step-field">
            <label 
              htmlFor={`step-${step.id}`} 
              className="block text-sm font-medium text-white mb-2"
              aria-required={step.required}
            >
              {step.label} {step.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={`step-${step.id}`}
              name={step.id}
              value={formData[step.id] || ''}
              onChange={handleInputChange}
              placeholder={step.placeholder}
              required={step.required}
              rows={4}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all resize-vertical min-h-[120px]"
              aria-label={step.label}
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="step-field">
            <label 
              htmlFor={`step-${step.id}`} 
              className="block text-sm font-medium text-white mb-2"
              aria-required={step.required}
            >
              {step.label} {step.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={`step-${step.id}`}
              name={step.id}
              value={formData[step.id] || ''}
              onChange={handleInputChange}
              required={step.required}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-transparent transition-all cursor-pointer min-h-[48px]"
              aria-label={step.label}
            >
              {step.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        );
      
      case 'location':
        return (
          <div className="step-field">
            <label className="block text-sm font-medium text-white mb-2" aria-required={step.required}>
              {step.label} {step.required && <span className="text-red-500">*</span>}
            </label>
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <p className="text-sm text-[#999] mb-3">{formData.location ? `已选择：${formData.location.address}` : '请选择商品位置'}</p>
              <button 
                type="button" 
                onClick={() => handleLocationSelect({ address: '默认位置', latitude: 31.2304, longitude: 121.4737 })}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all"
              >
                选择位置
              </button>
            </div>
          </div>
        );
      
      case 'images':
        return (
          <div className="step-field">
            <label className="block text-sm font-medium text-white mb-2">
              {step.label}
            </label>
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              {formData.images.length > 0 ? (
                <div className="mb-3">
                  <p className="text-sm text-white mb-2">已上传 {formData.images.length} 张图片</p>
                </div>
              ) : (
                <p className="text-sm text-[#999] mb-3">还未上传图片</p>
              )}
              <button 
                type="button" 
                onClick={() => handleImageUpload(['mock-image.jpg'])}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all"
              >
                上传图片
              </button>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="step-field">
            <h3 className="text-lg font-medium text-white mb-4">商品信息确认</h3>
            <div className="space-y-3">
              {steps.filter(step => step.type !== 'review').map(step => {
                const value = formData[step.id];
                if (!value) return null;
                
                return (
                  <div key={step.id} className="flex justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <span className="text-sm text-[#999]">{step.label}:</span>
                    <span className="text-sm text-white">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // 提交商品
  const handleSubmitItem = async () => {
    setIsSubmitting(true);
    announce('正在发布商品，请稍候...', 'assertive');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onItemPublished) {
        await onItemPublished({
          ...formData,
          price: parseFloat(formData.price),
          sellerId: 'current_seller',
          createdAt: new Date().toISOString(),
        });
      }
      
      announce('商品发布成功！', 'assertive');
    } catch (error) {
      console.error('发布失败:', error);
      announce('发布失败，请重试', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染进度指示器
  const renderProgressIndicator = () => {
    return (
      <div className="progress-indicator mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-white">发布商品 - 步骤 {currentStep + 1}/{steps.length}</h3>
          <span className="text-sm text-[#999]">{steps[currentStep]?.label}</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-2.5">
          <div 
            className="bg-white h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-label={`发布进度：${Math.round(((currentStep + 1) / steps.length) * 100)}%`}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`conversational-publisher ${className}`} role="region" aria-labelledby="publisher-title">
      <h2 id="publisher-title" className="text-2xl font-bold mb-4 text-white">
        对话式商品发布
      </h2>
      
      {/* 进度指示器 */}
      {renderProgressIndicator()}
      
      {/* 语音模式切换 */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setIsVoiceMode(!isVoiceMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
            isVoiceMode ? 'bg-white text-black' : 'bg-[#1a1a1a] text-[#999] hover:text-white'
          }`}
          aria-pressed={isVoiceMode}
          aria-label={isVoiceMode ? "关闭语音模式" : "开启语音模式"}
        >
          {isVoiceMode ? '关闭语音模式' : '开启语音模式'}
        </button>
      </div>
      
      {/* 语音接口 */}
      {isVoiceMode && (
        <VoiceInterface
          onTextReceived={handleVoiceInput}
          initialMessage={steps[currentStep]?.voicePrompt || "请开始说话..."}
          className="mb-6"
        />
      )}
      
      {/* 当前步骤内容 */}
      <div className="current-step mb-8">
        {renderCurrentStep()}
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-between gap-4">
        {/* 取消按钮 */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E60023]"
        >
          取消
        </button>
        
        {/* 上一步按钮 */}
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E60023]"
          >
            上一步
          </button>
        )}
        
        {/* 下一步/提交按钮 */}
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || (!steps[currentStep].required && !formData[steps[currentStep].id])}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E60023] ${
            isSubmitting || (!steps[currentStep].required && !formData[steps[currentStep].id]) 
              ? 'bg-[#3a3a3a] text-[#666] cursor-not-allowed' 
              : 'bg-white text-black hover:bg-[#e0e0e0]'
          }`}
          >
            下一步 <ArrowRightIcon className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitItem}
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E60023] ${
            isSubmitting 
              ? 'bg-[#3a3a3a] text-[#666] cursor-not-allowed' 
              : 'bg-[#E60023] text-white hover:bg-[#c4001e] shadow-lg shadow-[#E60023]/20'
          }`}
          >
            {isSubmitting ? '发布中...' : '确认发布'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationalItemPublisher;
