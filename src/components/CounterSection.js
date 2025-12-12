import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CounterSection.module.css';
const CounterSection = ({
  items,
  title,
  subtitle,
  columns = 4,
  animationDuration = 2,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(items.map(() => 0));

  useEffect(() => {
    if (!isVisible) return;

    const interval = 20; // ms between each increment
    const framesTotal = animationDuration * 1000 / interval;
    
    const incrementValues = items.map(item => item.value / framesTotal);
    const countersActive = new Array(items.length).fill(true);
    
    const timer = setInterval(() => {
      setCounts(prev => {
        const newCounts = [...prev];
        let allCompleted = true;
        
        for (let i = 0; i < items.length; i++) {
          if (countersActive[i]) {
            newCounts[i] = Math.min(newCounts[i] + incrementValues[i], items[i].value);
            countersActive[i] = newCounts[i] < items[i].value;
            allCompleted = allCompleted && !countersActive[i];
          }
        }
        
        if (allCompleted) {
          clearInterval(timer);
        }
        
        return newCounts;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [isVisible, items, animationDuration]);

  // Grid columns class based on the columns prop
  const columnsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={() => setIsVisible(true)}
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="cursor-target"
        >
            <div className={styles.card} style={{ '--border-color': item.color }}>
              <div className={styles.trail3} style={{ '--border-color': item.color }}></div>
              <div className={styles.trail4} style={{ '--border-color': item.color }}></div>
              {item.icon && (
                <div className={styles.icon} style={{ color: item.color }}>
                  {item.icon}
                </div>
              )}
              <div className={styles.numberWrapper}>
                {item.prefix && <span className={styles.prefix} style={{ color: item.color }}>{item.prefix}</span>}
                <span className={styles.number} style={{ color: item.color }}>
                  {Math.round(counts[index])}
                </span>
                {item.suffix && <span className={styles.suffix} style={{ color: item.color }}>{item.suffix}</span>}
              </div>
              <p className={styles.label}>{item.label}</p>
            </div>

        </motion.div>
      ))}
    </motion.div>
  );
};

export default CounterSection; 