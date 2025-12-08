// 节流函数工具
export function throttle(func, wait) {
  let timeout = null;
  let previous = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// requestAnimationFrame 节流
export function rafThrottle(func) {
  let ticking = false;
  
  return function(...args) {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
    }
  };
}
