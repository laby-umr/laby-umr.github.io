import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './TestimonialsCarousel.module.css';

const TestimonialsCarousel = ({
  testimonials,
  autoplay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval, testimonials.length]);
  
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={styles.star}
          viewBox="0 0 20 20" 
          fill={i <= rating ? "currentColor" : "none"}
          stroke={i <= rating ? "none" : "currentColor"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.carouselWrapper}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ width: '100%' }}
          >
            <div className={styles.testimonialCard}>
                <div className={styles.content}>
                  <div className={styles.quote}>"</div>
                  <p className={styles.text}>{testimonials[currentIndex].content}</p>
                  
                  <div className={styles.author}>
                    {testimonials[currentIndex].image && (
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className={styles.avatar}
                      />
                    )}
                    <div className={styles.authorInfo}>
                      <div className={styles.name}>{testimonials[currentIndex].name}</div>
                      <div className={styles.role}>
                        {testimonials[currentIndex].role}
                        {testimonials[currentIndex].company && ` @ ${testimonials[currentIndex].company}`}
                      </div>
                    </div>
                  </div>
                  
                  {testimonials[currentIndex].rating && (
                    <div className={styles.rating}>
                      {renderRating(testimonials[currentIndex].rating)}
                    </div>
                  )}
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button onClick={handlePrev} className={`${styles.navButton} ${styles.prevButton} cursor-target`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button onClick={handleNext} className={`${styles.navButton} ${styles.nextButton} cursor-target`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className={styles.indicators}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''} cursor-target`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
