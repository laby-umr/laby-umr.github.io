import React, { useState, useEffect } from 'react';
import { Bubble, Sender, Prompts } from '@ant-design/x';
import { RobotOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * AI 博客助手组件
 * 提供智能问答、文章推荐、技术咨询等功能
 */
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isDark, setIsDark] = useState(false);

  // 检测暗色主题
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      setIsDark(htmlElement.getAttribute('data-theme') === 'dark');
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // 使用 useXChat Hook 管理对话
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: translate({
        id: 'aiAssistant.welcome',
        message: '👋 你好！我是 Laby 的技术助手\n\n我可以帮你快速找到需要的技术内容，试试下面的问题吧！'
      })
    }
  ]);

  // 配置角色样式
  const roles = {
    ai: {
      placement: 'start',
      avatar: { icon: <RobotOutlined />, style: { background: '#667eea' } },
      typing: { step: 5, interval: 20 },
    },
    user: {
      placement: 'end', 
      avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
    },
  };

  // 预设提示词
  const promptItems = [
    {
      key: '1',
      icon: '🔧',
      label: 'Spring Cloud 微服务',
      description: '了解微服务架构设计'
    },
    {
      key: '2',
      icon: '📝',
      label: 'Java 面试准备',
      description: '查看高频面试题'
    },
    {
      key: '3',
      icon: '🏗️',
      label: '系统设计案例',
      description: 'WMS/CRM/ERP 设计'
    },
    {
      key: '4',
      icon: '💻',
      label: '前端开发指南',
      description: 'React/Vue 技术栈'
    }
  ];

  // 处理发送消息
  const handleSend = async (value) => {
    if (!value.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: value
    };
    setMessages(prev => [...prev, userMessage]);
    setContent('');

    // 模拟 AI 回复（实际应该调用后端 API）
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(value)
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // 生成 AI 回复（临时模拟，实际应该调用 AI API）
  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('spring') || lowerQuestion.includes('微服务')) {
      return '🔧 **Spring Cloud 微服务架构**\n\n为你整理了以下学习资源：\n\n**核心组件**\n• 服务注册发现 - Eureka/Nacos\n• 配置中心 - Config Server\n• API 网关 - Gateway\n• 负载均衡 - LoadBalancer\n\n**推荐阅读**\n📖 [微服务架构文档](/docs/backend/microservices)\n🎯 [WMS 系统设计](/docs/projectDesign/wms-system-design)\n\n💡 想深入了解哪个组件？';
    }
    
    if (lowerQuestion.includes('面试') || lowerQuestion.includes('interview')) {
      return '📝 **Java 面试题库**\n\n**基础知识**\n• [Java 基础](/docs/interview/java-基础)\n• [并发编程](/docs/interview/java-并发)\n• [JVM 原理](/docs/interview/java-虚拟机)\n\n**框架技术**\n• [Spring 框架](/docs/interview/java-spring)\n\n**数据库**\n• [MySQL](/docs/interview/mysql-interview)\n• [Redis](/docs/interview/Redis-interview)\n\n🎯 选择一个方向开始准备吧！';
    }
    
    if (lowerQuestion.includes('系统设计') || lowerQuestion.includes('design')) {
      return '🏗️ **系统设计方案**\n\n**企业级系统**\n• [WMS 仓库管理](/docs/projectDesign/wms-system-design)\n• [CRM 客户管理](/docs/projectDesign/crm-system-design)\n• [ERP 资源规划](/docs/projectDesign/erp-system-design)\n• [OMS 订单管理](/docs/projectDesign/oms-system-design)\n\n**创新技术**\n• [数字孪生系统](/docs/projectDesign/digital-twin-system-design)\n\n✨ 每个方案都有完整的架构图和代码';
    }
    
    return `💭 收到你的问题了！\n\n"${question}"\n\n我可以帮你：\n• 🔍 搜索技术文档\n• 📚 推荐学习资源\n• 💡 解答技术问题\n• 🎯 系统设计建议\n\n试试点击下方的快捷问题，或者换个方式提问吧！`;
  };

  // 处理提示词点击
  const handlePromptClick = (info) => {
    handleSend(info.data.label);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label={translate({ id: 'aiAssistant.openButton', message: '打开 AI 助手' })}
        >
          <RobotOutlined className={styles.icon} />
          <span className={styles.badge}>AI</span>
        </button>
      )}

      {/* AI 助手面板 */}
      {isOpen && (
        <div className={styles.assistantPanel}>
          {/* 头部 */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIconWrapper}>
                <RobotOutlined className={styles.headerIcon} />
              </div>
              <div className={styles.headerText}>
                <h3>
                  <Translate id="aiAssistant.title">AI 助手</Translate>
                </h3>
                <span className={styles.status}>
                  <span className={styles.statusDot}></span>
                  <Translate id="aiAssistant.online">在线</Translate>
                </span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label={translate({ id: 'aiAssistant.closeButton', message: '关闭' })}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* 消息列表 */}
          <div className={styles.messagesContainer}>
            {messages.length > 0 && (
              <Bubble.List
                roles={roles}
                items={messages.map(msg => ({
                  key: msg.id,
                  role: msg.role,
                  content: msg.content
                }))}
              />
            )}
            
            {/* 快捷问题 - 使用 Prompts 组件 */}
            {messages.length === 1 && (
              <div className={styles.promptsWrapper}>
                <Prompts
                  title={translate({ id: 'aiAssistant.quickQuestions', message: '💡 快速开始' })}
                  items={promptItems}
                  onItemClick={handlePromptClick}
                  styles={{
                    list: { marginTop: 16 },
                    item: { 
                      marginBottom: 8,
                      borderRadius: 12,
                      transition: 'all 0.2s ease'
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* 输入框 */}
          <div className={styles.senderWrapper}>
            <Sender
              value={content}
              onChange={setContent}
              onSubmit={handleSend}
              placeholder={translate({
                id: 'aiAssistant.inputPlaceholder',
                message: '输入你的问题...'
              })}
              loading={false}
            />
          </div>
        </div>
      )}
    </ConfigProvider>
  );
}
