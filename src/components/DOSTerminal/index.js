import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';

// 简化的代码雨效果
const CodeRain = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 代码雨配置 - 更稀疏、更优雅
    const fontSize = 14;
    const columns = Math.floor(canvas.width / (fontSize * 2)); // 更稀疏的列
    const drops = new Array(columns).fill(1);
    
    // 使用代码片段作为字符
    const codeSnippets = ['<', '>', '/', '{', '}', '(', ')', ';', ':', '=', '+', '-', '*', '0', '1'];
    
    const draw = () => {
      // 更深的背景，更好的拖尾效果
      ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px 'Fira Code', monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        const x = i * fontSize * 2;
        const y = drops[i] * fontSize;
        
        // 使用更柔和的颜色
        ctx.fillStyle = `rgba(139, 148, 158, ${Math.random() * 0.5 + 0.1})`;
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 100); // 更慢的速度
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.codeRainCanvas} />;
};


const DOSTerminal = () => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const terminalRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  
  // 终端内矩阵雨效果 - 每个字符独立管理拖尾
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // LABY 矩阵雨配置
    const fontSize = 14;
    const columnSpacing = fontSize * 3;
    const columns = Math.floor(canvas.width / columnSpacing);
    
    // 每列的字符数组，存储历史字符用于拖尾效果
    const columnsData = Array(columns).fill(null).map(() => ({
      y: Math.random() * canvas.height,
      trail: [] // 存储拖尾字符
    }));
    
    // LABY 字符集
    const labyChars = ['L', 'A', 'B', 'Y'];
    const codeChars = ['0', '1', '<', '>', '/', '{', '}', '(', ')', ';', '='];
    
    const draw = () => {
      // 完全清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px 'Fira Code', monospace`;
      
      columnsData.forEach((column, i) => {
        const x = i * columnSpacing;
        
        // 添加新字符到拖尾
        if (Math.random() > 0.5) { // 50%概率添加新字符
          const isLABY = Math.random() < 0.3;
          const char = isLABY 
            ? labyChars[Math.floor(Math.random() * labyChars.length)]
            : codeChars[Math.floor(Math.random() * codeChars.length)];
          
          column.trail.push({
            char,
            y: column.y,
            opacity: 1,
            isLABY
          });
          
          column.y += fontSize;
        }
        
        // 绘制拖尾中的所有字符
        column.trail = column.trail.filter(item => {
          // 渐隐效果
          item.opacity -= 0.02;
          
          if (item.opacity <= 0) return false;
          
          if (item.isLABY) {
            // LABY 字符 - 明亮绿色
            ctx.fillStyle = `rgba(0, 255, 0, ${item.opacity})`;
            ctx.shadowBlur = 10 * item.opacity;
            ctx.shadowColor = `rgba(0, 255, 0, ${item.opacity * 0.5})`;
          } else {
            // 其他字符 - 柔和绿色
            ctx.fillStyle = `rgba(0, 200, 0, ${item.opacity * 0.6})`;
            ctx.shadowBlur = 5 * item.opacity;
            ctx.shadowColor = `rgba(0, 255, 0, ${item.opacity * 0.2})`;
          }
          
          ctx.fillText(item.char, x, item.y);
          
          return true; // 保留还有透明度的字符
        });
        
        // 重置列
        if (column.y > canvas.height && Math.random() > 0.98) {
          column.y = 0;
          column.trail = [];
        }
      });
    };
    
    const interval = setInterval(draw, 50);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // 启动序列 - 英文内容
  const bootSequence = [
    { text: '$ Initializing system...', delay: 0, type: 'system' },
    { text: '$ Loading components...', delay: 400, type: 'loading' },
    { text: '', delay: 600, type: 'empty' },
    { text: '╭─────────────────────────────────────╮', delay: 800, type: 'box' },
    { text: '│   WELCOME TO LABY\'S BLOG           │', delay: 1000, type: 'highlight' },
    { text: '│   Full-Stack Development Journey    │', delay: 1200, type: 'box' },
    { text: '╰─────────────────────────────────────╯', delay: 1400, type: 'box' },
    { text: '', delay: 1600, type: 'empty' },
    { text: 'laby@blog:~$ npm start', delay: 2000, type: 'command' },
    { text: '', delay: 2200, type: 'empty' },
    { text: '> Starting development server...', delay: 2500, type: 'output' },
    { text: '[████████████████████] 100%', delay: 3200, type: 'loading' },
    { text: '', delay: 3400, type: 'empty' },
    { text: '✓ React 18.2.0', delay: 3600, type: 'success' },
    { text: '✓ TypeScript 5.0', delay: 3800, type: 'success' },
    { text: '✓ Next.js 14.0', delay: 4000, type: 'success' },
    { text: '✓ Tailwind CSS', delay: 4200, type: 'success' },
    { text: '', delay: 4400, type: 'empty' },
    { text: '🚀 Server running at http://localhost:3000', delay: 4800, type: 'highlight' },
    { text: '', delay: 5000, type: 'empty' },
    { text: '> Ready to explore the code universe...', delay: 5400, type: 'matrix' },
    { text: 'laby@blog:~$ _', delay: 6000, type: 'prompt', showCursor: true, final: true }
  ];
  
  useEffect(() => {
    let timeouts = [];
    let isActive = true;
    
    const runAnimation = () => {
      if (!isActive) return;
      
      // 清空之前的内容
      setLines([]);
      setCurrentLineIndex(0);
      
      // 运行动画序列
      bootSequence.forEach((line, index) => {
        const timeout = setTimeout(() => {
          if (!isActive) return;
          
          setLines(prev => [...prev, line]);
          setCurrentLineIndex(index);
          
          // 触发抖动效果 - 对于重要的行
          if (line.type === 'highlight' || line.type === 'success' || line.type === 'command' || line.type === 'box') {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 300); // 300ms后停止抖动
          }
          
          // 自动滚动到底部
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
          
          // 如果是最后一行，等待后重新开始
          if (index === bootSequence.length - 1) {
            // 最后一行也触发一次强烈抖动
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            
            const restartTimeout = setTimeout(() => {
              if (isActive) {
                runAnimation(); // 重新开始动画
              }
            }, 3000); // 3秒后重新开始
            timeouts.push(restartTimeout);
          }
        }, line.delay);
        
        timeouts.push(timeout);
      });
    };
    
    // 开始第一次动画
    runAnimation();
    
    return () => {
      isActive = false;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  const renderLine = (line, index) => {
    const isLastLine = index === lines.length - 1;
    const showBlinkingCursor = line.showCursor && (isLastLine || line.final);
    
    let className = styles.line;
    if (line.type === 'system') className = styles.systemLine;
    if (line.type === 'prompt') className = styles.promptLine;
    if (line.type === 'command') className = styles.commandLine;
    if (line.type === 'output') className = styles.outputLine;
    if (line.type === 'info') className = styles.infoLine;
    if (line.type === 'success') className = styles.successLine;
    if (line.type === 'highlight') className = styles.highlightLine;
    if (line.type === 'loading') className = styles.loadingLine;
    if (line.type === 'box') className = styles.boxLine;
    if (line.type === 'matrix') className = styles.matrixLine;
    
    return (
      <div key={index} className={className}>
        <span className={isLastLine && !line.final ? styles.typing : ''}>
          {line.text}
        </span>
        {showBlinkingCursor && <span className={styles.cursor}>▊</span>}
      </div>
    );
  };
  
  return (
    <div 
      className={`${styles.terminal} ${isHovered ? styles.hovered : ''} ${isShaking ? styles.shaking : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 外部代码雨背景 */}
      <CodeRain />
      
      {/* 统一的终端窗口 */}
      <div className={styles.terminalWindow}>
        {/* macOS 风格标题栏 */}
        <div className={styles.titleBar}>
          <div className={styles.windowButtons}>
            <span className={styles.closeBtn}></span>
            <span className={styles.minimizeBtn}></span>
            <span className={styles.maximizeBtn}></span>
          </div>
          <div className={styles.titleText}>Terminal — laby@blog</div>
        </div>
        
        {/* 终端内容区域 - 包含矩阵雨背景 */}
        <div className={styles.terminalContent}>
          {/* LABY 矩阵雨背景 */}
          <canvas ref={matrixCanvasRef} className={styles.matrixBackground} />
          
          {/* 终端文字内容 */}
          <div className={styles.terminalBody} ref={terminalRef}>
            {lines.map((line, index) => renderLine(line, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DOSTerminal;
