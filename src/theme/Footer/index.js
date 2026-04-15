import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function FooterWrapper() {
  const { footer } = useThemeConfig();

  if (!footer) {
    return null;
  }

  return (
    <footer className={styles.devmangaFooter}>
      <div className={styles.footerContainer}>
        {/* Left Section - Navigation */}
        <div className={styles.footerSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">explore</span>
            <h3 className={styles.sectionTitle}>
              <Translate id="footer.navigation.title">快速导航</Translate>
            </h3>
          </div>
          <ul className={styles.linkList}>
            <li><a href="/docs" className={styles.footerLink}>
              <Translate id="footer.navigation.docs">文档</Translate>
            </a></li>
            <li><a href="/blog" className={styles.footerLink}>
              <Translate id="footer.navigation.blog">博客</Translate>
            </a></li>
            <li><a href="/projects" className={styles.footerLink}>
              <Translate id="footer.navigation.projects">项目</Translate>
            </a></li>
            <li><a href="/music" className={styles.footerLink}>
              <Translate id="footer.navigation.music">音乐</Translate>
            </a></li>
            <li><a href="/about" className={styles.footerLink}>
              <Translate id="footer.navigation.about">关于我</Translate>
            </a></li>
            <li><a href="/contact" className={styles.footerLink}>
              <Translate id="footer.navigation.contact">联系我</Translate>
            </a></li>
          </ul>
        </div>

        {/* Middle Section - Contact */}
        <div className={styles.footerSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">mail</span>
            <h3 className={styles.sectionTitle}>
              <Translate id="footer.contact.title">联系方式</Translate>
            </h3>
          </div>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className="material-symbols-outlined">email</span>
              <span>1521170425@qq.com</span>
            </li>
            <li className={styles.contactItem}>
              <span className="material-symbols-outlined">phone</span>
              <span>13261915710</span>
            </li>
            <li className={styles.contactItem}>
              <a href="https://github.com/MasterLiu93" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <span className="material-symbols-outlined">code</span>
                <span>GitHub</span>
              </a>
            </li>
            <li className={styles.contactItem}>
              <span className="material-symbols-outlined">location_on</span>
              <span>
                <Translate id="footer.contact.location">中国</Translate>
              </span>
            </li>
          </ul>
        </div>

        {/* Right Section - QR Code */}
        <div className={styles.footerSection}>
          <div className={styles.sectionHeader}>
            <span className="material-symbols-outlined">qr_code_2</span>
            <h3 className={styles.sectionTitle}>
              <Translate id="footer.qrcode.title">关注我</Translate>
            </h3>
          </div>
          <div className={styles.qrCodeContainer}>
            <div className={styles.qrCodeCard}>
              <img 
                src="/img/user/WeChat.png" 
                alt="WeChat QR Code" 
                className={styles.qrCodeImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className={styles.qrCodePlaceholder} style={{ display: 'none' }}>
                <span className="material-symbols-outlined">qr_code_2</span>
              </div>
              <p className={styles.qrCodeLabel}>
                <Translate id="footer.qrcode.wechat">微信</Translate>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p className={styles.copyright}>
            {footer.copyright}
          </p>
          <div className={styles.footerBadges}>
            <span className={styles.badge}>
              <span className="material-symbols-outlined">favorite</span>
              <Translate id="footer.badge.madeWithLove">用心制作</Translate>
            </span>
            <span className={styles.badge}>
              <span className="material-symbols-outlined">bolt</span>
              <Translate id="footer.badge.poweredBy">Powered by Docusaurus</Translate>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
