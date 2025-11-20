import React, { useState } from 'react';
import { subscribeApi } from '../../utils/blogApi';
import styles from './styles.module.css';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await subscribeApi.create({ email, nickname });
      setSuccess(true);
      setEmail('');
      setNickname('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || '订阅失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.subscribeBox}>
        <div className={styles.successMessage}>
          <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>订阅成功！</h3>
          <p>请查收激活邮件以完成订阅</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.subscribeBox}>
      <h3 className={styles.title}>📧 订阅更新</h3>
      <p className={styles.description}>
        订阅以获取最新文章和技术分享
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="昵称（可选）"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.input}
          disabled={submitting}
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={submitting}
        />
        
        {error && (
          <div className={styles.error}>{error}</div>
        )}
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={submitting}
        >
          {submitting ? '订阅中...' : '订阅'}
        </button>
      </form>
    </div>
  );
}
