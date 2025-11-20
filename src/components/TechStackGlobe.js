import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './TechStackGlobe.module.css';

const TechStackGlobe = ({
  items,
  radius = 200,
  speed = 1,
  opacity = 0.7,
  interactive = true,
  height = '600px'
}) => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  
  // Transform mouse motion to rotation
  const rotateX = useTransform(mouseY, [-300, 300], [30, -30]);
  const rotateY = useTransform(mouseX, [-300, 300], [-30, 30]);

  useEffect(() => {
    // Initialize tags with random positions
    const newTags = items.map((item, index) => {
      // Distribute tags evenly on the surface of a sphere
      const phi = Math.acos(-1 + (2 * index) / items.length);
      const theta = Math.sqrt(items.length * Math.PI) * phi;
      
      // Convert spherical to cartesian coordinates
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      return {
        ...item,
        position: { x, y, z },
        target: { x, y, z },
        velocity: { x: 0, y: 0, z: 0 },
        size: item.size || Math.random() * 0.7 + 0.5,
        color: item.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
        highlighted: false
      };
    });
    
    setTags(newTags);
    setTimeout(() => setLoaded(true), 200);
  }, [items, radius]);

  useEffect(() => {
    if (!containerRef.current || !interactive) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate relative mouse position to center of container
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, mouseX, mouseY]);

  useEffect(() => {
    // Animation loop for 3D rotation
    let animationId;
    let lastTime = 0;
    const baseRotationSpeed = 0.0005 * speed;

    const animate = (time) => {
      if (!containerRef.current) return;
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      setTags(prevTags => {
        return prevTags.map(tag => {
          // Apply rotation around Y axis (simplified 3D rotation)
          const rotationSpeed = active ? baseRotationSpeed * 0.2 : baseRotationSpeed;
          const cos = Math.cos(deltaTime * rotationSpeed);
          const sin = Math.sin(deltaTime * rotationSpeed);
          
          const x = tag.position.x * cos - tag.position.z * sin;
          const z = tag.position.x * sin + tag.position.z * cos;
          
          // Smooth motion toward target position
          const newPosition = {
            x: x,
            y: tag.position.y,
            z: z
          };
          
          // Highlight tags closer to front
          const highlighted = z > 0;
          
          return {
            ...tag,
            position: newPosition,
            highlighted
          };
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [active, speed]);
  
  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ height }}
    >
      <motion.div 
        className={styles.globe}
        style={{
          rotateX: active ? rotateX : 0,
          rotateY: active ? rotateY : 0,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: loaded ? 1 : 0, 
          scale: loaded ? 1 : 0.8,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {tags.map((tag, index) => {
          // Calculate z-depth for size scaling and opacity
          const scale = (tag.position.z + radius) / (2 * radius);
          const tagScale = 0.8 + scale * 0.7;
          const tagOpacity = Math.max(0.4, Math.min(1, scale)) * opacity;
          const zIndex = Math.round(100 * scale);
          
          return (
            <motion.div
              key={index}
              className={styles.tagWrapper}
              style={{
                zIndex,
                transform: `translate3d(${tag.position.x}px, ${tag.position.y}px, ${tag.position.z}px)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: tagOpacity }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`${styles.tag} ${tag.highlighted ? styles.highlighted : ''}`}
                style={{
                  backgroundColor: tag.highlighted 
                    ? `${tag.color}40`
                    : `${tag.color}20`,
                  color: tag.color,
                  borderColor: `${tag.color}60`,
                  transform: `scale(${tagScale * tag.size})`,
                  boxShadow: tag.highlighted 
                    ? `0 0 15px ${tag.color}60` 
                    : 'none',
                }}
                whileHover={{ 
                  scale: tagScale * tag.size * 1.2,
                  backgroundColor: `${tag.color}60`,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
              >
                {tag.name}
              </motion.div>
            </motion.div>
          );
        })}
        
        {/* Central glow effect */}
        <div className={styles.centralGlow}></div>
      </motion.div>
      
      {/* Background grid effect */}
      <motion.div 
        className={styles.backgroundGrid}
        style={{
          transform: `perspective(1000px) rotateX(${active ? -rotateX.get() * 0.2 : 0}deg) rotateY(${active ? -rotateY.get() * 0.2 : 0}deg)`
        }}
      />
    </div>
  );
};

export default TechStackGlobe;
