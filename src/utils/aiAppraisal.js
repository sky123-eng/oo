/**
 * AI 鉴定工具函数
 * 模拟 AI 鉴定服务，实际项目中应调用真实的 AI 鉴定 API
 */

/**
 * 模拟 AI 鉴定商品
 * @param {Object} itemData - 商品数据
 * @param {Array} images - 商品图片（base64 数组）
 * @returns {Promise<Object>} 鉴定结果
 */
export const aiAppraiseItem = async (itemData, images = []) => {
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // TODO: 替换为实际 AI 鉴定 API 调用
  // const formData = new FormData();
  // images.forEach((img, index) => {
  //   formData.append(`image_${index}`, img);
  // });
  // formData.append('title', itemData.title);
  // formData.append('description', itemData.description);
  // formData.append('price', itemData.price);
  // 
  // const response = await fetch('/api/ai/appraise', {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.json();

  // 模拟 AI 鉴定结果
  const { title, description, price, condition, category } = itemData;

  // 基于商品信息生成模拟鉴定结果
  const authenticityScore = Math.floor(Math.random() * 20) + 80; // 80-100
  const conditionScore = condition === '全新' ? 95 : 
                        condition === '九成新' ? 85 :
                        condition === '八成新' ? 75 : 65;
  const priceReasonableness = price > 0 ? Math.min(100, Math.max(60, 100 - (price / 1000))) : 70;
  
  const overallScore = Math.round(
    (authenticityScore * 0.4) + 
    (conditionScore * 0.3) + 
    (priceReasonableness * 0.3)
  );

  // 生成鉴定报告
  const report = {
    itemId: itemData.id || Date.now().toString(),
    timestamp: new Date().toISOString(),
    overallScore, // 综合评分 0-100
    authenticity: {
      score: authenticityScore,
      verdict: authenticityScore >= 90 ? 'authentic' : authenticityScore >= 75 ? 'likely_authentic' : 'suspicious',
      confidence: authenticityScore >= 90 ? 'high' : authenticityScore >= 75 ? 'medium' : 'low',
      details: authenticityScore >= 90 
        ? '商品信息完整，描述与图片一致，无明显异常。'
        : authenticityScore >= 75
        ? '商品信息基本完整，建议进一步核实细节。'
        : '发现部分可疑信息，建议谨慎交易。',
    },
    condition: {
      score: conditionScore,
      assessment: condition || '未知',
      details: condition === '全新' 
        ? '商品状态良好，符合全新描述。'
        : condition === '九成新'
        ? '商品有轻微使用痕迹，符合九成新描述。'
        : '商品有明显使用痕迹，请仔细检查。',
    },
    price: {
      score: priceReasonableness,
      estimatedValue: {
        min: Math.round(price * 0.8),
        max: Math.round(price * 1.2),
        suggested: Math.round(price * 0.95),
      },
      reasonableness: priceReasonableness >= 80 ? 'reasonable' : priceReasonableness >= 60 ? 'moderate' : 'questionable',
      details: priceReasonableness >= 80
        ? '价格合理，符合市场行情。'
        : priceReasonableness >= 60
        ? '价格略偏离市场价，建议对比其他同类商品。'
        : '价格明显偏离市场价，请谨慎考虑。',
    },
    images: {
      count: images.length,
      quality: images.length >= 3 ? 'good' : images.length >= 1 ? 'fair' : 'poor',
      analysis: images.length >= 3
        ? '图片数量充足，能够清晰展示商品细节。'
        : images.length >= 1
        ? '建议补充更多角度的图片以便更好评估。'
        : '缺少商品图片，无法进行视觉评估。',
    },
    category: {
      name: category || '未分类',
      match: category ? 'matched' : 'unknown',
    },
    recommendations: generateRecommendations(overallScore, authenticityScore, conditionScore, priceReasonableness),
    aiModel: 'GPT-Vision-4.0', // 模拟 AI 模型名称
    processingTime: '2.3s', // 模拟处理时间
  };

  return report;
};

/**
 * 生成鉴定建议
 */
function generateRecommendations(overall, authenticity, condition, price) {
  const recommendations = [];

  if (authenticity < 80) {
    recommendations.push({
      type: 'warning',
      title: '真伪性存疑',
      content: '建议要求卖家提供更多证明文件，或选择平台担保交易。',
    });
  }

  if (condition < 70) {
    recommendations.push({
      type: 'info',
      title: '成色评估',
      content: '商品成色较低，建议仔细检查商品实际状态。',
    });
  }

  if (price < 70) {
    recommendations.push({
      type: 'warning',
      title: '价格提醒',
      content: '价格可能偏离市场价，建议对比其他同类商品后再决定。',
    });
  }

  if (overall >= 85) {
    recommendations.push({
      type: 'success',
      title: '综合评估良好',
      content: '该商品综合评估良好，可以放心交易。',
    });
  } else if (overall >= 70) {
    recommendations.push({
      type: 'info',
      title: '综合评估一般',
      content: '建议进一步核实商品信息，谨慎交易。',
    });
  } else {
    recommendations.push({
      type: 'warning',
      title: '综合评估较差',
      content: '该商品存在多项风险，建议谨慎考虑或选择其他商品。',
    });
  }

  return recommendations;
}

/**
 * 获取鉴定结果等级
 */
export const getAppraisalLevel = (score) => {
  if (score >= 90) return { level: 'excellent', label: '优秀', color: 'green' };
  if (score >= 80) return { level: 'good', label: '良好', color: 'blue' };
  if (score >= 70) return { level: 'fair', label: '一般', color: 'yellow' };
  if (score >= 60) return { level: 'poor', label: '较差', color: 'orange' };
  return { level: 'bad', label: '差', color: 'red' };
};

/**
 * 获取真伪性标签
 */
export const getAuthenticityLabel = (verdict) => {
  const labels = {
    authentic: { label: '正品', color: 'green' },
    likely_authentic: { label: '疑似正品', color: 'blue' },
    suspicious: { label: '存疑', color: 'orange' },
    fake: { label: '假货', color: 'red' },
  };
  return labels[verdict] || labels.suspicious;
};

