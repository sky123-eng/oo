import React, { useState, useCallback } from 'react';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeXIcon } from './Icons';

/**
 * 语音接口组件 - 提供语音识别(STT)和语音合成(TTS)功能的预留接口
 * 符合WCAG 2.2 AA标准，支持无障碍访问
 */
const VoiceInterface = ({ 
  onTextReceived, 
  initialMessage = "你好！我可以帮你发布商品、搜索商品或下单。",
  isInitiatedByUser = false,
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(initialMessage);
  const [conversationHistory, setConversationHistory] = useState([]);

  // 模拟语音识别API（实际项目中应替换为真实的语音识别服务）
  const recognizeSpeech = useCallback(async () => {
    return new Promise((resolve) => {
      // 模拟识别延迟
      setTimeout(() => {
        // 模拟识别结果
        const mockResults = [
          "我要发布一本书",
          "搜索二手笔记本电脑",
          "我想购买这个商品",
          "我要发布一个九成新的手机",
          "附近有什么商品可以购买",
          "帮我找一下价格在1000元以下的手机"
        ];
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        resolve(randomResult);
      }, 1500);
    });
  }, []);

  // 模拟语音合成API（实际项目中应替换为真实的语音合成服务）
  const speakText = useCallback(async (text) => {
    return new Promise((resolve) => {
      // 模拟语音合成延迟
      setTimeout(() => {
        console.log(`模拟播放语音: ${text}`);
        resolve();
      }, text.length * 50); // 模拟每个字符需要50ms的朗读时间
    });
  }, []);

  // 开始语音输入
  const handleStartListening = useCallback(() => {
    setIsListening(true);
    
    // 调用语音识别API
    recognizeSpeech().then(result => {
      setIsListening(false);
      if (result && onTextReceived) {
        setCurrentMessage(`你说: ${result}`);
        onTextReceived(result);
        
        // 添加到对话历史
        setConversationHistory(prev => [...prev, { type: 'user', text: result }]);
        
        // 模拟回复
        setTimeout(() => {
          const mockReplies = [
            "好的，我现在帮你处理这个请求。",
            "我已经记录了你的需求，正在为你查找相关信息。",
            "明白了，我会按照你的要求来操作。",
            "这个请求已经收到，我会尽快为你完成。"
          ];
          const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
          setCurrentMessage(`系统: ${randomReply}`);
          setConversationHistory(prev => [...prev, { type: 'system', text: randomReply }]);
          
          // 如果没有静音，自动播放回复
          if (!isMuted) {
            handleSpeak(randomReply);
          }
        }, 1000);
      }
    }).catch(error => {
      setIsListening(false);
      console.error('语音识别失败:', error);
      setCurrentMessage('系统: 语音识别失败，请重试。');
    });
  }, [recognizeSpeech, onTextReceived, isMuted]);

  // 停止语音输入
  const handleStopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  // 播放语音
  const handleSpeak = useCallback((text) => {
    setIsSpeaking(true);
    
    // 调用语音合成API
    speakText(text).then(() => {
      setIsSpeaking(false);
    }).catch(error => {
      setIsSpeaking(false);
      console.error('语音合成失败:', error);
    });
  }, [speakText]);

  // 切换静音状态
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    
    // 如果当前正在播放，停止播放
    if (isSpeaking) {
      setIsSpeaking(false);
    }
  }, [isMuted, isSpeaking]);

  // 重置对话
  const resetConversation = useCallback(() => {
    setCurrentMessage(initialMessage);
    setConversationHistory([]);
    setIsListening(false);
    setIsSpeaking(false);
  }, [initialMessage]);

  return (
    <div className={`voice-interface p-6 bg-[#0a0a0a] rounded-lg border border-[#E60023]/30 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6">语音助手</h2>
      
      {/* 当前消息显示区域 */}
      <div className="current-message mb-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#E60023]/30">
        <p className="text-white">{currentMessage}</p>
      </div>
      
      {/* 对话历史（预留接口，当前未实现完整显示） */}
      {conversationHistory.length > 0 && (
        <div className="conversation-history mb-6 max-h-40 overflow-y-auto p-3 bg-[#1a1a1a] rounded-lg">
          {conversationHistory.slice(-3).map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-green-400' : 'text-blue-400'}`}>
              <span className="font-medium">{msg.type === 'user' ? '你' : '系统'}:</span> {msg.text}
            </div>
          ))}
        </div>
      )}
      
      {/* 控制按钮区域 */}
      <div className="voice-controls flex flex-wrap gap-3 justify-center">
        {/* 语音输入按钮 */}
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isSpeaking}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all min-h-[60px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
            isListening 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-[#E60023] text-white hover:bg-[#c4001e]'
          }`}
          aria-pressed={isListening}
          aria-label={isListening ? "停止语音输入" : "开始语音输入"}
          title={isListening ? "点击停止语音输入" : "点击开始语音输入"}
        >
          {isListening ? <MicOffIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
          <span className="hidden sm:inline">{isListening ? '停止' : '说话'}</span>
        </button>

        {/* 语音播放按钮 */}
        <button
          onClick={() => handleSpeak(currentMessage)}
          disabled={isListening || isSpeaking || isMuted}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all min-h-[60px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
            isSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'
          }`}
          aria-pressed={isSpeaking}
          aria-label="重复当前消息"
          title="点击重复当前消息"
        >
          {isSpeaking ? <VolumeXIcon className="w-6 h-6" /> : <Volume2Icon className="w-6 h-6" />}
          <span className="hidden sm:inline">{isSpeaking ? '播放中...' : '播放'}</span>
        </button>

        {/* 静音切换按钮 */}
        <button
          onClick={toggleMute}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all min-h-[60px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#3a3a3a] text-white hover:bg-[#4a4a4a] ${isMuted ? 'opacity-70' : ''}`}
          aria-pressed={isMuted}
          aria-label={isMuted ? "取消静音" : "静音"}
          title={isMuted ? "点击取消静音" : "点击静音"}
        >
          {isMuted ? <VolumeXIcon className="w-6 h-6" /> : <Volume2Icon className="w-6 h-6" />}
          <span className="hidden sm:inline">{isMuted ? '已静音' : '静音'}</span>
        </button>

        {/* 重置对话按钮 */}
        <button
          onClick={resetConversation}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]"
          aria-label="重置对话"
          title="点击重置对话"
        >
          <span>重置</span>
        </button>
      </div>

      {/* 辅助说明 */}
      <div className="voice-instructions mt-6 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
        <h4 className="text-sm font-medium text-white mb-1">使用说明:</h4>
        <ul className="text-xs text-[#999] space-y-1">
          <li>• 点击"说话"按钮开始语音输入</li>
          <li>• 可语音发布商品、搜索商品或下单</li>
          <li>• 支持的指令："我要发布..."、"搜索..."、"购买..."</li>
          <li>• 点击"播放"按钮重复当前消息</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceInterface;