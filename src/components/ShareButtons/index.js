import React, { useState, useEffect } from 'react';
import { ShareAltOutlined, WechatOutlined, QqOutlined, WeiboOutlined, TwitterOutlined, LinkOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function ShareButtons({ title, description }) {
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [shareData, setShareData] = useState({
    url: '',
    encodedUrl: '',
    encodedTitle: '',
    encodedDescription: ''
  });
  
  // 在客户端渲染时设置分享数据
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      // 检查是否支持Web Share API
      setCanNativeShare(!!navigator.share);
      
      // 直接使用当前页面的完整URL，包括协议、主机名和路径
      const currentUrl = window.location.href;
      
      // 编码分享内容
      const encodedUrl = encodeURIComponent(currentUrl);
      const encodedTitle = encodeURIComponent(title || document.title);
      const encodedDesc = encodeURIComponent(description || '');
      
      setShareData({
        url: currentUrl,
        encodedUrl,
        encodedTitle,
        encodedDescription: encodedDesc
      });
    }
  }, [location.pathname, title, description]);
  
  // 使用系统原生分享
  const handleNativeShare = async () => {
    if (ExecutionEnvironment.canUseDOM && navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: description || '',
          url: shareData.url
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    }
  };
  
  // 分享链接
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareData.encodedUrl}&text=${shareData.encodedTitle}`,
    weibo: `http://service.weibo.com/share/share.php?url=${shareData.encodedUrl}&title=${shareData.encodedTitle}&pic=&appkey=`,
    qq: `http://connect.qq.com/widget/shareqq/index.html?url=${shareData.encodedUrl}&title=${shareData.encodedTitle}&summary=${shareData.encodedDescription}`,
    qzone: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${shareData.encodedUrl}&title=${shareData.encodedTitle}&summary=${shareData.encodedDescription}`,
  };
  
  // 复制链接
  const copyLink = () => {
    if (ExecutionEnvironment.canUseDOM) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  // 生成微信分享二维码
  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${shareData.encodedUrl}`;
  };
  
  // 切换微信二维码显示
  const toggleQR = () => {
    setShowQR(!showQR);
  };

  // 如果在服务器端渲染，不显示分享按钮
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }
  
  return (
    <div className={styles.shareContainer}>
      <h4 className={styles.shareTitle}>
        {translate({
          id: 'theme.blog.share.title',
          message: '分享文章',
          description: 'Title for the share buttons'
        })}
      </h4>
      
      <div className={styles.shareButtons}>
        {/* 系统原生分享按钮 */}
        {canNativeShare && (
          <button 
            className={styles.shareButton}
            onClick={handleNativeShare}
            aria-label="Native Share"
            title="系统分享"
          >
            <ShareAltOutlined style={{ fontSize: '20px' }} />
          </button>
        )}
        
        {/* 微信分享 */}
        <button 
          className={styles.shareButton}
          onClick={toggleQR}
          aria-label="Share on WeChat"
          title="微信扫码分享"
        >
          <WechatOutlined style={{ fontSize: '20px' }} />
        </button>
        
        {/* QQ分享 */}
        <a 
          href={shareLinks.qq}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareButton}
          aria-label="Share on QQ"
          title="QQ好友"
        >
          <QqOutlined style={{ fontSize: '20px' }} />
        </a>
        
        {/* QQ空间分享 */}
        <a 
          href={shareLinks.qzone}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareButton}
          aria-label="Share on QZone"
          title="QQ空间"
        >
          <QqOutlined style={{ fontSize: '20px' }} />
        </a>
        
        {/* 微博分享 */}
        <a 
          href={shareLinks.weibo}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareButton}
          aria-label="Share on Weibo"
          title="微博"
        >
          <WeiboOutlined style={{ fontSize: '20px' }} />
        </a>
        
        {/* Twitter/X分享 */}
        <a 
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareButton}
          aria-label="Share on Twitter/X"
          title="Twitter/X"
        >
          <TwitterOutlined style={{ fontSize: '20px' }} />
        </a>
        
        {/* 复制链接按钮 */}
        <button 
          className={clsx(styles.shareButton, copied && styles.copied)}
          onClick={copyLink}
          aria-label="Copy link"
          title={copied ? "已复制" : "复制链接"}
        >
          {copied ? <CheckOutlined style={{ fontSize: '20px', color: '#52c41a' }} /> : <LinkOutlined style={{ fontSize: '20px' }} />}
          {copied && <span className={styles.copiedText}>已复制</span>}
        </button>
      </div>
      
      {/* 微信分享二维码 */}
      {showQR && (
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCodeOverlay} onClick={toggleQR}></div>
          <div className={styles.qrCodeContent}>
            <button className={styles.closeButton} onClick={toggleQR}>
              <CloseOutlined style={{ fontSize: '18px' }} />
            </button>
            <img 
              src={generateQRCode()} 
              alt="WeChat QR Code" 
              className={styles.qrCode} 
            />
            <p className={styles.qrCodeText}>
              {translate({
                id: 'theme.blog.share.wechat',
                message: '微信扫一扫分享',
                description: 'Text for WeChat QR code sharing'
              })}
            </p>
            <p className={styles.qrCodeSubText}>
              请使用微信扫描二维码，点击右上角"..."按钮分享到微信好友或朋友圈
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 