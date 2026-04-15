import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './NavBar.module.css';

export default function NavBar(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();

  const navItems = [
    { label: 'Home', to: '/', active: false },
    { label: 'Blog', to: '/blog', active: true },
    { label: 'Projects', to: '/projects', active: false },
    { label: 'Music', to: '/music', active: false },
    { label: 'About', to: '/about', active: false },
    { label: 'Contact', to: '/contact', active: false },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}></span>
          <span className={styles.logoText}>DevManga</span>
        </Link>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${styles.navLink} ${item.active ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.navActions}>
          <button
            className={styles.themeToggle}
            onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined">
              {colorMode === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <div className={styles.avatar}>
            <img
              src="/img/logo.jpg"
              alt="Avatar"
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
