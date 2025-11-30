import { useState } from 'react';
import { CloseIcon } from './Icons';

/**
 * 登录模态框组件
 * @param {boolean} isOpen - 是否打开
 * @param {Function} onClose - 关闭回调
 * @param {Function} onLogin - 登录成功回调
 */
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [loginType, setLoginType] = useState('phone'); // phone, qq, wechat
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [qq, setQq] = useState('');
  const [wechat, setWechat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      alert('请输入正确的手机号');
      return;
    }
    
    setIsLoading(true);
    // 模拟发送验证码
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      alert('验证码已发送，请查收');
    }, 1000);
  };

  // 处理登录
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let userInfo = {};
      
      if (loginType === 'phone') {
        if (!phone || !code) {
          alert('请填写手机号和验证码');
          setIsLoading(false);
          return;
        }
        // 模拟手机号登录
        userInfo = {
          type: 'phone',
          phone: phone,
          name: `用户${phone.slice(-4)}`,
        };
      } else if (loginType === 'qq') {
        if (!qq) {
          alert('请输入QQ号');
          setIsLoading(false);
          return;
        }
        // 模拟QQ登录
        userInfo = {
          type: 'qq',
          qq: qq,
          name: `QQ用户${qq}`,
        };
      } else if (loginType === 'wechat') {
        if (!wechat) {
          alert('请使用微信扫码登录');
          setIsLoading(false);
          return;
        }
        // 模拟微信登录
        userInfo = {
          type: 'wechat',
          wechat: wechat,
          name: `微信用户`,
        };
      }

      // 保存登录信息到 localStorage
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      localStorage.setItem('is_logged_in', 'true');

      setTimeout(() => {
        setIsLoading(false);
        alert(`登录成功！欢迎 ${userInfo.name}`);
        onLogin?.(userInfo);
        onClose();
        // 重置表单
        setPhone('');
        setCode('');
        setQq('');
        setWechat('');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert('登录失败，请重试');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-xl p-6 max-w-md w-full animate-slide-in">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">登录</h2>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 登录方式切换 */}
        <div className="flex gap-2 mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
          <button
            onClick={() => setLoginType('phone')}
            className={`flex-1 px-4 py-2 text-sm rounded transition-all font-medium ${
              loginType === 'phone'
                ? 'bg-white text-black'
                : 'text-[#a0a0a0] hover:text-white'
            }`}
          >
            手机号
          </button>
          <button
            onClick={() => setLoginType('qq')}
            className={`flex-1 px-4 py-2 text-sm rounded transition-all font-medium ${
              loginType === 'qq'
                ? 'bg-white text-black'
                : 'text-[#a0a0a0] hover:text-white'
            }`}
          >
            QQ
          </button>
          <button
            onClick={() => setLoginType('wechat')}
            className={`flex-1 px-4 py-2 text-sm rounded transition-all font-medium ${
              loginType === 'wechat'
                ? 'bg-white text-black'
                : 'text-[#a0a0a0] hover:text-white'
            }`}
          >
            微信
          </button>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin}>
          {/* 手机号登录 */}
          {loginType === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
                  maxLength={11}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading || countdown > 0 || !phone || phone.length !== 11}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-[#e0e0e0] disabled:bg-[#1a1a1a] disabled:text-[#666] disabled:cursor-not-allowed transition-all btn-hover-effect font-medium whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QQ登录 */}
          {loginType === 'qq' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  QQ号
                </label>
                <input
                  type="text"
                  value={qq}
                  onChange={(e) => setQq(e.target.value.replace(/\D/g, ''))}
                  placeholder="请输入QQ号"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#E60023]/30 text-white rounded-lg focus:ring-2 focus:ring-[#E60023] focus:border-[#E60023] placeholder-[#666] transition-all"
                />
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <p className="text-sm text-[#a0a0a0]">
                  点击登录后将跳转到QQ授权页面
                </p>
              </div>
            </div>
          )}

          {/* 微信登录 */}
          {loginType === 'wechat' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm text-[#a0a0a0] text-center">
                  请使用微信扫描二维码登录
                </p>
                <p className="text-xs text-[#666] text-center mt-2">
                  二维码有效期：5分钟
                </p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <p className="text-sm text-[#a0a0a0]">
                  模拟登录：点击登录按钮即可完成微信登录
                </p>
              </div>
              <input
                type="hidden"
                value={wechat}
                onChange={(e) => setWechat('wechat_user')}
              />
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-3 bg-white text-black rounded-lg hover:bg-[#e0e0e0] disabled:bg-[#1a1a1a] disabled:text-[#666] transition-all btn-hover-effect font-medium"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 底部说明 */}
        <p className="text-xs text-[#666] text-center mt-4">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

