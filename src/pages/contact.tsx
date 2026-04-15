import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './contact.module.css';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <Layout
      title={translate({id: 'contact.title', message: '联系我'})}
      description={translate({id: 'contact.description', message: '发送乌鸦信使 - 联系方式'})}>
      <main className={styles.contactPage}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerBadge}>
            <Translate id="contact.header.badge">第四阶段：传输</Translate>
          </div>
          
          <h1 className={styles.title}>
            <Translate id="contact.header.title">联系</Translate>{' '}
            <span className={styles.titleAccent}>
              <Translate id="contact.header.titleAccent">开发者</Translate>
            </span>
          </h1>
          
          <p className={styles.description}>
            <Translate id="contact.header.description">
              启动直接通信。选择任务类别将优先处理您的数据包。
            </Translate>
          </p>
          
          {/* Decorative Crow */}
          <div className={styles.crowDecor}>
            <span className="material-symbols-outlined">raven</span>
            <div className={styles.scrollIcon}>
              <span className="material-symbols-outlined">scroll</span>
            </div>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Contact Form */}
          <section className={styles.formSection}>
            <div className={styles.formHeader}>
              <div className={styles.formAccent}></div>
              <h2 className={styles.formTitle}>
                <Translate id="contact.form.header">卷轴选择</Translate>
              </h2>
            </div>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Translate id="contact.form.nameLabel">猎鬼人姓名</Translate>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={translate({id: 'contact.form.namePlaceholder2', message: '例如：炭治郎_K'})}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Translate id="contact.form.emailLabel">回信鸽</Translate>
                  </label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder={translate({id: 'contact.form.emailPlaceholder2', message: '用户@星云.网络'})}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Translate id="contact.form.objectiveLabel">任务目标</Translate>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="objective" className={styles.radioInput} />
                    <span className={styles.radioButton}>
                      <span className="material-symbols-outlined">history_edu</span>
                      <Translate id="contact.form.objective.help">请求帮助</Translate>
                    </span>
                  </label>
                  
                  <label className={styles.radioLabel}>
                    <input type="radio" name="objective" className={styles.radioInput} />
                    <span className={`${styles.radioButton} ${styles.radioButtonSecondary}`}>
                      <span className="material-symbols-outlined">bug_report</span>
                      <Translate id="contact.form.objective.bug">恶魔BUG</Translate>
                    </span>
                  </label>
                  
                  <label className={styles.radioLabel}>
                    <input type="radio" name="objective" className={styles.radioInput} defaultChecked />
                    <span className={`${styles.radioButton} ${styles.radioButtonTertiary}`}>
                      <span className="material-symbols-outlined">forum</span>
                      <Translate id="contact.form.objective.chat">鎹鸦聊天</Translate>
                    </span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Translate id="contact.form.messageLabel">卷轴内容</Translate>
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder={translate({id: 'contact.form.messagePlaceholder2', message: '在此展开您的消息...'})}
                  rows={5}
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitButton}>
                <span><Translate id="contact.form.submit">释放信使</Translate></span>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
            
            {/* Success Message */}
            {formSubmitted && (
              <div className={styles.successOverlay}>
                <div className={styles.successStamp}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <h3 className={styles.successTitle}>
                    <Translate id="contact.success.title">任务完成</Translate>
                  </h3>
                  <p className={styles.successText}>
                    <Translate id="contact.success.text">乌鸦已出发</Translate>
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Status Card */}
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <div className={styles.statusTitle}>
                  <Translate id="contact.status.title">呼吸状态</Translate>
                </div>
                <div className={styles.statusBadge}>
                  <Translate id="contact.status.badge">全集中</Translate>
                </div>
              </div>
              
              <div className={styles.statusInfo}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>
                    <Translate id="contact.status.responseTime">平均响应时间</Translate>
                  </span>
                  <span className={styles.statusValue}>
                    <Translate id="contact.status.responseValue">1-2个日落</Translate>
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>
                    <Translate id="contact.status.timezone">主要时区</Translate>
                  </span>
                  <span className={styles.statusValue}>
                    <Translate id="contact.status.timezoneValue">东京/UTC+9</Translate>
                  </span>
                </div>
              </div>
              
              <div className={styles.scannerLine}>
                <div className={styles.scannerProgress}></div>
              </div>
            </div>
            
            {/* Contact Info Grid */}
            <div className={styles.contactGrid}>
              <div className={styles.emailCard}>
                <h4 className={styles.emailTitle}>
                  <Translate id="contact.email.title">直接信号</Translate>
                </h4>
                <p className={styles.emailAddress}>
                  <Translate id="contact.email.address">乌鸦信号@开发漫画.A</Translate>
                </p>
              </div>
              
              <a href="https://twitter.com" className={styles.socialCard}>
                <span className="material-symbols-outlined">alternate_email</span>
                <span className={styles.socialLabel}>
                  <Translate id="contact.social.twitter">推特</Translate>
                </span>
              </a>
              
              <a href="https://github.com" className={`${styles.socialCard} ${styles.socialCardAlt}`}>
                <span className="material-symbols-outlined">terminal</span>
                <span className={styles.socialLabel}>
                  <Translate id="contact.social.github">GitHub</Translate>
                </span>
              </a>
            </div>
            
            {/* Visual Card */}
            <div className={styles.visualCard}>
              <img src="/img/head.jpg" alt="Studio Space" className={styles.visualImage} />
              <div className={styles.visualOverlay}>
                <p className={styles.visualText}>
                  <Translate id="contact.visual.text">作战基地</Translate>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
