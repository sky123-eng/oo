import { useState } from 'react';
import { SearchIcon, ClockIcon, MapPinIcon, UserIcon, HomeIcon } from './Icons';

const CompanionMatching = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    major: '',
    phone: '',
    activity: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const [isMatching, setIsMatching] = useState(false);
  const [matchedCompanion, setMatchedCompanion] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.name || !formData.studentId || !formData.activity || !formData.date || !formData.time || !formData.location) {
      alert('请填写必填信息（姓名、学号、活动内容、日期、时间、地点）');
      return;
    }

    // 模拟匹配过程
    setIsMatching(true);
    
    setTimeout(() => {
      // 模拟匹配结果
      setMatchedCompanion({
        name: Math.random() > 0.5 ? '李小明' : '张小华',
        studentId: `202${Math.floor(Math.random() * 100000)}`,
        major: Math.random() > 0.5 ? '计算机科学' : '环境工程',
        phone: `13800138${Math.floor(Math.random() * 10000)}`,
        activity: formData.activity,
        description: '我对这个活动很感兴趣，期待与你一起参与！'
      });
      setIsMatching(false);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      studentId: '',
      major: '',
      phone: '',
      activity: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
    setMatchedCompanion(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-all flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              返回首页
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="关闭"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <SearchIcon className="mr-2 h-6 w-6 text-[#E60023]" />
            随机匹配搭子
          </h2>
        </div>

        {!matchedCompanion ? (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 个人信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <UserIcon className="mr-2 h-5 w-5 text-[#E60023]" />
                    个人信息
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">姓名 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-1">学号 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="major" className="block text-sm font-medium text-gray-300 mb-1">专业</label>
                      <input
                        type="text"
                        id="major"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">手机号</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                      />
                    </div>
                  </div>
                </div>

                {/* 活动信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <SearchIcon className="mr-2 h-5 w-5 text-[#E60023]" />
                    活动信息
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="activity" className="block text-sm font-medium text-gray-300 mb-1">活动内容 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="activity"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                        required
                        placeholder="例如：图书馆学习、运动健身、自习"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">日期 <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">时间 <span className="text-red-500">*</span></label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">地点 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                        required
                        placeholder="例如：图书馆二楼、操场、自习室"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">详细描述</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                        placeholder="可以描述一下你的具体需求和期望..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  重置
                </button>
                
                <button
                  type="submit"
                  disabled={isMatching}
                  className={`px-8 py-3 bg-[#E60023] text-white rounded-lg hover:bg-[#c4001e] transition-all font-medium flex items-center justify-center ${isMatching ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isMatching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在匹配...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="mr-2 h-5 w-5" />
                      开始匹配
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-green-400">匹配成功！</h3>
              <p className="text-gray-300">恭喜你找到志同道合的搭子！</p>
            </div>

            <div className="mt-6 bg-gray-700/50 rounded-lg p-6 space-y-4">
              <h4 className="text-lg font-semibold text-white">匹配信息</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center text-gray-300">
                    <UserIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">姓名：</span>
                    {matchedCompanion.name}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <UserIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">学号：</span>
                    {matchedCompanion.studentId}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <UserIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">专业：</span>
                    {matchedCompanion.major}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <UserIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">手机号：</span>
                    {matchedCompanion.phone}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="flex items-center text-gray-300">
                    <SearchIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">活动：</span>
                    {matchedCompanion.activity}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <ClockIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">时间：</span>
                    {formData.date} {formData.time}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <MapPinIcon className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" />
                    <span className="font-medium text-white mr-2">地点：</span>
                    {formData.location}
                  </p>
                  <p className="flex items-center text-gray-300">
                    <svg className="mr-2 h-4 w-4 text-[#E60023] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-medium text-white mr-2">留言：</span>
                    {matchedCompanion.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-[#E60023] text-white rounded-lg hover:bg-[#c4001e] transition-colors font-medium"
              >
                重新匹配
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanionMatching;