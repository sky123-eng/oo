/**
 * 图片处理工具函数
 */

/**
 * 将文件转换为 base64 字符串
 * @param {File} file - 图片文件
 * @returns {Promise<string>} base64 字符串
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * 批量将文件转换为 base64
 * @param {File[]} files - 文件数组
 * @returns {Promise<string[]>} base64 字符串数组
 */
export const filesToBase64 = async (files) => {
  const promises = Array.from(files).map(fileToBase64);
  return Promise.all(promises);
};

/**
 * 预留：上传图片到后端服务器
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 服务器返回的图片 URL
 */
export const uploadImageToServer = async (file) => {
  // TODO: 实现后端图片上传逻辑
  // const formData = new FormData();
  // formData.append('image', file);
  // const response = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData,
  // });
  // const data = await response.json();
  // return data.url;
  
  // 临时返回 base64（实际项目中应替换为服务器 URL）
  return fileToBase64(file);
};

