import React from 'react';
import styles from './styles.module.css';

export default function ShareButtons({ title, url }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';

  const handleShare = (platform) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'weibo':
        shareLink = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('链接已复制到剪贴板！');
    });
  };

  return (
    <div className={styles.shareButtons}>
      <div className={styles.shareHeader}>
        <span className="material-symbols-outlined">share</span>
        <span className={styles.shareTitle}>分享文章 / Share</span>
      </div>
      <div className={styles.buttonGroup}>
        <button 
          className={styles.shareButton}
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <span className="material-symbols-outlined">tag</span>
          Twitter
        </button>
        <button 
          className={styles.shareButton}
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <span className="material-symbols-outlined">group</span>
          Facebook
        </button>
        <button 
          className={styles.shareButton}
          onClick={() => handleShare('linkedin')}
          aria-label="Share on LinkedIn"
        >
          <span className="material-symbols-outlined">work</span>
          LinkedIn
        </button>
        <button 
          className={styles.shareButton}
          onClick={() => handleShare('weibo')}
          aria-label="Share on Weibo"
        >
          <span className="material-symbols-outlined">chat</span>
          微博
        </button>
        <button 
          className={styles.shareButton}
          onClick={copyToClipboard}
          aria-label="Copy link"
        >
          <span className="material-symbols-outlined">link</span>
          复制链接
        </button>
      </div>
    </div>
  );
}
