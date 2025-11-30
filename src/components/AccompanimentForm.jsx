import { useState } from 'react';

/**
 * 价值陪伴记录表单组件
 * @param {Function} onSubmit - 提交回调
 * @param {Function} onCancel - 取消回调
 */
const AccompanimentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    duration: '',
    estimatedPoints: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 陪伴类型选项
  const accompanimentTypes = [
    { value: '聊天陪伴', label: '聊天陪伴', points: 10 },
    { value: '学习辅导', label: '学习辅导', points: 20 },
    { value: '生活帮助', label: '生活帮助', points: 15 },
    { value: '情感支持', label: '情感支持', points: 12 },
    { value: '技能分享', label: '技能分享', points: 25 },
    { value: '其他陪伴', label: '其他陪伴', points: 10 },
  ];

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // 根据类型自动计算预估价值点
      if (name === 'type') {
        const selectedType = accompanimentTypes.find(t => t.value === value);
        if (selectedType) {
          const duration = parseFloat(prev.duration) || 1;
          newData.estimatedPoints = Math.round(selectedType.points * duration);
        }
      } else if (name === 'duration') {
        const duration = parseFloat(value) || 1;
        const selectedType = accompanimentTypes.find(t => t.value === formData.type);
        if (selectedType) {
          newData.estimatedPoints = Math.round(selectedType.points * duration);
        }
      }
      
      return newData;
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.duration) {
      alert('请填写所有必填字段');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: formData.type,
        description: formData.description,
        duration: parseFloat(formData.duration),
        estimatedPoints: formData.estimatedPoints,
      });
      
      // 重置表单
      setFormData({
        type: '',
        description: '',
        duration: '',
        estimatedPoints: 0,
      });
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">
        记录价值陪伴
      </h2>
      <p className="text-sm text-[#a0a0a0] mb-6">
        通过提供陪伴服务，您可以获得价值点，用于兑换心仪的商品。
      </p>

      {/* 陪伴类型 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          陪伴类型 <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] transition-all"
        >
          <option value="">请选择陪伴类型</option>
          {accompanimentTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label} ({type.points}点/小时)
            </option>
          ))}
        </select>
      </div>

      {/* 时长 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          陪伴时长（小时） <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          min="0.5"
          step="0.5"
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
          placeholder="例如：2.5"
        />
      </div>

      {/* 描述 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          陪伴描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
          placeholder="请详细描述您提供的陪伴服务内容..."
        />
      </div>

      {/* 预估价值点 */}
      {formData.estimatedPoints > 0 && (
        <div className="mb-4 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <p className="text-sm text-[#a0a0a0] mb-1">预估可获得价值点</p>
          <p className="text-2xl font-bold text-white">
            {formData.estimatedPoints} 点
          </p>
          <p className="text-xs text-[#666] mt-1">
            * 实际价值点需审核后确定
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-white text-[#0a0a0a] rounded-lg hover:bg-[#f0f0f0] disabled:bg-[#1a1a1a] disabled:text-[#666] transition-all btn-hover-effect font-medium"
        >
          {isSubmitting ? '提交中...' : '提交记录'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#2a2a2a] transition-all btn-hover-effect font-medium"
        >
          取消
        </button>
      </div>
    </form>
  );
};

export default AccompanimentForm;

