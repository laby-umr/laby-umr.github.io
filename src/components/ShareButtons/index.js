import React, { useState, useEffect } from 'react';
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        )}
        
        {/* 微信分享 */}
        <button 
          className={styles.shareButton}
          onClick={toggleQR}
          aria-label="Share on WeChat"
          title="微信扫码分享"
        >
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="currentColor" d="M690.1 377.4c5.9 0 11.8.2 17.6.5-24.4-128.7-158.3-227.1-319.9-227.1-180.2 0-326.1 123.4-326.1 275.5 0 89.1 50.4 170.7 127.9 217.9l-31.9 95.8 112.6-56.2c40.9 16.6 84.6 25.6 130.2 25.6 11.6 0 23.2-.5 34.6-1.4-7.2-24.3-11.4-49.9-11.4-76.3 0-139.1 119.1-251.7 266.4-254.3zM511.6 232.3c-25.3 0-50.7 16.6-50.7 41.8 0 25.1 25.4 41.8 50.7 41.8 25.4 0 50.7-16.7 50.7-41.8.1-25.2-25.3-41.8-50.7-41.8zm-203.6 84c-25.4 0-50.8 16.6-50.8 41.8 0 25.1 25.4 41.8 50.8 41.8 25.4 0 50.7-16.7 50.7-41.8 0-25.2-25.3-41.8-50.7-41.8zM832 585.2c0-127.8-123.4-231.6-275.6-231.6-154.1 0-275.6 103.8-275.6 231.6S402.3 816.8 556.4 816.8c32.3 0 64.6-8.4 96.9-16.7l88.7 47.3-24.3-79.6c65-41.1 114.3-97.5 114.3-182.6zm-370.8-41.9c-16.9 0-33.9 11.1-33.9 27.9 0 16.9 17 28 33.9 28 16.9 0 33.8-11.1 33.8-28 0-16.8-16.9-27.9-33.8-27.9zm185.4 0c-16.9 0-33.8 11.1-33.8 27.9 0 16.9 16.9 28 33.8 28 16.9 0 33.9-11.1 33.9-28 0-16.8-17-27.9-33.9-27.9z"/>
          </svg>
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
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="currentColor" d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"/>
          </svg>
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
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm168.6 384.2c-35.8 8.3-64.6 35.9-64.6 35.9l-31.5-35.9h-43.8v152.9h43.8V496.8s22.7-18.5 31.5-18.5c8.9 0 8.9 9.2 8.9 9.2v108.6h44.6V472.2c-0.1-41-27.5-32.1-27.5-32.1s39.4-34.1 94.1-34.1c54.7 0 59.2 66.2 59.2 66.2v108.6h44.6V466.8c0-80.8-83.8-87.5-115.3-18.6zm-295 0c-35.8 8.3-64.6 35.9-64.6 35.9l-31.5-35.9h-43.8v152.9h43.8V496.8s22.7-18.5 31.5-18.5c8.9 0 8.9 9.2 8.9 9.2v108.6h44.6V472.2c-0.1-41-27.5-32.1-27.5-32.1s39.4-34.1 94.1-34.1c54.7 0 59.2 66.2 59.2 66.2v108.6h44.6V466.8c0-80.8-83.8-87.5-115.3-18.6zM195.9 214.9h63.9c7.7 0 14 6.3 14 14v35.8h-91.9v-35.8c0-7.7 6.3-14 14-14zm0 544.2h63.9c7.7 0 14 6.3 14 14v35.8h-91.9v-35.8c0-7.7 6.3-14 14-14zm0-272.1h63.9c7.7 0 14 6.3 14 14v35.8h-91.9v-35.8c0-7.7 6.3-14 14-14z"/>
          </svg>
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
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="currentColor" d="M457.3 543c-68.1-17.7-145 16.2-174.6 76.2-30.1 61.2-1 129.1 67.8 151.3 71.2 23 155.2-12.2 184.4-78.3 28.7-64.6-7.2-131-77.6-149.2zm-52 156.2c-13.8 22.1-43.5 31.7-65.8 21.6-22-10-28.5-35.7-14.6-57.2 13.7-21.4 42.3-31 64.4-21.7 22.4 9.5 29.6 35 16 57.3zm45.5-58.5c-5 8.6-16.1 12.7-24.7 9.1-8.5-3.5-11.2-13.1-6.4-21.5 5-8.4 15.6-12.4 24.1-9.1 8.7 3.2 11.8 12.9 7 21.5zm334.5-197.2c15 4.8 31-3.4 35.9-18.3 11.8-36.6 4.4-78.4-23.2-109a111.39 111.39 0 00-106-34.3 28.45 28.45 0 00-21.9 33.8 28.39 28.39 0 0033.8 21.8c18.4-3.9 38.3 1.8 51.9 16.7a54.2 54.2 0 0111.3 53.3 28.45 28.45 0 0018.2 36zm99.8-206c-56.7-62.9-140.4-86.9-217.7-70.5a32.98 32.98 0 00-25.4 39.3 33.12 33.12 0 0039.3 25.5c55-11.7 114.4 5.4 154.8 50.1 40.3 44.7 51.2 105.7 34 159.1-5.6 17.4 3.9 36 21.3 41.7 17.4 5.6 36-3.9 41.6-21.2v-.1c24.1-75.4 8.9-161.1-47.9-223.9zM729 499c-12.2-3.6-20.5-6.1-14.1-22.1 13.8-34.7 15.2-64.7.3-86-28-40.1-104.8-37.9-192.8-1.1 0 0-27.6 12.1-20.6-9.8 13.5-43.5 11.5-79.9-9.6-101-47.7-47.8-174.6 1.8-283.5 110.6C127.3 471.1 80 557.5 80 632.2 80 775.1 263.2 862 442.5 862c235 0 391.3-136.5 391.3-245 0-65.5-55.2-102.6-104.8-118zM443 810.8c-143 14.1-266.5-50.5-275.8-144.5-9.3-93.9 99.2-181.5 242.2-195.6 143-14.2 266.5 50.5 275.8 144.4C694.4 709 586 796.6 443 810.8z"/>
          </svg>
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
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378zm-2.128 2.474-1.188-1.7-3.747-5.36h2.57l3.023 4.324 1.187 1.7 3.933 5.623h-2.57l-3.208-4.587z"/>
          </svg>
        </a>
        
        {/* 复制链接按钮 */}
        <button 
          className={clsx(styles.shareButton, copied && styles.copied)}
          onClick={copyLink}
          aria-label="Copy link"
          title={copied ? "已复制" : "复制链接"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M7.24 4.949a4.956 4.956 0 00-1.393 3.682v2.879a.75.75 0 001.5 0V8.63a3.456 3.456 0 01.971-2.564 3.456 3.456 0 012.564-.971h2.268l-1.183 1.183a.75.75 0 001.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06l1.183 1.183h-2.268a4.956 4.956 0 00-3.682 1.393zm11.893 5.778a.75.75 0 00-1.5 0v2.879a3.456 3.456 0 01-.97 2.564 3.456 3.456 0 01-2.565.97h-2.268l1.183-1.182a.75.75 0 10-1.06-1.06l-2.5 2.5a.75.75 0 000 1.06l2.5 2.5a.75.75 0 001.06-1.06l-1.183-1.183h2.268a4.956 4.956 0 003.682-1.393 4.956 4.956 0 001.393-3.682v-2.879z"/>
          </svg>
          {copied && <span className={styles.copiedText}>已复制</span>}
        </button>
      </div>
      
      {/* 微信分享二维码 */}
      {showQR && (
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrCodeOverlay} onClick={toggleQR}></div>
          <div className={styles.qrCodeContent}>
            <button className={styles.closeButton} onClick={toggleQR}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M18.364 6.364a1 1 0 00-1.414-1.414L12 10.586 7.05 5.636a1 1 0 10-1.414 1.414L10.586 12l-4.95 4.95a1 1 0 101.414 1.414L12 13.414l4.95 4.95a1 1 0 001.414-1.414L13.414 12l4.95-4.95z"/>
              </svg>
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