import React from 'react';
import './GlitchText.css';

const GlitchText = ({ 
  children, 
  speed = 1, 
  enableShadows = true, 
  enableOnHover = true, 
  className = '',
  style = {}
}) => {
  // 提取文本内容，处理 React 元素
  const getText = (node) => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (node?.props?.children) return getText(node.props.children);
    return '';
  };

  const textContent = getText(children);

  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-2px 0 #ff00ff' : 'none',
    '--before-shadow': enableShadows ? '2px 0 #00ffff' : 'none',
    ...style
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <span className={`glitch ${hoverClass} ${className}`} style={inlineStyles} data-text={textContent}>
      {children}
    </span>
  );
};

export default GlitchText;
