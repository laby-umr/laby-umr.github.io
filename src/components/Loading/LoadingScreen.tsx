import React, { useState, useEffect, useRef } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps): JSX.Element {
  const [progress, setProgress] = useState(0);
  const [isFrenzyMode, setIsFrenzyMode] = useState(false);
  const [combo, setCombo] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [slashes, setSlashes] = useState<Array<{ id: number; angle: number; offset: number }>>([]);
  const [isShattering, setIsShattering] = useState(false);
  const [comboHit, setComboHit] = useState(false);
  
  const slashIdCounter = useRef(0);
  const autoLoading = useRef(true);

  // Phase 1: 快速自动加载到97%
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLoading.current) {
        setProgress((prev) => {
          const increment = Math.random() * 2 + 0.5;
          const newProgress = prev + increment;
          
          if (newProgress >= 97) {
            autoLoading.current = false;
            clearInterval(interval);
            setIsFrenzyMode(true);
            return 97;
          }
          return newProgress;
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 监听空格键和回车键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && isFrenzyMode && !isShattering) {
        e.preventDefault();
        handleInput();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFrenzyMode, isShattering, progress]);

  const handleInput = () => {
    if (!isFrenzyMode || isShattering) return;

    // 屏幕抖动
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    // 进度增加1%
    const newProgress = Math.min(progress + 1, 100);
    setProgress(newProgress);

    // Combo增加
    setCombo(prev => prev + 1);
    
    // Combo重击动画
    setComboHit(true);
    setTimeout(() => setComboHit(false), 300);

    // 触发斜线特效
    triggerSlash();

    // 到达100%触发shatter
    if (newProgress >= 100) {
      triggerShatter();
    }
  };

  const triggerSlash = () => {
    for (let i = 0; i < 3; i++) {
      const slashId = slashIdCounter.current++;
      const angle = Math.random() * 360;
      const offset = (Math.random() - 0.5) * 500;
      setSlashes(prev => [...prev, { id: slashId, angle, offset }]);
      setTimeout(() => {
        setSlashes(prev => prev.filter(s => s.id !== slashId));
      }, 250);
    }
  };

  const triggerShatter = () => {
    setIsShattering(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className={`${styles.loadingScreen} ${isShattering ? styles.shattering : ''}`}>
      {/* Slash Layer */}
      <div className={styles.slashLayer}>
        {slashes.map(slash => (
          <div
            key={slash.id}
            className={styles.slash}
            style={{
              '--angle': `${slash.angle}deg`,
              '--offset': `${slash.offset}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Background Layer */}
      <div className={styles.background}>
        <div className={styles.japanesePattern}></div>
        <div className={styles.gradient}></div>
      </div>

      {/* Main Content */}
      <main className={`${styles.mainContent} ${isShaking ? styles.shakeActive : ''}`}>
        {/* Top Header Status */}
        <div className={styles.topHeader}>
          <div className={styles.statusLeft}>
            <span className={styles.statusLabel}>System Status</span>
            <span className={`${styles.statusValue} ${isFrenzyMode ? styles.statusFrenzy : ''}`}>
              {isFrenzyMode ? 'CRITICAL LIMIT REACHED' : 'INITIALIZING...'}
            </span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statusRight}>
            <span className={styles.statusLabel}>User Level</span>
            <span className={styles.statusValueSecondary}>HASHIRA_DEV_L7</span>
          </div>
        </div>

        {/* Centerpiece */}
        <div className={styles.centerpiece}>
          {/* Branding */}
          <div className={styles.branding}>
            <h1 className={styles.title}>
              LIU <span className={styles.titleHighlight}>JIAXING</span>
            </h1>
            <p className={styles.subtitle}>
              <span className={styles.subtitleLine}></span>
              THE CODE SLAYER
              <span className={styles.subtitleLine}></span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <div className={styles.progressInfo}>
                <span className={styles.progressTitle}>TOTAL CONCENTRATION</span>
                <span className={styles.progressSubtitle}>
                  {isFrenzyMode ? 'BREATHING TECHNIQUE: NINTH FORM - BURST' : 'BREATHING TECHNIQUE: STANDBY'}
                </span>
              </div>
              <div className={styles.progressPercentage}>
                <span>{Math.floor(progress)}%</span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${progress}%` }}
              >
                <div className={styles.progressTexture}></div>
                <div className={styles.progressStripes}>
                  <div className={styles.stripe}></div>
                  <div className={styles.stripe}></div>
                  <div className={styles.stripe}></div>
                </div>
              </div>
            </div>

            {/* Sub-labels */}
            <div className={styles.progressLabels}>
              <div className={styles.label}>
                <span className="material-symbols-outlined">water_drop</span>
                Flow State Active
              </div>
              <div className={styles.label}>
                <span className="material-symbols-outlined">local_fire_department</span>
                V8 Engine Ignited
              </div>
              <div className={styles.label}>
                <span className="material-symbols-outlined">electric_bolt</span>
                Neural Link Stable
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            {/* Combo Counter */}
            <div className={`${styles.comboContainer} ${isFrenzyMode ? styles.comboVisible : ''} ${comboHit ? styles.comboHit : ''}`}>
              <span className={styles.comboLabel}>COMBO</span>
              <span className={styles.comboX}>x</span>
              <div className={styles.explosionBubble}>
                <div className={styles.explosionOrange}></div>
                <span className={styles.comboNumber}>{combo}</span>
              </div>
            </div>

            <button 
              className={`${styles.enterButton} ${isFrenzyMode ? styles.enterButtonFrenzy : ''}`}
              onClick={handleInput}
              disabled={!isFrenzyMode}
            >
              <span className={styles.buttonText}>
                {isFrenzyMode ? (
                  <>
                    BURST REALM
                    <span className="material-symbols-outlined">bolt</span>
                  </>
                ) : (
                  <>
                    INITIALIZING...
                  </>
                )}
              </span>
              <div className={styles.buttonShine}></div>
              
              {isFrenzyMode && (
                <>
                  <div className={`${styles.frenzyCue} ${styles.frenzyCueTop}`}>CLICK ME!</div>
                  <div className={`${styles.frenzyCue} ${styles.frenzyCueBottom}`}>MASH!</div>
                </>
              )}
            </button>
            
            <p className={styles.ctaHint}>
              {isFrenzyMode ? (
                <>
                  MASH <span className={styles.keyHint}>SPACE</span> OR <span className={styles.ctaHighlight}>CLICK</span> TO BREAK THROUGH!
                </>
              ) : (
                <>
                  Press <span className={styles.keyHint}>SPACE</span> to enter faster
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span>VER: 2024.NICHO_DEV</span>
            <span className={styles.footerDivider}></span>
            <span>ENC: NEOTOKYO_CEL</span>
          </div>
          <div className={styles.footerRight}>
            <a href="https://github.com/laby-umr" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Archives</a>
          </div>
        </div>
      </main>

      {/* Screen Grain */}
      <div className={styles.screenGrain}></div>

      {/* Shatter Overlay */}
      {isShattering && <div className={styles.shatterOverlay}></div>}
    </div>
  );
}
