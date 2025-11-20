import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import styles from './contact.module.css';
import Translate, { translate } from '@docusaurus/Translate';
import { messageApi, subscribeApi, useVisitorTracking } from '../utils/blogApi';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  // 高德地图配置 - 移到组件内部以支持国际化
  const AMAP_KEY = '6e9539695c1da24f1790c7e16ac810ec';
  const LOCATION = {
    lng: 116.326204,
    lat: 40.076827,
    name: translate({id: 'contact.studioName', message: 'Laby Studio'}),
    address: translate({id: 'contact.location.address', message: 'Longqi Shopping Center, Huilongguan Street, Changping District, Beijing'})
  };

  // 访客追踪
  useEffect(() => {
    const cleanup = useVisitorTracking();
    return cleanup;
  }, []);

  // 加载高德地图（只初始化一次）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 如果地图已存在，不重新创建
    if (mapInstanceRef.current) return;

    // 延迟初始化，确保DOM已准备好
    const initTimeout = setTimeout(() => {
      // 检查是否已经加载
      if (window.AMap) {
        initMap();
        return;
      }

      // 动态加载高德地图脚本
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      // 清理地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []); // 只在组件挂载时初始化一次

  // 语言切换时更新信息窗体内容
  useEffect(() => {
    if (infoWindowRef.current && mapInstanceRef.current && markerRef.current) {
      // 更新信息窗体内容
      infoWindowRef.current.setContent(`
        <div style="padding: 15px; min-width: 200px;">
          <h4 style="margin: 0 0 10px 0; color: #667eea; font-size: 16px; font-weight: 600;">${LOCATION.name}</h4>
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">${LOCATION.address}</p>
        </div>
      `);
      
      // 更新标记标题
      markerRef.current.setTitle(LOCATION.name);
      
      // 如果信息窗体是打开的，重新打开以显示新内容
      if (infoWindowRef.current.getIsOpen()) {
        infoWindowRef.current.close();
        setTimeout(() => {
          infoWindowRef.current.open(mapInstanceRef.current, markerRef.current.getPosition());
        }, 100);
      }
    }
  }, [LOCATION.name, LOCATION.address]); // 语言切换时更新内容

  const initMap = () => {
    if (!mapRef.current || !window.AMap) return;

    // 创建地图实例
    const map = new window.AMap.Map(mapRef.current, {
      zoom: 15,
      center: [LOCATION.lng, LOCATION.lat],
      viewMode: '3D',
      pitch: 50,
      mapStyle: 'amap://styles/dark', // 暗色主题
    });

    // 创建自定义动态标注 HTML
    const markerContent = `
      <div style="position: relative; width: 60px; height: 60px;">
        <!-- 外圈动画 -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        
        <!-- 中圈 -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- 位置图标 -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <style>
        @keyframes ping {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8);
          }
          75%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      </style>
    `;

    // 添加自定义标记点
    const marker = new window.AMap.Marker({
      position: [LOCATION.lng, LOCATION.lat],
      content: markerContent,
      offset: new window.AMap.Pixel(-30, -30), // 标注中心点偏移
      title: LOCATION.name,
    });

    map.add(marker);
    markerRef.current = marker; // 保存引用

    // 添加信息窗体
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div style="padding: 15px; min-width: 200px;">
          <h4 style="margin: 0 0 10px 0; color: #667eea; font-size: 16px; font-weight: 600;">${LOCATION.name}</h4>
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">${LOCATION.address}</p>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -50)
    });

    infoWindowRef.current = infoWindow; // 保存引用

    // 点击标记显示信息
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });

    // 地图加载完成后的处理
    map.on('complete', () => {
      // 强制刷新地图，确保正确渲染
      setTimeout(() => {
        map.setCenter([LOCATION.lng, LOCATION.lat]);
        map.setZoom(15);
        // 显示信息窗体
        infoWindow.open(map, marker.getPosition());
      }, 300);
    });

    // 默认显示信息窗体（备用）
    setTimeout(() => {
      if (!infoWindow.getIsOpen()) {
        infoWindow.open(map, marker.getPosition());
      }
    }, 800);

    mapInstanceRef.current = map;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // 调用后端API提交留言
      const messageId = await messageApi.create({
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        content: formState.message
      });
      
      console.log('留言提交成功，ID:', messageId);
      setSubmitted(true);
      showToast(translate({id: 'contact.message.successToast', message: '留言提交成功！我会尽快回复您'}), 'success');
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // 5秒后隐藏成功提示
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('留言提交失败:', err);
      const errorMsg = err.message || translate({id: 'contact.message.errorToast', message: '留言提交失败，请稍后重试'});
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `${styles.toast} ${styles[`toast${type.charAt(0).toUpperCase() + type.slice(1)}`]}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add(styles.toastShow);
    }, 10);

    setTimeout(() => {
      toast.classList.remove(styles.toastShow);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSubscribe = async () => {
    if (!subscribeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      const errorMsg = translate({id: 'contact.subscribe.invalidEmail', message: '请输入有效的邮箱地址'});
      setSubscribeError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setSubscribing(true);
    setSubscribeError(null);

    try {
      const subscribeId = await subscribeApi.create({ email: subscribeEmail });
      console.log('订阅成功，ID:', subscribeId);
      setSubscribeSuccess(true);
      showToast(translate({id: 'contact.subscribe.successToast', message: '订阅成功！感谢您的关注'}), 'success');
      
      // 3秒后重置状态
      setTimeout(() => {
        setSubscribeSuccess(false);
        setSubscribeEmail('');
      }, 3000);
    } catch (err) {
      console.error('订阅失败:', err);
      // 检查是否是邮箱已存在的错误
      let errorMsg;
      if (err.message && err.message.includes('该邮箱已订阅')) {
        errorMsg = translate({id: 'contact.subscribe.alreadyExists', message: '该邮箱已订阅，请勿重复订阅'});
      } else {
        errorMsg = err.message || translate({id: 'contact.subscribe.errorToast', message: '订阅失败，请稍后重试'});
      }
      setSubscribeError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubscribing(false);
    }
  };

  const contactMethods = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: translate({id: 'contact.email', message: '电子邮件'}),
      value: '1521170425@qq.com',
      action: translate({id: 'contact.sendEmail', message: '发送邮件'}),
      url: 'mailto:1521170425@qq.com'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: translate({id: 'contact.social', message: '社交媒体'}),
      value: 'VX: ljx_9308',
      action: translate({id: 'contact.followMe', message: '关注我'}),
      url: 'weixin://'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: translate({id: 'contact.phone', message: '电话'}),
      value: '+86 13261915710',
      action: translate({id: 'contact.action.call', message: '预约通话'}),
      url: 'tel:+86 13261915710'
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      ),
      url: 'https://github.com'
    },
    {
      name: 'Twitter',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
        </svg>
      ),
      url: 'https://twitter.com'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
        </svg>
      ),
      url: 'https://linkedin.com'
    }
  ];

  return (
    <Layout
      title={translate({ id: 'contact.title', message: '联系我' })}
      description={translate({ id: 'contact.description', message: '联系我，让我们一起讨论您的项目' })}
    >
      <div className={styles.contactPage}>
        {/* 装饰光晕 */}
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.heroContent}
            >
              <motion.div 
                className={styles.badgeWrapper}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className={styles.badge}>
                  <Translate id="contact.badge">与我联系</Translate>
                </div>
              </motion.div>
              <h1 className={styles.heroTitle}>
                <span className={styles.gradientText}>
                  <Translate id="contact.hero.title">让我们一起创造精彩</Translate>
                </span>
              </h1>
              <p className={styles.heroSubtitle}>
                <Translate id="contact.hero.description">
                  无论是项目合作、技术咨询还是简单的问候，我都很乐意听到您的声音
                </Translate>
              </p>

              {/* Social Links */}
              <div className={styles.socialLinks}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className={styles.contactMethods}>
          <div className="container">
            <div className={styles.methodsGrid}>
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  className={styles.methodCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(102, 126, 234, 0.25)"
                  }}
                >
                  <div className={styles.cardContent}>
                    {/* 动态装饰背景 */}
                    <motion.div 
                      className={styles.decorativeBlob}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <div className={styles.contentWrapper}>
                      <motion.div 
                        className={styles.iconWrapper}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <div className={styles.methodIcon}>{method.icon}</div>
                        <span className={styles.iconLabel}>{method.title}</span>
                      </motion.div>
                      
                      <p className={styles.methodValue}>{method.value}</p>
                      
                      <motion.a 
                        href={method.url}
                        className={styles.methodButton}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={styles.buttonShine}></span>
                        <span className={styles.buttonText}>{method.action}</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Location */}
        <section className={styles.formSection}>
          <div className="container">
            <div className={styles.formGrid}>
              {/* Contact Form */}
              <motion.div
                className={styles.formCard}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(102, 126, 234, 0.15)"
                }}
              >
                {/* 装饰背景 */}
                <motion.div 
                  className={styles.formDecorativeBlob}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className={styles.formContent}>
                  <h2 className={styles.formTitle}>
                    <span className={styles.gradientText}>
                      <Translate id="contact.leaveMessage">给我留言</Translate>
                    </span>
                  </h2>

                {submitted ? (
                  <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3><Translate id="contact.success.title">消息已发送！</Translate></h3>
                    <p><Translate id="contact.success.message">感谢您的联系，我会尽快回复您。</Translate></p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label><Translate id="contact.form.name">姓名</Translate></label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder={translate({id: 'contact.form.namePlaceholder', message: '请输入您的姓名'})}
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label><Translate id="contact.form.email">电子邮箱</Translate></label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="your-email@example.com"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label><Translate id="contact.form.subject">主题</Translate></label>
                      <select
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      >
                        <option value="">
                          <Translate id="contact.form.selectSubject">请选择主题</Translate>
                        </option>
                        <option value="project">
                          <Translate id="contact.form.subject.project">项目合作</Translate>
                        </option>
                        <option value="job">
                          <Translate id="contact.form.subject.job">工作机会</Translate>
                        </option>
                        <option value="consulting">
                          <Translate id="contact.form.subject.consulting">技术咨询</Translate>
                        </option>
                        <option value="other">
                          <Translate id="contact.form.subject.other">其他</Translate>
                        </option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label><Translate id="contact.form.message">消息内容</Translate></label>
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder={translate({id: 'contact.form.messagePlaceholder', message: '请输入您的留言...'})}
                        rows={6}
                        required
                        disabled={submitting}
                      />
                    </div>

                    {error && (
                      <div className={styles.errorMessage} style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '6px',
                        color: '#c33',
                        fontSize: '14px'
                      }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Translate id="contact.sending">发送中...</Translate>
                      ) : (
                        <Translate id="contact.form.send">发送消息</Translate>
                      )}
                    </button>
                  </form>
                )}
                </div>
              </motion.div>

              {/* Location and Remote Work */}
              <div className={styles.sideContent}>
                {/* Location Card */}
                <motion.div
                  className={styles.locationCard}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className={styles.cardTitle}>
                    <span className={styles.gradientText}>
                      <Translate id="contact.workLocation">工作地点</Translate>
                    </span>
                  </h3>
                  <div className={styles.mapContainer}>
                    <div 
                      ref={mapRef}
                      className={styles.amapContainer}
                      style={{ 
                        width: '100%', 
                        height: '250px',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    />
                    <div className={styles.locationInfo}>
                      <h4><Translate id="contact.studioName">Laby工作室</Translate></h4>
                      <p><Translate id="contact.location.address">北京市昌平区回龙观街道龙旗购物中心</Translate></p>
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        <Translate id="contact.location.online">或随时随地在线与您联络</Translate>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Remote Work Card */}
                <motion.div
                  className={styles.remoteCard}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className={styles.cardTitle}>
                    <span className={styles.gradientText}><Translate id="contact.remoteWork">远程工作</Translate></span>
                  </h3>
                  <p className={styles.remoteText}>
                    <Translate id="contact.remoteWorkDesc">我主要通过远程方式工作，可以与全球各地的团队和项目协作，为您提供灵活的合作方式。</Translate>
                  </p>
                  <div className={styles.remoteBadges}>
                    <span className={styles.badge}><Translate id="contact.remoteWork.onlineMeeting">线上会议</Translate></span>
                    <span className={styles.badge}><Translate id="contact.remoteWork.flexibleTime">灵活时间</Translate></span>
                    <span className={styles.badge}><Translate id="contact.remoteWork.globalCollaboration">全球协作</Translate></span>
                    <span className={styles.badge}><Translate id="contact.remoteWork.realTimeCommunication">实时沟通</Translate></span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitleLarge}>
                <span className={styles.gradientText}>
                  <Translate id="contact.faq.title">常见问题</Translate>
                </span>
              </h2>
              <p className={styles.sectionDesc}>
                <Translate id="contact.faq.description">以下是客户经常询问的问题，如果您有其他疑问，随时联系我吧。</Translate>
              </p>
            </div>

            <div className={styles.faqGrid}>
              {[
                {
                  q: <Translate id="contact.faq.q1">如何联系您进行项目咨询？</Translate>,
                  a: <Translate id="contact.faq.a1">您可以通过上方的联系表单、电子邮件或社交媒体与我联系。我通常会在24小时内回复。</Translate>
                },
                {
                  q: <Translate id="contact.faq.q2">项目开发周期一般多久？</Translate>,
                  a: <Translate id="contact.faq.a2">项目周期取决于具体需求和复杂度，一般从2周到3个月不等。我会在初步沟通后给出详细的时间规划。</Translate>
                },
                {
                  q: <Translate id="contact.faq.q3">您提供哪些技术服务？</Translate>,
                  a: <Translate id="contact.faq.a3">我提供全栈开发、系统架构设计、技术咨询、代码审查等服务，涵盖Web应用、移动应用和智能系统开发。</Translate>
                },
                {
                  q: <Translate id="contact.faq.q4">合作流程是怎样的？</Translate>,
                  a: <Translate id="contact.faq.a4">首先进行需求沟通，然后提供方案和报价，确认后开始开发，过程中保持定期沟通，最后交付和售后支持。</Translate>
                },
                {
                  q: <Translate id="contact.faq.q5">是否提供项目后期维护？</Translate>,
                  a: <Translate id="contact.faq.a5">是的，我提供项目交付后的技术支持和维护服务，确保系统稳定运行。</Translate>
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <h4>{faq.q}</h4>
                    <motion.svg
                      className={styles.faqIcon}
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaqIndex === index ? 'auto' : 0,
                      opacity: openFaqIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={styles.faqAnswerWrapper}
                  >
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={styles.newsletterSection}>
          <div className="container">
            <motion.div
              className={styles.newsletterCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.newsletterContent}>
                <h2 className={styles.newsletterTitle}>
                  <span className={styles.gradientText}><Translate id="contact.subscribe.title">订阅我的动态</Translate></span>
                </h2>
                <p className={styles.newsletterText}>
                  <Translate id="contact.subscribe.description">定期接收我的最新文章、技术分享和项目更新，不会错过任何邮件。</Translate>
                </p>
              </div>
              <div className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder={translate({id: 'contact.subscribe.placeholder', message: '输入您的邮箱地址'})}
                  className={styles.newsletterInput}
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  disabled={subscribing || subscribeSuccess}
                />
                <button 
                  className={styles.newsletterButton}
                  onClick={handleSubscribe}
                  disabled={subscribing || subscribeSuccess || !subscribeEmail}
                >
                  {subscribing ? <Translate id="contact.subscribe.submitting">订阅中...</Translate> : 
                   subscribeSuccess ? <Translate id="contact.subscribe.success">已订阅</Translate> : 
                   <Translate id="contact.subscribe.button">订阅</Translate>}
                </button>
              </div>
              {subscribeError && (
                <p className={styles.errorText}>{subscribeError}</p>
              )}
              <p className={styles.privacyText}>
                <Translate id="contact.subscribe.privacy">我们遵循您的隐私，不会与第三方分享您的信息。</Translate>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
