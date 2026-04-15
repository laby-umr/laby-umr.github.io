import React from 'react';
import Navbar from '@theme-original/Navbar';
import styles from './styles.module.css';

export default function NavbarWrapper(props) {
  return (
    <div className={styles.navbarWrapper}>
      <Navbar {...props} />
    </div>
  );
}
